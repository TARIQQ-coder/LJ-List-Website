// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LJ-LIST API SERVICE
//  Single source of truth for all backend communication.
//  Base URL is read from the Vite env var VITE_API_URL.
//  All requests send cookies (credentials: 'include') for httpOnly auth.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BASE = import.meta.env.VITE_API_URL || 'https://lj-list-api.onrender.com'

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
// Every request goes through here.
// - Automatically sets Content-Type for JSON bodies
// - Always sends cookies
// - On 401: clears local user cache and reloads to force re-login
// - Returns { data } on success, throws { message, errors, code } on error

async function request(path, options = {}) {
  const { body, method = 'GET', multipart = false } = options

  const headers = {}
  if (body && !multipart) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    credentials: 'include',  // always send httpOnly cookies
    body: body
      ? multipart ? body : JSON.stringify(body)
      : undefined,
  })

  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    // 401 — session expired, clear cache so navbar shows Sign In
    if (res.status === 401) {
      localStorage.removeItem('lj_current_user')
    }
    // Throw a structured error the UI can read
    throw {
      message: json.message || 'Something went wrong. Please try again.',
      errors:  json.errors  || {},
      code:    json.code    || 'ERROR',
      status:  res.status,
    }
  }

  return json.data ?? json
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AUTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const auth = {
  /**
   * Create a new account.
   * Returns { user, verification } — account is inactive until OTP is verified.
   * @param {{ display_name, phone_number, password, staff_number, institution, ghana_card_number }} fields
   */
  signup(fields) {
    return request('/api/v1/auth/signup', { method: 'POST', body: fields })
  },

  /**
   * Verify the 6-digit OTP sent by SMS. Activates the account and sets auth cookies.
   * @param {{ phone_number, otp }} fields
   */
  verifyOtp(fields) {
    return request('/api/v1/auth/verify-otp', { method: 'POST', body: fields })
  },

  /**
   * Resend the activation OTP to the given phone number.
   * @param {string} phone_number
   */
  resendOtp(phone_number) {
    return request('/api/v1/auth/resend-otp', { method: 'POST', body: { phone_number } })
  },

  /**
   * Log in with phone number and password. Sets httpOnly auth cookies.
   * @param {{ phone_number, password }} fields
   */
  login(fields) {
    return request('/api/v1/auth/login', { method: 'POST', body: fields })
  },

  /**
   * Exchange the refresh_token cookie for a fresh token pair.
   */
  refresh() {
    return request('/api/v1/auth/refresh', { method: 'POST' })
  },

  /**
   * Clear auth cookies. User is logged out server-side.
   */
  logout() {
    return request('/api/v1/auth/logout', { method: 'POST' })
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PROFILE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const profile = {
  /**
   * Get the authenticated user's full profile.
   * Returns { user } with all fields including staff_number, institution, ghana_card_number.
   */
  get() {
    return request('/api/v1/profile')
  },

  /**
   * Update editable profile fields.
   * All fields optional: display_name, phone_number, staff_number, institution,
   * ghana_card_number, password.
   * @param {object} fields
   */
  update(fields) {
    return request('/api/v1/profile', { method: 'PATCH', body: fields })
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PRODUCTS  (public — no auth required)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const products = {
  /**
   * List active products with optional category filter and pagination.
   * @param {{ category?, page?, limit? }} params
   */
  list({ category, page = 1, limit = 100 } = {}) {
    const q = new URLSearchParams({ page, limit })
    if (category) q.set('category', category)
    return request(`/api/v1/products?${q}`)
  },

  /**
   * List all distinct product categories.
   * Use to populate the department nav/filter pills.
   */
  categories() {
    return request('/api/v1/products/categories')
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  APPLICATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const applications = {
  /**
   * Submit a new grocery application.
   * For fixed packages:  { package_type: 'fixed', package_name, mandate_number }
   * For custom packages: { package_type: 'custom', cart_items: [{product_id, quantity}], mandate_number }
   * staff_number, institution, ghana_card_number are pulled from profile if already stored.
   * @param {object} fields
   */
  submit(fields) {
    return request('/api/v1/applications', { method: 'POST', body: fields })
  },

  /**
   * List all applications submitted by the authenticated user.
   * @param {{ page?, limit? }} params
   */
  list({ page = 1, limit = 20 } = {}) {
    return request(`/api/v1/applications?page=${page}&limit=${limit}`)
  },

  /**
   * Get a single application by its UUID.
   * @param {string} id
   */
  get(id) {
    return request(`/api/v1/applications/${id}`)
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CONVERSATIONS & MESSAGES  (client-side)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const conversations = {
  /**
   * Start a new conversation (or return existing one) with an initial message.
   * @param {string} message  — the first message to send
   */
  start(message) {
    return request('/api/v1/conversations', { method: 'POST', body: { message } })
  },

  /**
   * List all conversations for the authenticated user.
   * Returns last_message, unread_count, and other_user profile per conversation.
   * @param {{ page?, limit? }} params
   */
  list({ page = 1, limit = 20 } = {}) {
    return request(`/api/v1/conversations?page=${page}&limit=${limit}`)
  },

  /**
   * Get paginated messages for a conversation.
   * Fetching marks unread messages from the other participant as read.
   * @param {string} id       — conversation UUID
   * @param {{ page?, limit? }} params
   */
  messages(id, { page = 1, limit = 50 } = {}) {
    return request(`/api/v1/conversations/${id}/messages?page=${page}&limit=${limit}`)
  },

  /**
   * Send a message in a conversation.
   * @param {string} id       — conversation UUID
   * @param {string} content  — message text
   */
  send(id, content) {
    return request(`/api/v1/conversations/${id}/messages`, {
      method: 'POST',
      body: { content },
    })
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ADMIN — USERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const adminUsers = {
  /**
   * List all users. Optionally filter by role.
   * @param {{ role?, page?, limit? }} params
   */
  list({ role, page = 1, limit = 20 } = {}) {
    const q = new URLSearchParams({ page, limit })
    if (role) q.set('role', role)
    return request(`/api/v1/admin/users?${q}`)
  },

  /**
   * Update a user's display_name, phone_number, or role.
   * @param {string} id     — user UUID
   * @param {object} fields
   */
  update(id, fields) {
    return request(`/api/v1/admin/users/${id}`, { method: 'PATCH', body: fields })
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ADMIN — PRODUCTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const adminProducts = {
  /**
   * Create a new product.
   * @param {{ name, category, price, unit, active? }} fields
   */
  create(fields) {
    return request('/api/v1/admin/products', { method: 'POST', body: fields })
  },

  /**
   * Update product metadata (name, category, price, unit, active).
   * @param {string} id     — product UUID
   * @param {object} fields
   */
  update(id, fields) {
    return request(`/api/v1/admin/products/${id}`, { method: 'PATCH', body: fields })
  },

  /**
   * List all images for a product.
   * @param {string} id — product UUID
   */
  listImages(id) {
    return request(`/api/v1/admin/products/${id}/images`)
  },

  /**
   * Upload one or more images for a product.
   * @param {string} id         — product UUID
   * @param {FileList|File[]} files
   */
  uploadImages(id, files) {
    const form = new FormData()
    Array.from(files).forEach(f => form.append('images', f))
    return request(`/api/v1/admin/products/${id}/images`, {
      method: 'POST',
      body: form,
      multipart: true,
    })
  },

  /**
   * Delete a single product image.
   * @param {string} productId  — product UUID
   * @param {string} imageId    — image UUID
   */
  deleteImage(productId, imageId) {
    return request(`/api/v1/admin/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
    })
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ADMIN — APPLICATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const adminApplications = {
  /**
   * List all applications across all users.
   * @param {{ status?, page?, limit? }} params
   *   status: 'pending' | 'reviewed' | 'approved' | 'declined'
   */
  list({ status, page = 1, limit = 20 } = {}) {
    const q = new URLSearchParams({ page, limit })
    if (status) q.set('status', status)
    return request(`/api/v1/admin/applications?${q}`)
  },

  /**
   * Update the status of an application.
   * @param {string} id     — application UUID
   * @param {string} status — 'pending' | 'reviewed' | 'approved' | 'declined'
   */
  updateStatus(id, status) {
    return request(`/api/v1/admin/applications/${id}`, {
      method: 'PATCH',
      body: { status },
    })
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ADMIN — CONVERSATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const adminConversations = {
  /**
   * List all customer conversations in the shared admin inbox.
   * @param {{ page?, limit? }} params
   */
  list({ page = 1, limit = 20 } = {}) {
    return request(`/api/v1/admin/conversations?page=${page}&limit=${limit}`)
  },

  /**
   * Send a message to a customer as admin.
   * @param {string} id       — conversation UUID
   * @param {string} content  — message text
   */
  send(id, content) {
    return request(`/api/v1/admin/conversations/${id}/messages`, {
      method: 'POST',
      body: { content },
    })
  },

  /**
   * Get paginated messages for a conversation (admin view).
   * Reuses the same /conversations/:id/messages endpoint — auth cookie determines role.
   * @param {string} id — conversation UUID
   * @param {{ page?, limit? }} params
   */
  messages(id, { page = 1, limit = 50 } = {}) {
    return request(`/api/v1/conversations/${id}/messages?page=${page}&limit=${limit}`)
  },
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  POLLING HELPER
//  Lightweight polling for new messages — used until WebSockets are added.
//  Usage:
//    const stop = pollMessages(convId, onNewMessages, 10000)
//    // call stop() to cancel polling (e.g. on component unmount)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function pollMessages(conversationId, onNewMessages, intervalMs = 10000) {
  let lastCount = 0
  let timer = null
  let stopped = false

  const poll = async () => {
    if (stopped) return
    try {
      const data = await conversations.messages(conversationId, { limit: 50 })
      const msgs = data.messages || []
      if (msgs.length > lastCount) {
        lastCount = msgs.length
        onNewMessages(msgs)
      }
    } catch {
      // silently skip failed polls — don't crash the UI
    }
    if (!stopped) timer = setTimeout(poll, intervalMs)
  }

  // Start immediately then repeat
  poll()

  return function stop() {
    stopped = true
    if (timer) clearTimeout(timer)
  }
}
