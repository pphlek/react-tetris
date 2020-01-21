import { useState, useCallback } from 'react';

import { TETROMINOS, randomTetromino } from '../tetrominos';

import { STAGE_WIDTH, isCollided } from '../gameHelpers';

export const usePiece = () => {
    const [piece, setPiece] = useState({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS[0].shape,
        collided: false
    });

    const rotate = (tetromino, dir) => {
        // make rows become cols (transpose)
        const rotatedTetro = tetromino.map((_, index) => tetromino.map(col => col[index]));
        
        // reverse each row to get rotated tetromino
        if (dir > 0 ) 
            return rotatedTetro.map(row => row.reverse());

        return rotatedTetro.reverse();
    }

    const rotatePiece = (stage, dir) => {
        const clonedPiece = JSON.parse(JSON.stringify(piece));
        clonedPiece.tetromino = rotate(clonedPiece.tetromino, dir);

        const xPos = clonedPiece.pos.x;
        let offset = 1;
        while (isCollided(clonedPiece, stage, { x: 0, y: 0 })) {
            clonedPiece.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPiece.tetromino[0].length) {
                rotate(clonedPiece.tetromino, -dir);
                clonedPiece.pos.x = xPos;
                return;
            }
        }

        setPiece(clonedPiece);
    }

    const updatePiecePos = ({ x, y, collided }) => {
        setPiece(prev => ({
            ...prev,
            pos: { x: (prev.pos.x + x), y: (prev.pos.y + y)},
            collided
        }));
    }

    const resetPiece = useCallback(() => {
        setPiece({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            tetromino: randomTetromino().shape,
            collided: false
        })
    }, [])

    return [piece, updatePiecePos, resetPiece, rotatePiece];
}
