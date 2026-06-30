import { For, Show } from "solid-js";
import { maybeTopicRecordForLabel, topicDetailPath } from "../domain/topics";

type TopicChipProps = {
  label: string;
  class?: string;
  currentSlug?: string;
};

type TopicChipListProps = {
  labels: readonly string[];
  ariaLabel: string;
};

export function TopicChip(props: TopicChipProps) {
  const topic = () => maybeTopicRecordForLabel(props.label);
  const chipClass = () => ["chip", props.class].filter(Boolean).join(" ");
  const linkedChipClass = () => ["chip", "topic-chip-link", props.class].filter(Boolean).join(" ");

  return (
    <Show when={topic()} keyed fallback={<span class={chipClass()}>{props.label}</span>}>
      {(selectedTopic) =>
        selectedTopic.slug !== props.currentSlug ? (
          <a class={linkedChipClass()} href={topicDetailPath(selectedTopic)}>
            {props.label}
          </a>
        ) : (
          <span class={chipClass()}>{props.label}</span>
        )
      }
    </Show>
  );
}

export function TopicChipList(props: TopicChipListProps) {
  return (
    <ul class="label-row" aria-label={props.ariaLabel}>
      <For each={props.labels}>
        {(label) => (
          <li>
            <TopicChip label={label} />
          </li>
        )}
      </For>
    </ul>
  );
}
