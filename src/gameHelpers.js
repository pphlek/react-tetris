export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

export const LEFT_ARROW = 37;
export const UP_ARROW = 38;
export const RIGHT_ARROW = 39;
export const DOWN_ARROW = 40;

export const EMPTY_CELL = 0;

export const createStage = () => (
    Array.from(Array(STAGE_HEIGHT), () => 
        new Array(STAGE_WIDTH).fill([0, 'clear'])
    )
)

export const isCollided = (player, stage, { x: moveX, y: moveY }) => {
    for (let y = 0; y < player.tetromino.length; y++) {
        for (let x = 0; x < player.tetromino[y].length; x++) {
            if (player.tetromino[y][x] !== EMPTY_CELL) {
                const yPos = y + player.pos.y + moveY;
                const xPos = x + player.pos.x + moveX

                if (!isMoveInsideGameHeight(stage, yPos) || 
                    !isMoveInsideGameWidth(stage, yPos, xPos) || 
                    !isNewCellClear(stage, yPos, xPos))
                    return true;
            }
        }
    }
}

const isMoveInsideGameHeight = (stage, yPos) => stage[yPos];
const isMoveInsideGameWidth = (stage, yPos, xPos) => stage[yPos][xPos];
const isNewCellClear = (stage, yPos, xPos) => stage[yPos][xPos][1] === 'clear';

