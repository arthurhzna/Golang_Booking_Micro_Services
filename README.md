# Booking Microservices API Documentation

This README documents available HTTP routes and high-level behaviour for the microservices in this repository: `field_service`, `order_service`, `payment_service`, and `user_service`.

---

- **Base router:** Each service uses Gin. Routes shown below are relative to the service base URL (e.g. `http://{host}:{port}`) for that service.

- **Auth:** Services use JWT-based middleware located in each service's `middlewares` package. Routes marked **(public)** do not require a token; others require authentication and some also check roles (`Admin`, `Customer`). Role checks call middleware `CheckRole([...], client)`.

---

## field_service

Base path: `/`

- **GET /field** (public)
  - Description: Get all fields (no pagination).
  - Controller: `FieldController.GetAllWithoutPagination`
  - Auth: None (uses `AuthenticateWithoutToken`)

- **GET /field/:uuid** (public)
  - Description: Get field details by UUID.
  - Controller: `FieldController.GetByUUID`
  - Auth: None

- **GET /field/pagination**
  - Description: Get fields with pagination. Query params validated by `dto.FieldRequestParam`.
  - Controller: `FieldController.GetAllWithPagination`
  - Auth: Required. Roles allowed: `Admin`, `Customer`.

- **POST /field**
  - Description: Create a field. Multipart form binding used (`binding.FormMultipart`). Validated by `dto.FieldRequest`.
  - Controller: `FieldController.Create`
  - Auth: Required. Roles allowed: `Admin`.

- **PUT /field/:uuid**
  - Description: Update a field (multipart). Validated by `dto.UpdateFieldRequest`.
  - Controller: `FieldController.Update`
  - Auth: Required. Roles allowed: `Admin`.

- **DELETE /field/:uuid**
  - Description: Delete a field by UUID.
  - Controller: `FieldController.Delete`
  - Auth: Required. Roles allowed: `Admin`.


### Field schedule

- **GET /field/schedule/lists/:uuid?date=YYYY-MM-DD** (public)
  - Description: List field schedules by field UUID and date (query param `date`). Validated by `dto.FieldScheduleByFieldIDAndDateRequestParam`.
  - Controller: `FieldScheduleController.GetAllByFieldIDAndDate`
  - Auth: None

- **PATCH /field/schedule/status** (public)
  - Description: Update status for one or many schedules. Request validated by `dto.UpdateStatusFieldScheduleRequest`.
  - Controller: `FieldScheduleController.UpdateStatus`
  - Auth: None

- **GET /field/schedule/pagination**
  - Description: Get field schedules with pagination. Validated by `dto.FieldScheduleRequestParam`.
  - Controller: `FieldScheduleController.GetAllWithPagination`
  - Auth: Required. Roles: `Admin`, `Customer`.

- **GET /field/schedule/:uuid**
  - Description: Get field schedule by UUID.
  - Controller: `FieldScheduleController.GetByUUID`
  - Auth: Required. Roles: `Admin`, `Customer`.

- **POST /field/schedule**
  - Description: Create field schedule. JSON body validated by `dto.FieldScheduleRequest`.
  - Controller: `FieldScheduleController.Create`
  - Auth: Required. Roles: `Admin`.

- **POST /field/schedule/one-month**
  - Description: Generate schedule for one month. Request validated by `dto.GenerateFieldScheduleForOneMonthRequest`.
  - Controller: `FieldScheduleController.GenerateScheduleForOneMonth`
  - Auth: Required. Roles: `Admin`.

- **PUT /field/schedule/:uuid**
  - Description: Update field schedule by UUID. JSON body validated by `dto.UpdateFieldScheduleRequest`.
  - Controller: `FieldScheduleController.Update`
  - Auth: Required. Roles: `Admin`.

- **DELETE /field/schedule/:uuid**
  - Description: Delete field schedule by UUID.
  - Controller: `FieldScheduleController.Delete`
  - Auth: Required. Roles: `Admin`.


### Time

- **GET /time**
  - Description: Get all time slots.
  - Controller: `TimeController.GetAll`
  - Auth: Required. Roles: `Admin`.

- **GET /time/:uuid**
  - Description: Get time slot by UUID.
  - Controller: `TimeController.GetByUUID`
  - Auth: Required. Roles: `Admin`.

- **POST /time**
  - Description: Create new time slot.
  - Controller: `TimeController.Create`
  - Auth: Required. Roles: `Admin`.

---

## order_service

Base path: `/`

- **GET /order**
  - Description: Get orders with pagination. Query validated by `dto.OrderRequestParam`.
  - Controller: `OrderController.GetAllWithPagination`
  - Auth: Required. Roles: `Admin`, `Customer`.

- **GET /order/:uuid**
  - Description: Get order by UUID.
  - Controller: `OrderController.GetByUUID`
  - Auth: Required. Roles: `Admin`, `Customer`.

- **GET /order/user**
  - Description: Get orders for the authenticated user.
  - Controller: `OrderController.GetOrderByUserID`
  - Auth: Required. Roles: `Customer`.

- **POST /order**
  - Description: Create a new order. JSON body validated by `dto.OrderRequest`.
  - Controller: `OrderController.Create`
  - Auth: Required. Roles: `Customer`.

Notes:
- `OrderController.Create` calls into the order service to create an order, likely interacting with repositories and producing events via Kafka (see `controllers/kafka` and `controllers/http` folders).

---

## payment_service

Base path: `/`

- **POST /payment/webhook** (public)
  - Description: External payment provider webhook endpoint (Midtrans). Accepts JSON webhook payload (`dto.Webhook`).
  - Controller: `PaymentController.Webhook`
  - Auth: None (public webhook)

- **GET /payment**
  - Description: Get payments with pagination. Query validated by `dto.PaymentRequestParam`.
  - Controller: `PaymentController.GetAllWithPagination`
  - Auth: Required. Roles: `Admin`, `Customer`.

- **GET /payment/:uuid**
  - Description: Get payment by UUID.
  - Controller: `PaymentController.GetByUUID`
  - Auth: Required. Roles: `Admin`, `Customer`.

- **POST /payment**
  - Description: Create a new payment record (likely triggers Midtrans payment flow). JSON body validated by `dto.PaymentRequest`.
  - Controller: `PaymentController.Create`
  - Auth: Required. Roles: `Customer`.

Notes:
- Webhook handler calls `service.GetPayment().Webhook` to update order/payment status; ensure `set_ip_public_for_midtrans.txt` is followed when running Midtrans locally.

---

## user_service

Base path: `/`

- **POST /user/login**
  - Description: Authenticate a user. Request JSON validated by `dto.LoginRequest`. Returns `Token` in response.
  - Controller: `UserController.Login`
  - Auth: None

- **POST /user/register**
  - Description: Register a new user. Request JSON validated by `dto.RegisterRequest`.
  - Controller: `UserController.Register`
  - Auth: None

- **PUT /user/:uuid**
  - Description: Update user by UUID. Request JSON validated by `dto.UpdateRequest`.
  - Controller: `UserController.Update`
  - Auth: Required (middleware applies). Role checks are handled via `middlewares.CheckRole` in calling services.

- **GET /user/login**
  - Description: Get the currently authenticated user.
  - Controller: `UserController.GetUserLogin`
  - Auth: Required

- **GET /user/:uuid**
  - Description: Get user by UUID.
  - Controller: `UserController.GetUserByUUID`
  - Auth: Required

---

## Common patterns and notes

- Validation: Handlers use `github.com/go-playground/validator/v10` and return `422 Unprocessable Entity` for validation errors with structured error details via `common/error` packages.

- Responses: Most handlers use a shared `common/response` helper that produces structured JSON including `Code`, `Data`, `Message`, and `Token` when authentication is performed.

- Authentication & Authorization:
  - `middlewares.Authenticate()` ensures the request has a valid JWT.
  - `middlewares.AuthenticateWithoutToken()` allows some endpoints public access.
  - `middlewares.CheckRole([]string{...}, client)` enforces roles by consulting the `clients` package (likely calling `user_service` or a token introspection endpoint in Consul configuration).

- Inter-service communication:
  - Services register clients under `clients/` (e.g. user client, field client). These are used for role checks and user lookups.
  - Kafka producers/consumers exist in `controllers/kafka` for asynchronous flows (order/payment events). Check individual service `controllers/kafka` for event names.

- Config: Each service has `config.json` and `config.json.example` and loads configuration from Consul or environment. See top-level `project/docker-compose.yaml` for local stack composition.

---