# API Reference

Base URL: `http://localhost:5000/api`

All responses are JSON. Protected routes require:

```http
Authorization: Bearer <jwt_token>
```

## Authentication

### POST `/auth/register`

Register a new user (created as `student` role by default).

- Access: Public
- Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### POST `/auth/login`

Login and receive token + user payload.

- Access: Public
- Body:

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

- Success (example):

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt>",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "isBlocked": false,
    "status": "active"
  }
}
```

### GET `/auth/me`

Get the current authenticated user.

- Access: Authenticated

### GET `/auth/admin-test`

Auth + authorization sanity endpoint for admin.

- Access: Admin

## Admin

All `/admin/*` routes require role: `admin`.

### GET `/admin/dashboard`

Get dashboard counters.

- Access: Admin
- Success fields:
  - `stats.users`
  - `stats.students`
  - `stats.teachers`
  - `stats.admins`
  - `stats.courses`
  - `stats.enrollments`

### GET `/admin/revenue`

Get revenue analytics.

- Access: Admin
- Success fields:
  - `revenue.totalRevenue`
  - `revenue.totalEnrollments`
  - `revenue.monthlyRevenue[]`
  - `revenue.revenueByCourse[]`

### GET `/admin/users`

List users (password excluded).

- Access: Admin

### PATCH `/admin/users/:id/role`

Update role for target user.

- Access: Admin
- Body:

```json
{
  "role": "teacher"
}
```

### PATCH `/admin/users/:id/block`

Toggle blocked state for target user.

- Access: Admin

### DELETE `/admin/users/:id`

Delete user.

- Access: Admin

## Teacher Requests

### POST `/teacher-requests`

Submit teacher role request (student only).

- Access: Student
- Body:

```json
{
  "reason": "I teach mathematics and need panel access."
}
```

Notes:
- If existing request is `pending`: rejected with error
- If existing request is `approved`: rejected with error
- If existing request is `rejected`: request is re-submitted as `pending`

### GET `/teacher-requests/me`

Get current user's request status.

- Access: Authenticated
- Success:

```json
{
  "success": true,
  "request": {
    "_id": "...",
    "status": "pending",
    "reason": "...",
    "reviewedBy": null,
    "reviewedAt": null
  }
}
```

`request` can be `null` if user never submitted.

### GET `/teacher-requests`

List all requests.

- Access: Admin

### PATCH `/teacher-requests/:id/review`

Approve or reject request.

- Access: Admin
- Body:

```json
{
  "status": "approved"
}
```

Allowed values: `approved`, `rejected`

Behavior:
- On `approved`, target user role is updated to `teacher`
- Audit log entry is recorded

## Courses

### GET `/courses`

List courses (paginated query supported via `page`, `limit`).

- Access: Authenticated

### GET `/courses/:id`

Get course details by id.

- Access: Authenticated

### GET `/courses/:id/students`

Get students for a course.

- Access: Authenticated (authorization enforced in service logic)

### POST `/courses`

Create course.

- Access: Admin

### PUT `/courses/:id`

Update course.

- Access: Admin

### DELETE `/courses/:id`

Delete course.

- Access: Admin

## Enrollments

### POST `/enrollments`

Enroll into a course.

- Access: Student
- Body:

```json
{
  "courseId": "<course_id>"
}
```

### GET `/enrollments`

Get enrollments.

- Access: Authenticated
- Behavior:
  - Student: own enrollments
  - Admin/Teacher: broader visibility as per service logic

### PATCH `/enrollments/:id/status`

Update enrollment status.

- Access: Admin or Teacher
- Body:

```json
{
  "status": "approved"
}
```

## Error Format

Global error middleware returns:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message"
}
```

## Development Notes

- CORS origin currently allows `http://localhost:5173`
- API root health check: `GET /`
- Debug token endpoint: `GET /debug-token` (dev-only utility)
