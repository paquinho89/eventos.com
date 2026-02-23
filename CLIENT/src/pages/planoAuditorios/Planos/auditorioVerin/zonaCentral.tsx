import { useState, useEffect } from "react";

interface Props {
  onSelectionChange?: (count: number) => void;
}

// Cada fila é un array, onde "null" é espazo / pasillo
const AUDITORIO: (number | null)[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //17
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //16
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //15
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //14
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //13
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //12
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //11
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //10
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //9
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //8
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //7
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //6
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //5
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //4
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //3  
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //2
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //1
];

const AuditorioVerinZonaCentral: React.FC<Props> = ({ onSelectionChange }) => {

  const [seats, setSeats] = useState<boolean[][]>(
    AUDITORIO.map((fila) => fila.map(() => false))
  );

  const handleSeatClick = (row: number, col: number) => {
    if (AUDITORIO[row][col] === null) return;

    const newSeats = seats.map((r, rIndex) =>
      r.map((s, cIndex) =>
        rIndex === row && cIndex === col ? !s : s
      )
    );

    setSeats(newSeats);
  };

  useEffect(() => {
    const total = seats.flat().filter(Boolean).length;
    onSelectionChange?.(total);
  }, [seats, onSelectionChange]);

  return (
    <div style={{ padding: 20 }}>
      {seats.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{ display: "flex", justifyContent: "center", marginBottom: 5 }}
        >
          {row.map((seat, colIndex) => {
            if (AUDITORIO[rowIndex][colIndex] === null) {
              return (
                <div
                  key={colIndex}
                  style={{ width: 22, height: 22, margin: 3 }}
                />
              );
            }

            return (
              <div
                key={colIndex}
                onClick={() => handleSeatClick(rowIndex, colIndex)}
                style={{
                  width: 22,
                  height: 22,
                  margin: 3,
                  backgroundColor: seat ? "#ff0093" : "#ccc",
                  cursor: "pointer",
                  borderRadius: 4,
                  transition: "0.2s",
                }}
              />
            );
          })}
        </div>
      ))}

      {/* ESCENARIO */}
      <div
        style={{
          marginTop: 25,
          height: 40,
          backgroundColor: "#222",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          fontWeight: "bold",
          letterSpacing: 2,
        }}
      >
        ESCENARIO
      </div>
    </div>
  );
};

export default AuditorioVerinZonaCentral;