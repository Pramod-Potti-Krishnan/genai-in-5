import React from 'react';
import { sections } from '../../lib/mockData';

interface TopicChipsProps {
  activeTopicId: number | null;
  onSelectTopic: (topicId: number) => void;
}

export default function TopicChips({ activeTopicId, onSelectTopic }: TopicChipsProps) {
  // Filter out only the sections that have flashcards
  const topics = sections.filter(section => {
    // In a real app, you'd check if the section has associated flashcards
    return true;
  });

  return (
    <div className="topic-chips" role="tablist">
      <button
        className={`topic-chip ${activeTopicId === null ? 'active' : ''}`}
        onClick={() => onSelectTopic(0)}
        role="tab"
        aria-selected={activeTopicId === null}
      >
        All Topics
      </button>
      
      {topics.map((topic) => (
        <button
          key={topic.id}
          className={`topic-chip ${activeTopicId === topic.id ? 'active' : ''}`}
          onClick={() => onSelectTopic(topic.id)}
          role="tab"
          aria-selected={activeTopicId === topic.id}
        >
          {topic.title}
        </button>
      ))}
    </div>
  );
}