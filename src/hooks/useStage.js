import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';


export const useStage = (player, resetPlayer) => {
  const [stage, setStage] = useState(createStage());
  const[rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = newStage => 
      newStage.reduce((ack, row) => {
        if (row.findIndex(cell => cell[0] === 0) === -1) {
          setRowsCleared(prev => prev + 1);
          ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
          return ack;
        }
        ack.push(row);
        return ack;
      }, [])

    const updateStage = prevStage => {
      // First flush stage
      const newStage = prevStage.map(row => 
        row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)),
        );

      // Then draw tetromino
      // player.tetromino.forEach((row, y) => {
      //   row.forEach((value, x) => {
      //     if (value !== 0) {
      //       newStage[y + player.pos.y][x + player.pos.x] = [  ///// 
      //         value, 
      //         `${player.collided ? 'merged' : 'clear'}`,
      //       ];
      //     }
      //   });
      // });

      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const newY = y + player.pos.y;
            const newX = x + player.pos.x;
    
            // Check boundaries
            if (newY >= 0 && newY < newStage.length && newX >= 0 && newX < newStage[newY].length) {
              newStage[newY][newX] = [
                value,
                `${player.collided ? 'merged' : 'clear'}`,
              ];
            }
          }
        });
      });
      
      // Check if we collided
      if (player.collided) {
        resetPlayer();  /// 
        return sweepRows(newStage);
      }

      return newStage;
    };

    setStage(prev => updateStage(prev))
  }, [player, resetPlayer]);

  return [stage, setStage, rowsCleared];
};