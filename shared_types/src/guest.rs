use serde::{Deserialize, Serialize};

// POST /rooms/{room_id}/join
#[derive(Serialize, Deserialize)]
pub struct JoinRequest{
    pub player_name: String,
}

#[derive(Serialize, Deserialize)]
pub struct JoinResponse{
    pub player_id: String,
    pub room_id: String
}

// DELETE /rooms/{room_id}/players/{player_id}/self
#[derive(Serialize, Deserialize)]
pub struct QuitRequest{
    pub player_id: String,
}

#[derive(Serialize, Deserialize)]
pub struct QuitResponse;

// POST /rooms/{room_id}/players/{player_id}/signal
#[derive(Serialize, Deserialize)]
pub struct SignalRequest{
    pub player_id: String,
    pub player_ip: String,
    pub player_port: u16
}

#[derive(Serialize, Deserialize)]
pub struct SignalResponse;

// GET /rooms/{room_id}/players
#[derive(Serialize, Deserialize)]
pub struct FetchRequest;

#[derive(Serialize, Deserialize)]
pub struct FetchResponse{
    pub player_id: String,
    pub player_ip: String,
    pub player_port: String
}