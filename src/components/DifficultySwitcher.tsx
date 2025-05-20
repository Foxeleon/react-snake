import React from 'react';
import styles from './GameSettings.module.css';
import { useTranslation } from 'react-i18next';
import { FAST_SPEED, INITIAL_SPEED, SLOW_SPEED } from '@/constants/gameConstants.ts';
import { GameSettings } from '@/types/gameTypes.ts';

interface DifficultySwitcherProps {
    formData: Partial<GameSettings>;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    isPlaying: boolean;
}

interface DifficultyOption {
    label: string;
    speed: number;
    type: 'easy' | 'normal' | 'hard';
}

const difficultyOptions: DifficultyOption[] = [
    { label: 'settings.speed.easy', speed: SLOW_SPEED, type: 'easy' },
    { label: 'settings.speed.normal', speed: INITIAL_SPEED, type: 'normal' },
    { label: 'settings.speed.hard', speed: FAST_SPEED, type: 'hard' },
];

export const DifficultySwitcher: React.FC<DifficultySwitcherProps> = ({ formData, setFormData, isPlaying }) => {
    const { t } = useTranslation();

    // Обработчик смены уровня сложности
    const handleDifficultyChange = (speed: number) => {
        setFormData((prevState: GameSettings) => ({
            ...prevState,
            speed,
        }));
    };

    return (
        <div className={styles.formGroup}>
            <label>{t('settings.speed.title')}:
                {isPlaying && (
                    <span className={styles.disabledNote}> ({t('settings.notAvailableDuringGame')})</span>
                )}
            </label>
            <div className={styles.difficultySwitcher}>
                {difficultyOptions.map((option) => (
                    <button
                        key={option.speed}
                        type="button"
                        disabled={isPlaying}
                        className={isPlaying ? styles.disabledSelect : `${styles.difficultyOption} ${
                            formData.speed === option.speed ? styles.active : ''
                        } ${styles[option.type]}`}
                        onClick={() => handleDifficultyChange(option.speed)}
                    >
                        {t(option.label)}
                    </button>
                ))}
            </div>
        </div>
    );
};