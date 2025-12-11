#!/bin/bash

BASE_URL="http://localhost"
EMAIL="testuser@example.com"
PASSWORD="password123"
NAME="Test User"

echo "Waiting for services to be ready..."
sleep 10

echo "1. Registering User..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$NAME\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

if [[ $REGISTER_RESPONSE == *"token"* ]]; then
  echo "PASS: Registration successful"
else
  echo "FAIL: Registration failed - $REGISTER_RESPONSE"
  exit 1
fi

echo "2. Logging In..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [[ -n "$TOKEN" ]]; then
  echo "PASS: Login successful"
else
  echo "FAIL: Login failed - $LOGIN_RESPONSE"
  exit 1
fi

echo "3. Fetching User Profile..."
ME_RESPONSE=$(curl -s -X GET $BASE_URL/auth/me \
  -H "Authorization: Bearer $TOKEN")

if [[ $ME_RESPONSE == *"$EMAIL"* ]]; then
  echo "PASS: Profile fetch successful"
else
  echo "FAIL: Profile fetch failed - $ME_RESPONSE"
  exit 1
fi

echo "4. Uploading File..."
echo "This is a test file" > testfile.txt
UPLOAD_RESPONSE=$(curl -s -X POST $BASE_URL/file/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@testfile.txt")

if [[ $UPLOAD_RESPONSE == *"fileId"* ]]; then
  echo "PASS: File upload successful"
else
  echo "FAIL: File upload failed - $UPLOAD_RESPONSE"
  exit 1
fi

rm testfile.txt

echo "5. Sending Notification..."
NOTIFY_RESPONSE=$(curl -s -X POST $BASE_URL/notify/email \
  -H "Content-Type: application/json" \
  -d "{\"to\": \"$EMAIL\", \"subject\": \"Test Notification\", \"message\": \"Hello from MicroStack\"}")

if [[ $NOTIFY_RESPONSE == *"queued"* ]]; then
  echo "PASS: Notification queued"
else
  echo "FAIL: Notification failed - $NOTIFY_RESPONSE"
  exit 1
fi

echo "ALL TESTS PASSED!"
