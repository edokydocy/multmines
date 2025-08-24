use serde::{Serialize, Deserialize};

// POST /rooms
#[derive(Serialize, Deserialize)]
pub struct HostRequest{
    pub player_name: String,
}

#[derive(Serialize, Deserialize)]
pub struct HostResponse{
    pub player_id: String,
    pub room_id: String,
}

// DELETE /rooms/{room_id}
#[derive(Serialize, Deserialize)]
pub struct DismissRequest{
    pub player_id: String,  // only to verify if this is sent by host
}

#[derive(Serialize, Deserialize)]
pub struct DismissResponse;

// DELETE /rooms/{room_id}/players/{target_id}
#[derive(Serialize, Deserialize)]
pub struct KickRequest{
    pub player_id: String,
}

#[derive(Serialize, Deserialize)]
pub struct KickResponse;

// POST /rooms/{room_id}/start
#[derive(Serialize, Deserialize)]
pub struct StartRequest{
    pub player_id: String,
}

#[derive(Serialize, Deserialize)]
pub struct StartResponse;

// POST /rooms/{room_id}/end
#[derive(Serialize, Deserialize)]
pub struct EndRequest{
    pub player_id: String,
    pub winner_id: String,
}

#[derive(Serialize, Deserialize)]
pub struct EndResponse;