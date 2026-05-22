/* V8: Remove cliente.documento and cliente.email; add cliente.aniversario */

BEGIN;

-- Drop columns if they exist (data will be lost). Consider backing up before running in production.
ALTER TABLE cliente DROP COLUMN IF EXISTS documento;
ALTER TABLE cliente DROP COLUMN IF EXISTS email;

-- Add birthday column (aniversario)
ALTER TABLE cliente ADD COLUMN IF NOT EXISTS aniversario DATE;

COMMIT;
