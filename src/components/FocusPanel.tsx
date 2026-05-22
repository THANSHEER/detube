import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield, Timer, CalendarClock, Gauge,
  Flame, BarChart3, TrendingUp, Activity,
  Play, Square,
} from 'lucide-react';
import {
  DeTubeFocus,
  type FocusConfig, type FocusStats, type BlockingMode,
  FOCUS_DEFAULTS, STATS_DEFAULTS,
} from '../lib/storage';

const DAYS_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const DURATION_PRESETS = [
  { label: '30m', value: 30 },
  { label: '1h',  value: 60 },
  { label: '2h',  value: 120 },
];

const MODE_CARDS: { id: BlockingMode; Icon: typeof Shield; label: string; desc: string }[] = [
  { id: 'always',      Icon: Shield,        label: 'Always',      desc: 'Permanent'   },
  { id: 'timer',       Icon: Timer,         label: 'Timer',       desc: 'Time-based'  },
  { id: 'schedule',    Icon: CalendarClock, label: 'Schedule',    desc: 'Auto on/off' },
  { id: 'daily-limit', Icon: Gauge,         label: 'Daily Limit', desc: 'Usage cap'   },
];

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
  return nowMins >= sh * 60 + sm && nowMins < eh * 60 + em;
}

function formatFocusTime(mins: number): string {
  if (mins === 0) return '0m';
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export const FocusPanel: React.FC<FocusPanelProps> = ({ onSetEnabled }) => {
  const [config, setConfig] = useState<FocusConfig>(FOCUS_DEFAULTS);
  const [stats, setStats] = useState<FocusStats>(STATS_DEFAULTS);
  const [countdown, setCountdown] = useState('');
  const [customDur, setCustomDur] = useState('');
  const [customLimit, setCustomLimit] = useState('');

  useEffect(() => {
    DeTubeFocus.getConfig().then(setConfig);
    DeTubeFocus.getStats().then(setStats);
    DeTubeFocus.onFocusChanged(setConfig);
    DeTubeFocus.onStatsChanged(setStats);
  }, []);

  useEffect(() => {
    if (!config.timerEndTime) { setCountdown(''); return; }
    const update = () => {
      const remaining = (config.timerEndTime ?? 0) - Date.now();
      if (remaining <= 0) { setCountdown('00:00'); return; }
      const totalSecs = Math.ceil(remaining / 1000);
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      setCountdown(
        h > 0
          ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
          : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [config.timerEndTime]);

  const patchConfig = useCallback((patch: Partial<FocusConfig>) => DeTubeFocus.saveConfig(patch), []);

  const handleModeChange = async (mode: BlockingMode) => {
    const patch: Partial<FocusConfig> = { blockingMode: mode };
    if (mode !== 'schedule' && config.scheduleEnabled) patch.scheduleEnabled = false;
    if (mode !== 'timer' && config.timerEndTime) {
      patch.timerEndTime = null;
      await onSetEnabled(false);
    }
    await patchConfig(patch);
  };

  const handleStartTimer = async (minutes: number) => {
    const endTime = Date.now() + minutes * 60 * 1000;
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

  const handleSaveLimit = async () => {
    const parsed = parseInt(customLimit, 10);
    if (!isNaN(parsed) && parsed > 0) await patchConfig({ dailyLimitMinutes: parsed });
    setCustomLimit('');
  };

  const today = new Date().toISOString().split('T')[0];
  const usedSec = config.dailyResetDate === today ? config.dailyUsedSeconds : 0;
  const usedMin = Math.floor(usedSec / 60);
  const usagePct = Math.min(100, (usedSec / (config.dailyLimitMinutes * 60)) * 100);
  const isTimerRunning = !!config.timerEndTime && Date.now() < config.timerEndTime;
  const activeDur = customDur ? (parseInt(customDur, 10) || config.timerDurationMinutes) : config.timerDurationMinutes;

  const timerLabel = activeDur < 60
    ? `${activeDur}m`
    : activeDur % 60 === 0
      ? `${activeDur / 60}h`
      : `${Math.floor(activeDur / 60)}h${activeDur % 60}m`;

  // Sections rendered as a fragment — container is provided by parent (SettingsPanel)
  return (
    <>
      {/* ── Blocking Mode ── */}
      <section>
        <p className="dt-settings-section-title">Blocking Mode</p>
        <div className="dt-mode-grid">
          {MODE_CARDS.map(({ id, Icon, label, desc }) => {
            const active = config.blockingMode === id;
            return (
              <button
                key={id}
                onClick={() => handleModeChange(id)}
                className={`dt-mode-card${active ? ' active' : ''}`}
              >
                <Icon size={15} strokeWidth={active ? 2.5 : 1.8} />
                <span className="dt-mode-label">{label}</span>
                <span className="dt-mode-desc">{desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Timer Config ── */}
      {config.blockingMode === 'timer' && (
        <section className="animate-fade-in">
          <p className="dt-settings-section-title">Duration</p>
          <div className="dt-pill-row">
            {DURATION_PRESETS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => { setCustomDur(''); patchConfig({ timerDurationMinutes: value }); }}
                className={`dt-pill${activeDur === value && !customDur ? ' active' : ''}`}
              >
                {label}
              </button>
            ))}
            <div className="dt-pill-custom">
              <input
                type="number" min="1" max="1440" placeholder="—"
                value={customDur}
                onChange={(e) => {
                  setCustomDur(e.target.value);
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v > 0) patchConfig({ timerDurationMinutes: v });
                }}
                className="dt-pill-input"
              />
              <span className="dt-pill-suffix">m</span>
            </div>
          </div>

          {isTimerRunning ? (
            <div className="dt-timer-running">
              <div className="dt-countdown">{countdown}</div>
              <button onClick={handleStopTimer} className="dt-btn dt-btn-danger">
                <Square size={11} strokeWidth={2.5} /> Stop Timer
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleStartTimer(activeDur)}
              className="dt-btn dt-btn-primary"
            >
              <Play size={11} strokeWidth={2.5} /> Start {timerLabel} Timer
            </button>
          )}
        </section>
      )}

      {/* ── Schedule Config ── */}
      {config.blockingMode === 'schedule' && (
        <section className="animate-fade-in">
          <p className="dt-settings-section-title">Active Days</p>
          <div className="dt-day-row">
            {DAYS_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => handleToggleDay(i)}
                className={`dt-day-btn${config.scheduleDays.includes(i) ? ' active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="dt-settings-section-title" style={{ marginTop: '10px' }}>Time Window</p>
          <div className="dt-time-row">
            <input type="time" value={config.scheduleStartTime}
              onChange={(e) => patchConfig({ scheduleStartTime: e.target.value })}
              className="dt-time-input" />
            <span className="dt-time-sep">→</span>
            <input type="time" value={config.scheduleEndTime}
              onChange={(e) => patchConfig({ scheduleEndTime: e.target.value })}
              className="dt-time-input" />
          </div>

          <button
            onClick={handleToggleSchedule}
            className={`dt-btn${config.scheduleEnabled ? ' dt-btn-active' : ' dt-btn-primary'}`}
          >
            <span className={`dt-btn-dot${config.scheduleEnabled ? ' on' : ''}`} />
            {config.scheduleEnabled ? 'Schedule Active' : 'Enable Schedule'}
          </button>
        </section>
      )}

      {/* ── Daily Limit Config ── */}
      {config.blockingMode === 'daily-limit' && (
        <section className="animate-fade-in">
          <p className="dt-settings-section-title">Daily Limit</p>
          <div className="dt-pill-row">
            {DURATION_PRESETS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => { patchConfig({ dailyLimitMinutes: value }); setCustomLimit(''); }}
                className={`dt-pill${config.dailyLimitMinutes === value && !customLimit ? ' active' : ''}`}
              >
                {label}
              </button>
            ))}
            <div className="dt-pill-custom">
              <input
                type="number" min="1" max="1440" placeholder="—"
                value={customLimit}
                onChange={(e) => setCustomLimit(e.target.value)}
                className="dt-pill-input"
              />
              <span className="dt-pill-suffix">m</span>
            </div>
          </div>

          {customLimit && parseInt(customLimit, 10) > 0 && (
            <button onClick={handleSaveLimit} className="dt-btn dt-btn-primary" style={{ marginTop: '8px' }}>
              Save {customLimit}m Limit
            </button>
          )}

          <p className="dt-settings-section-title" style={{ marginTop: '10px' }}>Today's Usage</p>
          <div className="dt-progress-track">
            <div className="dt-progress-fill" style={{ width: `${usagePct}%` }} />
          </div>
          <p className="dt-progress-label">
            {usedMin}m used · {Math.max(0, config.dailyLimitMinutes - usedMin)}m left of {config.dailyLimitMinutes}m
          </p>
        </section>
      )}

      {/* ── Stats ── */}
      <section>
        <p className="dt-settings-section-title">Focus Stats</p>
        <div className="dt-stats-grid">
          <div className="dt-stat-card">
            <TrendingUp size={13} strokeWidth={2} className="dt-stat-icon" />
            <p className="dt-stat-value">{formatFocusTime(stats.focusMinutesToday)}</p>
            <p className="dt-stat-label">Today</p>
          </div>
          <div className="dt-stat-card">
            <Flame size={13} strokeWidth={2} className="dt-stat-icon" />
            <p className="dt-stat-value">{stats.streak}</p>
            <p className="dt-stat-label">{stats.streak === 1 ? 'day' : 'days'} streak</p>
          </div>
          <div className="dt-stat-card">
            <Activity size={13} strokeWidth={2} className="dt-stat-icon" />
            <p className="dt-stat-value">{stats.sessionCount}</p>
            <p className="dt-stat-label">Sessions</p>
          </div>
          <div className="dt-stat-card">
            <BarChart3 size={13} strokeWidth={2} className="dt-stat-icon" />
            <p className="dt-stat-value">{formatFocusTime(stats.focusMinutesTotal)}</p>
            <p className="dt-stat-label">All time</p>
          </div>
        </div>
      </section>
    </>
  );
};
