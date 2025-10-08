use core::str;

mod api;
mod hosting;
mod guest;
mod game;

pub use api::*;
pub use hosting::*;
pub use guest::*;
pub use game::*;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
    }
}
