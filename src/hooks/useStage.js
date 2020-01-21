import { useState, useEffect } from 'react';
import { EMPTY_CELL, createStage } from '../gameHelpers';

export const useStage = (piece, resetPiece) => {
    const [stage, setStage] = useState(createStage());
    const [linesCleared, setLinesCleared] = useState(0);

    useEffect(() => {
        setLinesCleared(0);

        const sweepRows = newStage => newStage.reduce((accumulator, row) => {
            if (row.findIndex(cell => cell[0] === 0) === -1) {
                setLinesCleared(prev => prev + 1);
                accumulator.unshift(new Array(newStage[0].length).fill([0, 'clear']))
                return accumulator;
            }
            accumulator.push(row);
            return accumulator;
        }, []);

        const updateStage = prevStage => {
            const newStage = prevStage.map(row => 
                row.map(cell => (cell[1] === 'clear' ? [EMPTY_CELL, 'clear'] : cell))
            );

            piece.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== EMPTY_CELL) {
                        newStage[y + piece.pos.y][x + piece.pos.x] = [
                            value,
                            `${piece.collided ? 'merged' : 'clear'}`
                        ];
                    }
                });
            });

            if (piece.collided) {
                resetPiece();
                return sweepRows(newStage);
            }

            return newStage;
        }

        setStage(prev => updateStage(prev));
    }, [piece, resetPiece]);

    return [stage, setStage, linesCleared];
}
