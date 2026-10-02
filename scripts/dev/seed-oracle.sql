-- Dados FICTÍCIOS para desenvolvimento local do EID (Oracle / FREEPDB1).
-- Empresas, CNPJs, e-mails e contratos são inventados apenas para demonstrar o painel.
-- Só insere se a tabela SUPPLIERS estiver vazia; pode ser executado mais de uma vez.
--
-- Uso (PowerShell, na raiz do projeto, com o container eid-oracle rodando):
--   Get-Content scripts/dev/seed-oracle.sql | docker exec -i eid-oracle sqlplus -s / as sysdba
-- A conexão usa a autenticação do sistema operacional do container: nenhuma senha
-- é digitada, exibida ou passada na linha de comando.

SET FEEDBACK ON
ALTER SESSION SET CONTAINER = FREEPDB1;
ALTER SESSION SET CURRENT_SCHEMA = SYSTEM;
SET SERVEROUTPUT ON

DECLARE
  v_count NUMBER;
  v_s1 NUMBER; v_s2 NUMBER; v_s3 NUMBER; v_s4 NUMBER; v_s5 NUMBER;

  FUNCTION add_supplier(p_name VARCHAR2, p_tax VARCHAR2, p_email VARCHAR2, p_phone VARCHAR2, p_active NUMBER)
    RETURN NUMBER IS v_id NUMBER;
  BEGIN
    INSERT INTO "SUPPLIERS" ("CompanyName", "TaxId", "ContactEmail", "ContactPhone", "IsActive", "CreatedAt")
    VALUES (p_name, p_tax, p_email, p_phone, p_active, SYSTIMESTAMP)
    RETURNING "Id" INTO v_id;
    RETURN v_id;
  END;

  PROCEDURE add_contract(p_supplier NUMBER, p_title VARCHAR2, p_value NUMBER,
                         p_start_offset NUMBER, p_end_offset NUMBER, p_status NUMBER, p_desc VARCHAR2) IS
  BEGIN
    INSERT INTO "CONTRACTS" ("SupplierId", "Title", "Value", "StartDate", "EndDate", "Status", "Description", "CreatedAt")
    VALUES (p_supplier, p_title, p_value,
            CAST(TRUNC(SYSDATE) + p_start_offset AS TIMESTAMP),
            CAST(TRUNC(SYSDATE) + p_end_offset AS TIMESTAMP),
            p_status, p_desc, SYSTIMESTAMP);
  END;
BEGIN
  SELECT COUNT(*) INTO v_count FROM "SUPPLIERS";

  IF v_count > 0 THEN
    DBMS_OUTPUT.PUT_LINE('SUPPLIERS já possui ' || v_count || ' registro(s). Nada foi inserido.');
    RETURN;
  END IF;

  v_s1 := add_supplier('Atlas Componentes Industriais Ltda (fictícia)', '11.111.111/0001-11', 'contato@atlas.exemplo', '(31) 3000-1001', 1);
  v_s2 := add_supplier('Brisa Logística e Transportes SA (fictícia)',   '22.222.222/0001-22', 'comercial@brisa.exemplo', '(11) 3000-2002', 1);
  v_s3 := add_supplier('Cobalto Serviços de TI Ltda (fictícia)',        '33.333.333/0001-33', 'vendas@cobalto.exemplo', '(21) 3000-3003', 1);
  v_s4 := add_supplier('Delta Facilities ME (fictícia)',                '44.444.444/0001-44', 'atendimento@delta.exemplo', '(31) 3000-4004', 1);
  v_s5 := add_supplier('Eixo Embalagens Ltda (fictícia)',               '55.555.555/0001-55', 'contato@eixo.exemplo', '(41) 3000-5005', 0);

  -- Status: 0 = Rascunho, 1 = Ativo, 2 = Expirado, 3 = Cancelado (enum ContractStatus)
  add_contract(v_s1, 'Fornecimento de rolamentos 2026',       185000.00, -120,  245, 1, 'Reposição trimestral de rolamentos e vedações.');
  add_contract(v_s1, 'Manutenção preventiva de esteiras',      48500.00,  -60,   20, 1, 'Visitas mensais nas linhas 1 e 2.');
  add_contract(v_s2, 'Transporte rodoviário Sudeste',         320000.00,  -30,  335, 1, 'Fretes entre centros de distribuição.');
  add_contract(v_s2, 'Armazenagem temporária',                  27900.00, -400,  -35, 2, 'Contrato encerrado após a mudança de galpão.');
  add_contract(v_s3, 'Suporte de infraestrutura e redes',     96000.00,  -200,   12, 1, 'Atendimento N2 em horário comercial.');
  add_contract(v_s3, 'Licenças de monitoramento',              18750.00,    5,  370, 0, 'Proposta em revisão jurídica.');
  add_contract(v_s4, 'Limpeza e conservação predial',          64200.00,  -90,  275, 1, NULL);
  add_contract(v_s5, 'Embalagens personalizadas',              33400.00, -300,  -10, 3, 'Cancelado por descontinuidade do fornecedor.');

  COMMIT;
  DBMS_OUTPUT.PUT_LINE('Inseridos 5 fornecedores e 8 contratos fictícios.');
END;
/
EXIT
