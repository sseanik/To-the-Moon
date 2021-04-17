CREATE TABLE IF NOT EXISTS dashboard_references (
    id UUID NOT NULL DEFAULT UUID_GENERATE_V1() PRIMARY KEY,
    dashboard_id UUID NOT NULL REFERENCES dashboards(id),
    block_id UUID NOT NULL REFERENCES dashboard_blocks(id)
);
