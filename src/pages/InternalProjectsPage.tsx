import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle, Calendar, Camera, ChevronRight, MapPin, ShieldCheck, TrendingUp,
} from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useInternalScope } from '@/hooks/useInternalScope';
import { updateState, generateId, addAuditLog } from '@/store/store';
import { canEditProjects } from '@/lib/rbac';
import { getUnit, getAncestors, levelLabels } from '@/lib/hierarchy';
import { ProgressBar, ProjectStatusBadge, TypeIcon } from '@/components/Badges';
import ViewModeToggle, { type DataViewMode } from '@/components/ViewModeToggle';
import HierarchyProjectsTree from '@/components/HierarchyProjectsTree';
import ProgressPhoto from '@/components/ProgressPhoto';
import { formatCurrency, formatDate, statusLabels } from '@/lib/utils';
import { BUILDING_STAGES, stageFromMilestone, stageIndex } from '@/lib/buildingStages';

function BuildingStageRail({
  updates,
  isHi,
}: {
  updates: { milestoneLabel?: string; completionPercent: number }[];
  isHi: boolean;
}) {
  const reached = BUILDING_STAGES.reduce((max, stage) => {
    const hit = updates.some((u) => stageFromMilestone(u.milestoneLabel)?.key === stage.key);
    return hit ? Math.max(max, stageIndex(stage.key)) : max;
  }, -1);

  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {isHi ? 'निर्माण जीवनचक्र' : 'Construction Lifecycle'}
      </p>
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max items-stretch gap-0">
          {BUILDING_STAGES.map((stage, i) => {
            const done = i <= reached;
            const current = i === reached;
            return (
              <div key={stage.key} className="flex items-center">
                <div
                  className={`flex w-[88px] flex-col items-center rounded-lg px-1 py-2 sm:w-[96px] ${
                    current
                      ? 'bg-pwd-green/10 ring-2 ring-pwd-green'
                      : done
                        ? 'bg-green-50'
                        : 'bg-slate-100 opacity-55'
                  }`}
                >
                  <div
                    className="mb-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: done ? stage.color : '#cbd5e1' }}
                  >
                    {done ? '✓' : i + 1}
                  </div>
                  <p
                    className={`text-center text-[9px] font-semibold leading-tight sm:text-[10px] ${
                      current ? 'text-pwd-green' : done ? 'text-pwd-navy' : 'text-slate-400'
                    }`}
                  >
                    {isHi ? stage.hi : stage.en}
                  </p>
                  <p className="text-[8px] text-slate-400">{stage.percent}%</p>
                </div>
                {i < BUILDING_STAGES.length - 1 && (
                  <div className="flex flex-col items-center px-0.5 text-slate-300">
                    <span className="text-xs leading-none">↓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === '') return null;
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-pwd-navy">{value}</dd>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-pwd-navy">{value}</p>
      {hint && <p className="mt-0.5 text-[10px] text-slate-400">{hint}</p>}
    </div>
  );
}

export default function InternalProjectsPage() {
  const { t, i18n } = useTranslation();
  const { session, scopedProjects, tree, orgUnits, orgUnitId } = useInternalScope();
  const { statusUpdates, divisions, complaints } = useStore();
  const isHi = i18n.language === 'hi';
  const [selectedId, setSelectedId] = useState('');
  const [mode, setMode] = useState<DataViewMode>('hierarchy');
  const [updateForm, setUpdateForm] = useState({ message: '', messageHi: '', percent: 0, milestone: '' });

  const visible = scopedProjects;
  const selected = visible.find((p) => p.id === selectedId);
  const scopeUnit = getUnit(orgUnits, orgUnitId);
  const updates = statusUpdates
    .filter((u) => u.projectId === selectedId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  useEffect(() => {
    if (selected) {
      setUpdateForm((f) => ({ ...f, percent: selected.completionPercent }));
    }
  }, [selectedId, selected?.completionPercent]);

  if (!session) return null;

  const postUpdate = () => {
    if (!selected || !canEditProjects(session.role)) return;
    const now = new Date().toISOString();
    updateState((s) => ({
      ...s,
      projects: s.projects.map((p) =>
        p.id === selected.id ? { ...p, completionPercent: updateForm.percent } : p,
      ),
      statusUpdates: [
        {
          id: generateId('su'),
          projectId: selected.id,
          message: updateForm.message,
          messageHi: updateForm.messageHi || updateForm.message,
          completionPercent: updateForm.percent,
          milestoneLabel: updateForm.milestone || undefined,
          createdAt: now,
          createdBy: session.id,
          createdByName: session.name,
        },
        ...s.statusUpdates,
      ],
    }));
    addAuditLog('STATUS_UPDATE', 'project', selected.id, session.id, session.name, `${updateForm.percent}% - ${updateForm.message}`);
    setUpdateForm({ message: '', messageHi: '', percent: updateForm.percent, milestone: '' });
  };

  const div = selected ? divisions.find((d) => d.id === selected.divisionId) : undefined;
  const orgUnit = selected ? getUnit(orgUnits, selected.orgUnitId) : undefined;
  const orgPath = selected?.orgUnitId
    ? [...getAncestors(orgUnits, selected.orgUnitId).reverse(), getUnit(orgUnits, selected.orgUnitId)!].filter(Boolean)
    : [];
  const linkedComplaints = selected
    ? complaints.filter((c) => c.projectId === selected.id)
    : [];
  const onSiteCount = updates.filter((u) => u.onSite).length;
  const earliestUpdate = updates.length > 0 ? updates[updates.length - 1] : null;
  const progressDelta = earliestUpdate
    ? selected!.completionPercent - earliestUpdate.completionPercent
    : selected?.completionPercent ?? 0;
  const daysToCompletion = selected?.expectedCompletion
    ? Math.ceil((new Date(selected.expectedCompletion).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-pwd-navy">{t('projects')}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <ShieldCheck className="h-4 w-4 text-pwd-green" />
            {scopeUnit
              ? `${levelLabels[scopeUnit.level][isHi ? 'hi' : 'en']}: ${isHi ? scopeUnit.nameHi : scopeUnit.name}`
              : t('fullStateAccess')}
            {' · '}
            {visible.length} {t('inYourScope')}
          </p>
        </div>
        <ViewModeToggle mode={mode} onChange={setMode} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {mode === 'hierarchy' && tree ? (
          <HierarchyProjectsTree
            tree={tree}
            projects={visible}
            orgUnits={orgUnits}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ) : (
          <div className="card max-h-[720px] space-y-2 overflow-y-auto">
            {visible.map((p) => {
              const unit = getUnit(orgUnits, p.orgUnitId);
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${selectedId === p.id ? 'border-pwd-navy bg-pwd-navy/5' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium">{isHi ? p.nameHi : p.name}</span>
                    <ProjectStatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-slate-500">{unit ? (isHi ? unit.nameHi : unit.name) : '—'}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressBar percent={p.completionPercent} />
                    <span className="text-xs font-semibold text-pwd-navy">{p.completionPercent}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selected ? (
          <div className="max-h-[720px] space-y-4 overflow-y-auto pr-1">
            {/* Overview */}
            <div className="card">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <TypeIcon type={selected.type} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{t('projectOverview')}</p>
                    <h2 className="mt-0.5 text-lg font-bold text-pwd-navy">{isHi ? selected.nameHi : selected.name}</h2>
                    <p className="mt-1 text-xs text-slate-500">{isHi ? selected.locationHi : selected.location}</p>
                  </div>
                </div>
                <ProjectStatusBadge status={selected.status} />
              </div>

              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">{t('progress')}</span>
                  <span className="font-bold text-pwd-navy">{selected.completionPercent}%</span>
                </div>
                <ProgressBar percent={selected.completionPercent} />
                <p className="mt-1 text-xs text-slate-500">{t('percentComplete', { percent: selected.completionPercent })}</p>
              </div>

              <dl className="grid gap-3 sm:grid-cols-2">
                <DetailRow label={t('projectType')} value={t(selected.type)} />
                <DetailRow label={t('division')} value={div ? (isHi ? div.nameHi : div.name) : undefined} />
                <DetailRow
                  label={t('adminHierarchy')}
                  value={
                    orgPath.length > 0 ? (
                      <span className="flex flex-wrap items-center gap-0.5">
                        {orgPath.map((u, i) => (
                          <span key={u.id} className="inline-flex items-center">
                            {i > 0 && <ChevronRight className="mx-0.5 h-3 w-3 text-slate-300" />}
                            <span>{isHi ? u.nameHi : u.name}</span>
                          </span>
                        ))}
                      </span>
                    ) : orgUnit
                      ? (isHi ? orgUnit.nameHi : orgUnit.name)
                      : undefined
                  }
                />
                <DetailRow label={t('contractor')} value={selected.contractor} />
                <DetailRow label={t('workOrder')} value={selected.workOrderRef} />
                <DetailRow label={t('sanctionedValue')} value={selected.sanctionedValue ? formatCurrency(selected.sanctionedValue) : undefined} />
                <DetailRow
                  label={t('expectedCompletion')}
                  value={
                    selected.expectedCompletion ? (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {selected.expectedCompletion}
                        {daysToCompletion != null && (
                          <span className={`ml-1 text-xs ${daysToCompletion < 0 ? 'text-red-600' : 'text-slate-400'}`}>
                            ({daysToCompletion < 0 ? t('daysOverdue', { count: Math.abs(daysToCompletion) }) : t('daysRemaining', { count: daysToCompletion })})
                          </span>
                        )}
                      </span>
                    ) : undefined
                  }
                />
                <DetailRow label={t('startedOn')} value={formatDate(selected.createdAt, i18n.language)} />
                {selected.lat != null && selected.lng != null && (
                  <DetailRow
                    label={t('siteCoordinates')}
                    value={
                      <span className="inline-flex items-center gap-1 font-mono text-xs">
                        <MapPin className="h-3.5 w-3.5 text-pwd-green" />
                        {selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}
                      </span>
                    }
                  />
                )}
              </dl>

              {selected.autoCreated && (
                <p className="mt-3 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  {t('autoCreated')}
                </p>
              )}
              {selected.description && (
                <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">{selected.description}</p>
              )}
            </div>

            {/* Progress summary stats */}
            <div className="card">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-pwd-navy">
                <TrendingUp className="h-4 w-4 text-pwd-green" />
                {t('progressSummary')}
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <StatCard label={t('totalUpdates')} value={updates.length} />
                <StatCard label={t('onSiteCaptures')} value={onSiteCount} hint={onSiteCount > 0 ? t('gpsVerified') : undefined} />
                <StatCard
                  label={t('progressSinceStart')}
                  value={progressDelta > 0 ? `+${progressDelta}%` : `${progressDelta}%`}
                />
                <StatCard
                  label={t('linkedComplaints')}
                  value={linkedComplaints.length}
                  hint={linkedComplaints.filter((c) => !['resolved', 'closed'].includes(c.status)).length > 0
                    ? `${linkedComplaints.filter((c) => !['resolved', 'closed'].includes(c.status)).length} ${t('active')}`
                    : undefined}
                />
              </div>
              {updates[0] && (
                <p className="mt-3 text-xs text-slate-500">
                  {t('latestUpdate')}: {formatDate(updates[0].createdAt, i18n.language)}
                  {updates[0].createdByName && ` · ${updates[0].createdByName}`}
                </p>
              )}
            </div>

            {/* Status updates timeline */}
            <div className="card">
              <h3 className="mb-4 font-semibold text-pwd-navy">{t('updateTimeline')}</h3>
              {selected.type === 'building' && updates.length > 0 && (
                <BuildingStageRail updates={updates} isHi={isHi} />
              )}
              {updates.length === 0 ? (
                <p className="text-sm text-slate-500">{t('noUpdatesYet')}</p>
              ) : (
                <div className="relative space-y-0">
                  {updates.map((u, idx) => {
                    const stage = selected.type === 'building' ? stageFromMilestone(u.milestoneLabel) : undefined;
                    return (
                    <div key={u.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {idx < updates.length - 1 && (
                        <span className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5 bg-pwd-gold/40" />
                      )}
                      <span
                        className="relative z-10 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 bg-white text-[10px] font-bold text-pwd-navy"
                        style={stage ? { borderColor: stage.color } : { borderColor: '#d4a017' }}
                      >
                        {u.completionPercent}
                      </span>
                      <div className="min-w-0 flex-1 overflow-hidden rounded-lg border border-slate-100 bg-slate-50/50">
                        {u.photoDataUrl && (
                          <ProgressPhoto
                            src={u.photoDataUrl}
                            alt={stage ? (isHi ? stage.hi : stage.en) : u.milestoneLabel ?? ''}
                            className={`w-full object-cover ${selected.type === 'building' ? 'h-40 sm:h-44' : 'h-32 sm:h-36'}`}
                          />
                        )}
                        <div className="p-3">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              {stage && (
                                <span
                                  className="mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white"
                                  style={{ backgroundColor: stage.color }}
                                >
                                  {isHi ? stage.hi : stage.en}
                                </span>
                              )}
                              {!stage && u.milestoneLabel && (
                                <span className="mb-1.5 inline-block rounded bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                                  {u.milestoneLabel}
                                </span>
                              )}
                              <p className="text-sm font-medium text-pwd-navy">{isHi ? u.messageHi : u.message}</p>
                            </div>
                            <span className="flex-shrink-0 text-sm font-bold text-pwd-green">{u.completionPercent}%</span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                            {u.createdByName && <span>{u.createdByName}</span>}
                            <span>{formatDate(u.createdAt, i18n.language)}</span>
                            {u.photoDataUrl && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-0.5 text-blue-700">
                                <Camera className="h-3 w-3" /> {t('fieldCapture')}
                              </span>
                            )}
                            {u.onSite != null && (
                              <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 ${u.onSite ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                <MapPin className="h-3 w-3" />
                                {u.onSite ? t('onSite') : t('offSite')}
                                {u.distanceM != null && ` · ${u.distanceM}m`}
                                {u.accuracyM != null && ` · ±${u.accuracyM}m`}
                              </span>
                            )}
                          </div>
                          {!u.photoDataUrl && (
                            <ProgressPhoto src={u.photoDataUrl} className="mt-3 h-32 w-full rounded-lg object-cover sm:h-36" />
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Linked complaints */}
            <div className="card">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-pwd-navy">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                {t('linkedComplaints')}
              </h3>
              {linkedComplaints.length === 0 ? (
                <p className="text-sm text-slate-500">{t('noComplaintsLinked')}</p>
              ) : (
                <div className="space-y-2">
                  {linkedComplaints.map((c) => {
                    const sl = statusLabels[c.status];
                    return (
                      <div key={c.id} className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 p-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-pwd-navy">{c.ticketId}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">{c.description}</p>
                          <span className={`mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${sl.color}`}>
                            {isHi ? sl.hi : sl.en}
                          </span>
                        </div>
                        <Link to={`/internal/complaints/${c.id}`} className="flex-shrink-0 text-xs font-medium text-pwd-green hover:underline">
                          {t('viewComplaint')}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Post update form */}
            {canEditProjects(session.role) && (
              <div className="card space-y-3">
                <h3 className="font-semibold text-pwd-navy">{t('postUpdate')}</h3>
                <div>
                  <label className="label">{t('updateMessage')}</label>
                  <input className="input" placeholder={t('updateMessagePlaceholder')} value={updateForm.message} onChange={(e) => setUpdateForm({ ...updateForm, message: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t('hindiMessage')}</label>
                  <input className="input" value={updateForm.messageHi} onChange={(e) => setUpdateForm({ ...updateForm, messageHi: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t('milestones')}</label>
                  <input className="input" placeholder={t('milestonePlaceholder')} value={updateForm.milestone} onChange={(e) => setUpdateForm({ ...updateForm, milestone: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t('completionPercent')}: {updateForm.percent}%</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={updateForm.percent}
                    onChange={(e) => setUpdateForm({ ...updateForm, percent: +e.target.value })}
                    className="w-full accent-pwd-green"
                  />
                  <div className="mt-1"><ProgressBar percent={updateForm.percent} /></div>
                </div>
                <button className="btn-primary w-full" onClick={postUpdate} disabled={!updateForm.message.trim()}>
                  {t('save')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card flex h-48 items-center justify-center text-slate-400">{t('selectAProject')}</div>
        )}
      </div>
    </div>
  );
}
