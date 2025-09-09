package constants

import "net/textproto"

var (
	XServiceName  = textproto.CanonicalMIMEHeaderKey("x-service-name")
	XApiKey       = textproto.CanonicalMIMEHeaderKey("x---key")
	XRequestAt    = textproto.CanonicalMIMEHeaderKey("x-request-at")
	Authorization = textproto.CanonicalMIMEHeaderKey("authorization")
)
