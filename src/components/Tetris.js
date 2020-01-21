import React, { useState } from 'react';

import { LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW, createStage, isCollided } from '../gameHelpers';

// Styled Components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePiece } from '../hooks/usePiece';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [piece, updatePiecePos, resetPiece, rotatePiece] = usePiece();
    const [stage, setStage, linesCleared] = useStage(piece, resetPiece);
    const [score, setScore, line, setLine, lvl, setLvl] = useGameStatus(linesCleared);

    const movePieceLaterally = dir => {
        if (!isCollided(piece, stage, { x: dir, y: 0}))
            updatePiecePos({ x: dir, y: 0 });
    }

    const startGame = () => {
        setStage(createStage());
        setDropTime(500);
        resetPiece();
        setGameOver(false);
        setScore(0);
        setLine(0);
        setLvl(10);
    }

    const drop = () => {
        if (line > (lvl + 1) * 10) {
            setLvl(prev => prev + 1);
            setDropTime(1000 / (lvl + 1));
        }

        if (!isCollided(piece, stage, { x: 0, y: 1})) {
            updatePiecePos({ x: 0, y: 1, collided: false });
        } else {
            if (piece.pos.y < 1) {
                setGameOver(true);
                setDropTime(null);
            }
            updatePiecePos({ x: 0, y: 0, collided: true });
        }
    }

    const keyUp = ({ keyCode }) => {
        if (!gameOver)
            if (keyCode === DOWN_ARROW)
                setDropTime(1000 / (lvl + 1));
    }

    const dropPiece = () => {
        setDropTime(null);
        drop();
    }

    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === LEFT_ARROW)
                movePieceLaterally(-1);
            else if (keyCode === RIGHT_ARROW)
                movePieceLaterally(1);
            else if (keyCode === DOWN_ARROW)
                dropPiece();
            else if (keyCode === UP_ARROW)
                rotatePiece(stage, 1);
        }
    }

    useInterval(() => {
        drop();
    }, dropTime);

    return (
        <StyledTetrisWrapper role='button' tabIndex='0' onKeyDown={e => move(e)} onKeyUp={keyUp}>
            <StyledTetris>
                <Stage stage={stage} />
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text='Game Over' />
                    ) : (
                        <div>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Line: ${line}`} />
                            <Display text={`Lvl: ${lvl}`} />
                        </div>
                    )}
                    <StartButton onClick={startGame} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
}

export default Tetris;
