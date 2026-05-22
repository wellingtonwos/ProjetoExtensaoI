-- Garante unicidade de nome e e-mail na tabela usuario ao nível do banco.
-- Se houver duplicatas existentes, remova-as manualmente antes de aplicar esta migration.
ALTER TABLE usuario ADD CONSTRAINT uq_usuario_nome  UNIQUE (nome);
ALTER TABLE usuario ADD CONSTRAINT uq_usuario_email UNIQUE (email);
