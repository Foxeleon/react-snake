import React from 'react';
import { SnakeSegmentProps } from '@/types/gameTypes.ts';
import styles from '@/components/GameBoard.module.css'; // Example: Import the type for the segment

// SnakeSegment Component
const SnakeSegment: React.FC<SnakeSegmentProps> = React.memo(
    ({ SnakeStyle }) => {
        return (
                <div
                    className={styles.snakeBody}
                    style={{
                        backgroundColor: SnakeStyle.bg,
                        border: `3px solid ${SnakeStyle.border}`
                    }}
            />
        );
    },
    (prevProps, nextProps) => {
        // Custom comparator: compare only the position values to avoid re-renders
        return (
            prevProps.position.x === nextProps.position.x &&
            prevProps.position.y === nextProps.position.y
        );
    }
);

export default SnakeSegment;