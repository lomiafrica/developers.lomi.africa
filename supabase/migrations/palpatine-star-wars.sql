-- Migration: fetch_developer_ids
-- Description: Creates a function to fetch merchant_id (user_id) and the first associated organization_id for the developer portal context.

CREATE OR REPLACE FUNCTION public.fetch_developer_ids(
    p_user_id uuid
)
RETURNS TABLE (
    merchant_id uuid,
    organization_id uuid
)
LANGUAGE plpgsql
-- Use INVOKER as we want to find the org for the calling user
-- RLS on merchant_organization_links should allow the user to see their own links.
SECURITY INVOKER
SET search_path = public -- Assuming merchant_organization_links is in public
AS $$
DECLARE
    v_organization_id uuid;
BEGIN
    -- Find the first organization the user is a member of
    -- using the correct table and column names
    SELECT
        mol.organization_id -- Select the organization_id
    INTO
        v_organization_id   -- Store it in the variable
    FROM
        merchant_organization_links mol -- Query the correct table
    WHERE
        mol.merchant_id = p_user_id -- Filter by the user's ID (merchant_id)
    ORDER BY
        mol.created_at -- Prioritize the oldest membership if multiple exist
    LIMIT 1;

    -- Return the user_id as merchant_id and the found organization_id (or NULL)
    RETURN QUERY
    SELECT
        p_user_id AS merchant_id,
        v_organization_id AS organization_id;
END;
$$;

-- Grant execute permission to the authenticated role
-- Note: SECURITY INVOKER means the function runs as the user,
-- so the user needs underlying SELECT permissions on merchant_organization_links (via RLS or direct GRANT)
-- Granting EXECUTE here allows the user to call the function itself.
GRANT EXECUTE ON FUNCTION public.fetch_developer_ids(uuid) TO authenticated;

COMMENT ON FUNCTION public.fetch_developer_ids(uuid) IS 'Fetches the user ID (as merchant_id) and the ID of the first organization the user belongs to (using merchant_organization_links), for developer context.'; 