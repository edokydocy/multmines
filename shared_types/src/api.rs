use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct ApiResponse<T>{
    pub verdict: bool,
    pub content: Option<T>,
    pub error: Option<ApiError>
}

#[derive(Serialize, Deserialize)]
pub struct ApiError{
    pub code: u16,
    pub message_short: String,
    pub message: String,
}

