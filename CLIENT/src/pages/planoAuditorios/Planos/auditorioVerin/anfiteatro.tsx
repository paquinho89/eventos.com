import { useState, useEffect } from "react";

interface Props {
  onSelectionChange?: (count: number) => void;
}

export const AUDITORIO: (number | null)[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,null],
  [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,null],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const AuditorioVerinAnfiteatro: React.FC<Props> = ({ onSelectionChange }) => {

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

      {/* FRECHA ESCENARIO AO FONDO */}
      <div
        style={{
          marginTop: 35,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Corpo máis delgado */}
        <div
          style={{
            width: 120,
            height: 32,
            backgroundColor: "#222",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            letterSpacing: 2,
          }}
        >
          ESCENARIO
        </div>

        {/* Cabeza máis ancha ca o corpo */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "90px solid transparent",
            borderRight: "90px solid transparent",
            borderTop: "60px solid #222",
          }}
        />
      </div>

    </div>
  );
};

export default AuditorioVerinAnfiteatro;