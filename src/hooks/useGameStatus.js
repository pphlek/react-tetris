import { useState, useEffect, useCallback } from 'react';

export const useGameStatus = (linesCleared) => {
    const [score, setScore] = useState(0);
    const [line, setLine] = useState(0);
    const [lvl, setLvl] = useState(0);

    const linePoints = [40, 100, 300, 1200];

    const calcScore = useCallback(() => {
        if (linesCleared > 0) {
            setScore(prev => prev + linePoints[linesCleared - 1] * (lvl + 1));
            setLine(prev => prev + linesCleared)
        }
    }, [lvl, linePoints, linesCleared]);

    useEffect(() => {
        calcScore();
    }, [calcScore, linesCleared, score]);

    return [score, setScore, line, setLine, lvl, setLvl];
}
