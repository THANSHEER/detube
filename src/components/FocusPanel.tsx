import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield, Timer, CalendarClock, Gauge,
  Play, Square, Minus, Plus, ArrowRight,
} from 'lucide-react';
import {
  DeTubeFocus,
  type FocusConfig, type FocusStats, type BlockingMode,
  FOCUS_DEFAULTS, STATS_DEFAULTS,
} from '../lib/storage';

const DAYS_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const TIMER_PRESETS = [
  { label: '25m', value: 25 },
  { label: '45m', value: 45 },
  { label: '1h',  value: 60 },
  { label: '2h',  value: 120 },
];

const LIMIT_PRESETS = [
  { label: '30m', value: 30 },
  { label: '1h',  value: 60 },
  { label: '2h',  value: 120 },
  { label: '3h',  value: 180 },
];

const MODE_ITEMS: { id: BlockingMode; Icon: typeof Shield; label: string }[] = [
  { id: 'always',      Icon: Shield,        label: 'Always'   },
  { id: 'timer',       Icon: Timer,         label: 'Timer'    },
  { id: 'schedule',    Icon: CalendarClock, label: 'Schedule' },
  { id: 'daily-limit', Icon: Gauge,         label: 'Limit'    },
];

const STAT_COLORS = { today: '#ff6b6b', streak: '#fb923c', sessions: '#34d399', allTime: '#60a5fa' };


export interface FocusPanelProps {
  onSetEnabled: (val: boolean) => Promise<void>;
}

function isScheduleActive(config: FocusConfig): boolean {
  if (!config.scheduleEnabled) return false;
  const now = new Date();
  const day = now.getDay();
  if (!config.scheduleDays.includes(day)) return false;
  const [sh, sm] = config.scheduleStartTime.split(':').map(Number);
  const [eh, em] = config.scheduleEndTime.split(':').map(Number);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  
  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  
  if (startMins <= endMins) {
    return nowMins >= startMins && nowMins < endMins;
  } else {
    return nowMins >= startMins || nowMins < endMins;
  }
}

function formatTime(mins: number): string {
  if (mins === 0) return '0m';
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h${m}m` : `${h}h`;
}

function fmtStepper(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return `${h} hr`;
  return `${h}h ${m}m`;
}

function stepUp(val: number, max = 1440): number {
  return Math.min(max, val + (val < 60 ? 5 : 15));
}

function stepDown(val: number, min = 5): number {
  return Math.max(min, val - (val <= 60 ? 5 : 15));
}

export const FocusPanel: React.FC<FocusPanelProps> = ({ onSetEnabled }) => {
  const [config, setConfig] = useState<FocusConfig>(FOCUS_DEFAULTS);
  const [stats,  setStats]  = useState<FocusStats>(STATS_DEFAULTS);
  const [countdown,  setCountdown]  = useState('');
  const [elapsedPct, setElapsedPct] = useState(0);

  useEffect(() => {
    DeTubeFocus.getConfig().then(setConfig);
    DeTubeFocus.getStats().then(setStats);
    DeTubeFocus.onFocusChanged(setConfig);
    DeTubeFocus.onStatsChanged(setStats);
  }, []);

  useEffect(() => {
    if (!config.timerEndTime) { setCountdown(''); setElapsedPct(0); return; }
    const totalMs = config.timerDurationMinutes * 60 * 1000;
    const tick = () => {
      const rem = (config.timerEndTime ?? 0) - Date.now();
      if (rem <= 0) { setCountdown('00:00'); setElapsedPct(100); return; }
      setElapsedPct(Math.min(100, ((totalMs - rem) / totalMs) * 100));
      const s  = Math.ceil(rem / 1000);
      const h  = Math.floor(s / 3600);
      const m  = Math.floor((s % 3600) / 60);
      const ss = s % 60;
      setCountdown(
        h > 0
          ? `${h}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
          : `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [config.timerEndTime, config.timerDurationMinutes]);

  const patchConfig = useCallback((p: Partial<FocusConfig>) => DeTubeFocus.saveConfig(p), []);

  const handleModeChange = async (mode: BlockingMode) => {
    const patch: Partial<FocusConfig> = { blockingMode: mode };

    // Disable schedule if leaving schedule mode
    if (mode !== 'schedule' && config.scheduleEnabled) {
      patch.scheduleEnabled = false;
    }

    // Clear timer state if leaving timer mode
    if (mode !== 'timer' && config.timerEndTime) {
      patch.timerEndTime = null;
      // Only disable extension if a timer was ACTIVELY running
      const wasTimerRunning = config.timerEndTime > Date.now();
      if (wasTimerRunning) {
        await onSetEnabled(false);
      }
    }

    await patchConfig(patch);
  };

  const handleStartTimer = async () => {
    const minutes  = config.timerDurationMinutes;
    const endTime  = Date.now() + minutes * 60 * 1000;
    await patchConfig({ timerEndTime: endTime, timerDurationMinutes: minutes });
    await onSetEnabled(true);
    const s = await DeTubeFocus.getStats();
    await DeTubeFocus.saveStats({ sessionCount: s.sessionCount + 1 });
  };

  const handleStopTimer = async () => {
    await patchConfig({ timerEndTime: null });
    await onSetEnabled(false);
  };

  const handleToggleDay = async (day: number) => {
    const days = config.scheduleDays.includes(day)
      ? config.scheduleDays.filter((d) => d !== day)
      : [...config.scheduleDays, day].sort((a, b) => a - b);
    await patchConfig({ scheduleDays: days });
  };

  const handleToggleSchedule = async () => {
    const next = !config.scheduleEnabled;
    await patchConfig({ scheduleEnabled: next });
    await onSetEnabled(next ? isScheduleActive({ ...config, scheduleEnabled: true }) : false);
  };

  const today    = new Date().toISOString().split('T')[0];
  const usedSec  = config.dailyResetDate === today ? config.dailyUsedSeconds : 0;
  const usedMin  = Math.floor(usedSec / 60);
  const leftMin  = Math.max(0, config.dailyLimitMinutes - usedMin);
  const usagePct = Math.min(100, (usedSec / (config.dailyLimitMinutes * 60)) * 100);
  const isRunning = !!config.timerEndTime && Date.now() < config.timerEndTime;

  const dur = config.timerDurationMinutes;
  const timerLabel = dur < 60 ? `${dur}m` : dur % 60 === 0 ? `${dur/60}h` : `${Math.floor(dur/60)}h${dur%60}m`;

  const isBlockingActive =
    config.blockingMode === 'always' ||
    (config.blockingMode === 'timer' && isRunning) ||
    (config.blockingMode === 'schedule' && config.scheduleEnabled && isScheduleActive(config)) ||
    (config.blockingMode === 'daily-limit' && config.dailyLimitMinutes > 0 && usedMin >= config.dailyLimitMinutes);

  const modeLabels: Record<BlockingMode, string> = {
    always: 'Always On', timer: 'Focus Timer', schedule: 'Schedule', 'daily-limit': 'Daily Limit',
  };
  const statusLabel = isBlockingActive ? 'Blocking Active' : 'Not Blocking';
  const statusSub   = isBlockingActive ? modeLabels[config.blockingMode] : 'Choose a mode below to start';


  return (
    <>
      {/* ── Status Hero ──────────────────────────────────────────── */}
      <div className={`dt-status-hero${isBlockingActive ? ' active' : ''}`}>
        <div className={`dt-status-dot${isBlockingActive ? ' on' : ''}`} />
        <div className="dt-status-text-group">
          <p className="dt-status-text">{statusLabel}</p>
          <p className="dt-status-sub">{statusSub}</p>
        </div>
        {config.blockingMode === 'timer' && isRunning && countdown && (
          <span className="dt-status-countdown-badge">{countdown}</span>
        )}
      </div>

      {/* ── Blocking Mode — tab strip ────────────────────────────── */}
      <section>
        <p className="dt-settings-section-title">Blocking Mode</p>
        <div className="dt-mode-tabs">
          {MODE_ITEMS.map(({ id, Icon, label }) => {
            const active = config.blockingMode === id;
            return (
              <button
                key={id}
                onClick={() => handleModeChange(id)}
                className={`dt-mode-tab${active ? ' active' : ''}`}
              >
                <Icon size={14} strokeWidth={active ? 2.4 : 1.8} />
                <span className="dt-mode-tab-label">{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Always On ────────────────────────────────────────────── */}
      {config.blockingMode === 'always' && (
        <section className="animate-fade-in">
          <div className="dt-panel-card">
            {/* Icon + title row */}
            <div className="dt-always-info">
              <div className="dt-always-info-icon">
                <Shield size={18} strokeWidth={2.2} />
              </div>
              <div>
                <p className="dt-always-info-title">Always Blocking</p>
                <p className="dt-always-info-sub">All pages · No schedule needed</p>
              </div>
            </div>
            <div className="dt-panel-sep" />
            {/* Description row */}
            <p className="dt-always-block-desc">
              YouTube is fully blocked everywhere, all the time. No timer or schedule required.
            </p>
            <div className="dt-panel-sep" />
            {/* Status bar */}
            <div className="dt-always-status-bar">
              <div className="dt-always-pulse" />
              Active · No configuration needed
            </div>
          </div>
        </section>
      )}

      {/* ── Focus Timer ──────────────────────────────────────────── */}
      {config.blockingMode === 'timer' && (
        <section className="animate-fade-in">
          {isRunning ? (
            /* Running state — progress bar + countdown + stop */
            <div className="dt-timer-running-card">
              <div className="dt-timer-bar">
                <div className="dt-timer-bar-fill" style={{ width: `${elapsedPct}%` }} />
              </div>
              <div className="dt-timer-countdown-body">
                <p className="dt-timer-countdown-label">Time Remaining</p>
                <p className="dt-timer-countdown-num">{countdown}</p>
              </div>
              <div className="dt-panel-sep" />
              <button onClick={handleStopTimer} className="dt-panel-btn dt-panel-btn-danger">
                <Square size={11} strokeWidth={2.5} /> Stop Session
              </button>
            </div>
          ) : (
            /* Idle state — stepper + presets + start */
            <div className="dt-panel-card">
              <div className="dt-timer-stepper">
                <button
                  className="dt-timer-stepper-btn"
                  onClick={() => patchConfig({ timerDurationMinutes: stepDown(config.timerDurationMinutes) })}
                  disabled={config.timerDurationMinutes <= 5}
                >
                  <Minus size={13} strokeWidth={2.5} />
                </button>
                <div className="dt-timer-stepper-center">
                  <span className="dt-timer-stepper-num">{fmtStepper(config.timerDurationMinutes)}</span>
                </div>
                <button
                  className="dt-timer-stepper-btn"
                  onClick={() => patchConfig({ timerDurationMinutes: stepUp(config.timerDurationMinutes) })}
                  disabled={config.timerDurationMinutes >= 480}
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </div>
              <div className="dt-panel-sep" />
              <div className="dt-preset-row">
                {TIMER_PRESETS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => patchConfig({ timerDurationMinutes: value })}
                    className={`dt-preset-chip${config.timerDurationMinutes === value ? ' active' : ''}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="dt-panel-sep" />
              <button onClick={handleStartTimer} className="dt-panel-btn dt-panel-btn-primary">
                <Play size={11} strokeWidth={2.5} /> Start {timerLabel} Session
              </button>
            </div>
          )}
        </section>
      )}

      {/* ── Schedule ─────────────────────────────────────────────── */}
      {config.blockingMode === 'schedule' && (
        <section className="animate-fade-in">
          <div className="dt-panel-card">
            {/* Day picker */}
            <div className="dt-sched-days">
              {DAYS_LABELS.map((label, i) => (
                <button
                  key={i}
                  onClick={() => handleToggleDay(i)}
                  className={`dt-day-chip${config.scheduleDays.includes(i) ? ' active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="dt-panel-sep" />
            {/* Time window */}
            <div className="dt-sched-time">
              <div className="dt-sched-time-field">
                <span className="dt-sched-time-label">From</span>
                <input
                  type="time"
                  value={config.scheduleStartTime}
                  onChange={(e) => patchConfig({ scheduleStartTime: e.target.value })}
                  className="dt-sched-time-input"
                />
              </div>
              <ArrowRight size={13} className="dt-sched-time-arrow" strokeWidth={1.8} />
              <div className="dt-sched-time-field" style={{ alignItems: 'flex-end' }}>
                <span className="dt-sched-time-label">To</span>
                <input
                  type="time"
                  value={config.scheduleEndTime}
                  onChange={(e) => patchConfig({ scheduleEndTime: e.target.value })}
                  className="dt-sched-time-input"
                  style={{ textAlign: 'right' }}
                />
              </div>
            </div>
            <div className="dt-panel-sep" />
            {/* Enable button */}
            <button
              onClick={handleToggleSchedule}
              className={`dt-panel-btn${config.scheduleEnabled ? ' dt-panel-btn-active' : ' dt-panel-btn-primary'}`}
            >
              <span className={`dt-btn-dot${config.scheduleEnabled ? ' on' : ''}`} />
              {config.scheduleEnabled ? 'Schedule Active' : 'Enable Schedule'}
            </button>
          </div>
        </section>
      )}

      {/* ── Daily Limit ───────────────────────────────────────────── */}
      {config.blockingMode === 'daily-limit' && (
        <section className="animate-fade-in">
          <div className="dt-panel-card">
            {/* Limit setter row */}
            <div className="dt-limit-row">
              <span className="dt-limit-row-label">Set Limit</span>
              <div className="dt-inline-stepper">
                <button
                  className="dt-inline-stepper-btn"
                  onClick={() => patchConfig({ dailyLimitMinutes: stepDown(config.dailyLimitMinutes) })}
                  disabled={config.dailyLimitMinutes <= 5}
                >
                  <Minus size={11} strokeWidth={2.5} />
                </button>
                <span className="dt-inline-stepper-val">{fmtStepper(config.dailyLimitMinutes)}</span>
                <button
                  className="dt-inline-stepper-btn"
                  onClick={() => patchConfig({ dailyLimitMinutes: stepUp(config.dailyLimitMinutes) })}
                  disabled={config.dailyLimitMinutes >= 1440}
                >
                  <Plus size={11} strokeWidth={2.5} />
                </button>
              </div>
            </div>
            <div className="dt-panel-sep" />
            {/* Quick presets */}
            <div className="dt-preset-row">
              {LIMIT_PRESETS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => patchConfig({ dailyLimitMinutes: value })}
                  className={`dt-preset-chip${config.dailyLimitMinutes === value ? ' active' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="dt-panel-sep" />
            {/* Usage — thin progress bar + 3-col stats */}
            <div className="dt-limit-progress">
              <div className="dt-limit-progress-fill" style={{ width: `${usagePct}%` }} />
            </div>
            <div className="dt-usage-stat-row">
              <div className="dt-usage-stat-item">
                <span className="dt-usage-stat-val" style={{ color: '#fb923c' }}>{formatTime(usedMin)}</span>
                <span className="dt-usage-stat-label">Used</span>
              </div>
              <div className="dt-usage-stat-item">
                <span className="dt-usage-stat-val" style={{ color: '#34d399' }}>{formatTime(leftMin)}</span>
                <span className="dt-usage-stat-label">Left</span>
              </div>
              <div className="dt-usage-stat-item">
                <span className="dt-usage-stat-val" style={{ color: 'var(--dt-text-secondary)' }}>
                  {Math.round(usagePct)}%
                </span>
                <span className="dt-usage-stat-label">Usage</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Focus Stats ──────────────────────────────────────────── */}
      <section>
        <p className="dt-settings-section-title">Focus Stats</p>
        <div className="dt-stats-row">
          <div className="dt-stat-cell dt-stat-tint-red">
            <p className="dt-stat-cell-value" style={{ color: STAT_COLORS.today }}>
              {formatTime(stats.focusMinutesToday)}
            </p>
            <p className="dt-stat-cell-label">Today</p>
          </div>
          <div className="dt-stat-cell dt-stat-tint-orange">
            <p className="dt-stat-cell-value" style={{ color: STAT_COLORS.streak }}>
              {stats.streak}
            </p>
            <p className="dt-stat-cell-label">Streak</p>
          </div>
          <div className="dt-stat-cell dt-stat-tint-green">
            <p className="dt-stat-cell-value" style={{ color: STAT_COLORS.sessions }}>
              {stats.sessionCount}
            </p>
            <p className="dt-stat-cell-label">Sessions</p>
          </div>
          <div className="dt-stat-cell dt-stat-tint-blue">
            <p className="dt-stat-cell-value" style={{ color: STAT_COLORS.allTime }}>
              {formatTime(stats.focusMinutesTotal)}
            </p>
            <p className="dt-stat-cell-label">All Time</p>
          </div>
        </div>
      </section>
    </>
  );
};
