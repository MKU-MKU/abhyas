# @abhyas/auth

Authentication is deliberately adapter-based. The application depends on `SessionAdapter`, while the concrete identity provider can be introduced without coupling quiz logic to a vendor.

Resource authorization is enforced by authenticated user identity, not by a client-supplied user ID.
