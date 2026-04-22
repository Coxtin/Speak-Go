-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "tickets_count" INTEGER NOT NULL DEFAULT 1,
    "total_price" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'PENDING',
    "payment_intent_id" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "event_name" VARCHAR(150) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "location" VARCHAR(150) NOT NULL,
    "event_date" TIMESTAMP(6) NOT NULL,
    "image_url" TEXT,
    "status" VARCHAR(20) DEFAULT 'ACTIVE',
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "currency" VARCHAR(3) DEFAULT 'RON',
    "total_tickets" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_codes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(6) NOT NULL,
    "used" BOOLEAN DEFAULT false,

    CONSTRAINT "reset_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(50) NOT NULL,
    "lastname" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "age" INTEGER NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "profile_image" TEXT,
    "generated_notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "username" VARCHAR(50),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_bookings_event" ON "bookings"("event_id");

-- CreateIndex
CREATE INDEX "idx_bookings_name" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "idx_bookings_status" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "idx_event_category" ON "events"("category");

-- CreateIndex
CREATE INDEX "idx_event_date" ON "events"("event_date");

-- CreateIndex
CREATE INDEX "idx_event_title" ON "events"("event_name");

-- CreateIndex
CREATE INDEX "idx_reset_codes" ON "reset_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reset_codes" ADD CONSTRAINT "reset_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;


