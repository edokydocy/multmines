use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub enum ClientMessage{
    Reveal {x: u8, y:u8},
    Flag {x: u8, y: u8}
}

#[derive(Serialize, Deserialize)]
pub enum ServerMessage {
    BoardExpand{dir: u8, board: BoardState},
    CellUpdate(CellState),
    
}