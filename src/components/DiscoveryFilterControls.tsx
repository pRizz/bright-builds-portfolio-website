import { For } from "solid-js";
import type { ContentFacetGroup } from "../domain/content-search";

export type DiscoveryFilterControlsProps = {
  surfaceId: string;
  heading: string;
  searchLabel: string;
  searchValue: string;
  facetGroups: readonly ContentFacetGroup[];
  selectedFacetIds: readonly string[];
  countStatus: string;
  resetLabel?: string;
  resetDisabled: boolean;
  onSearchInput: (value: string) => void;
  onFacetToggle: (facetId: string) => void;
  onReset: () => void;
};

export function DiscoveryFilterControls(props: DiscoveryFilterControlsProps) {
  return (
    <section class="filter-surface visual-surface" aria-labelledby={`${props.surfaceId}-heading`}>
      <h2 id={`${props.surfaceId}-heading`} class="filter-heading">
        {props.heading}
      </h2>

      <div class="filter-search">
        <label class="filter-label" for={`${props.surfaceId}-search`}>
          {props.searchLabel}
        </label>
        <input
          id={`${props.surfaceId}-search`}
          class="filter-input"
          type="search"
          value={props.searchValue}
          onInput={(event) => props.onSearchInput(event.currentTarget.value)}
        />
      </div>

      <For each={props.facetGroups}>
        {(facetGroup) => (
          <fieldset class="filter-group">
            <legend class="filter-legend">{facetGroup.label}</legend>
            <div class="filter-group-list">
              <For each={facetGroup.facets}>
                {(facet) => {
                  const optionId = `${props.surfaceId}-${facet.id}`.replace(/[^a-zA-Z0-9_-]/g, "-");

                  return (
                    <label class="filter-option" for={optionId}>
                      <input
                        id={optionId}
                        class="filter-checkbox"
                        type="checkbox"
                        checked={props.selectedFacetIds.includes(facet.id)}
                        onChange={() => props.onFacetToggle(facet.id)}
                      />
                      <span>{facet.label}</span>
                      <span class="filter-option-count">{facet.count}</span>
                    </label>
                  );
                }}
              </For>
            </div>
          </fieldset>
        )}
      </For>

      <div class="filter-actions">
        <p class="filter-status" role="status" aria-live="polite">
          {props.countStatus}
        </p>
        <button
          type="button"
          class="filter-reset"
          disabled={props.resetDisabled}
          onClick={props.onReset}
        >
          {props.resetLabel ?? "Reset filters"}
        </button>
      </div>
    </section>
  );
}
