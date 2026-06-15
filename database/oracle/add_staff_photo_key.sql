-- Add staff photo key column for SeaweedFS object path storage.
-- Run once on existing DB:
--   sqlplus hp/password@localhost/XE @database/oracle/add_staff_photo_key.sql

BEGIN
    EXECUTE IMMEDIATE 'ALTER TABLE HIS_STAFF_MST ADD (STAFF_PHOTO_KEY VARCHAR2(500))';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -1430 THEN
            RAISE;
        END IF;
END;
/

COMMENT ON COLUMN HIS_STAFF_MST.STAFF_PHOTO_KEY IS 'SeaweedFS 객체 경로 (/bucket/emp-photo/...)';

COMMIT;
EXIT;
