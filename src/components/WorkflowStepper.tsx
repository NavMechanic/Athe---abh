'use client';

import { useRef, useState, type KeyboardEvent } from 'react';

export type WorkflowNode = {
  id: string;
  name: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
};

export function ItemList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-700">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WorkflowStepper({ nodes }: { nodes: WorkflowNode[] }) {
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const node = nodes[index];
  const last = nodes.length - 1;

  const go = (next: number, focus = false) => {
    const i = (next + nodes.length) % nodes.length;
    setIndex(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const map: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: last,
    };
    if (e.key in map) {
      e.preventDefault();
      go(map[e.key], true);
    }
  };

  return (
    <div>
      <div role="tablist" aria-label="ATHENA workflow nodes" className="grid grid-cols-4 gap-2 lg:grid-cols-8">
        {nodes.map((n, i) => {
          const selected = i === index;
          return (
            <button
              key={n.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`workflow-tab-${n.id}`}
              aria-selected={selected}
              aria-controls="workflow-panel"
              aria-label={`${n.id} ${n.name}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => go(i)}
              onKeyDown={onKeyDown}
              className={`flex min-h-[56px] flex-col items-center justify-center rounded-md border px-2 py-2 text-center transition-colors ${
                selected
                  ? 'border-navy-900 bg-navy-900 text-white'
                  : 'border-slate-300 bg-white text-navy-900 hover:border-teal-700'
              }`}
            >
              <span className="font-mono text-sm font-semibold">{n.id}</span>
              <span className={`mt-1 hidden text-xs leading-tight lg:block ${selected ? 'text-slate-200' : 'text-slate-600'}`}>
                {n.name}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="workflow-panel"
        aria-labelledby={`workflow-tab-${node.id}`}
        tabIndex={0}
        className="mt-4 rounded-lg border border-slate-200 bg-white p-5 md:p-8"
      >
        <p className="font-mono text-sm font-semibold text-teal-700">
          {node.id} · Step {index + 1} of {nodes.length}
        </p>
        <h3 className="mt-1 text-xl font-semibold text-navy-900 md:text-2xl">{node.name}</h3>

        <div className="mt-6 grid gap-8 md:grid-cols-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">Purpose</h4>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{node.purpose}</p>
          </div>
          <ItemList title="Inputs" items={node.inputs} />
          <ItemList title="Outputs" items={node.outputs} />
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="min-h-[44px] rounded-md border border-navy-900 px-4 text-sm font-semibold text-navy-900 hover:bg-navy-900 hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-500 disabled:hover:bg-transparent"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === last}
            className="min-h-[44px] rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-600"
          >
            Next node
          </button>
        </div>
      </div>
    </div>
  );
}
