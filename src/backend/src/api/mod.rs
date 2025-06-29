use actix_web::{HttpResponse, Result, http::Method, web};

pub mod healthz;
pub mod prove;
pub mod verify; // <── add

async fn options_handler() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok()
        .insert_header(("Access-Control-Allow-Origin", "*"))
        .insert_header(("Access-Control-Allow-Methods", "GET, POST, OPTIONS"))
        .insert_header(("Access-Control-Allow-Headers", "Content-Type"))
        .finish())
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("")
            .service(prove::prove)
            .service(verify::verify)
            .route("/healthz", web::get().to(healthz::healthz)) // <── health check
            .route("/prove", web::method(Method::OPTIONS).to(options_handler))
            .route("/verify", web::method(Method::OPTIONS).to(options_handler))
            .route("/healthz", web::method(Method::OPTIONS).to(options_handler)),
    );
}
