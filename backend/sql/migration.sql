USE cookshare;

ALTER TABLE recipes ADD COLUMN title_ta VARCHAR(200);
ALTER TABLE recipes ADD COLUMN description_ta TEXT;
ALTER TABLE recipes ADD COLUMN video_url VARCHAR(1000);
ALTER TABLE recipes ADD COLUMN subtitle_url VARCHAR(1000);

ALTER TABLE ingredients ADD COLUMN name_ta VARCHAR(150);
ALTER TABLE ingredients ADD COLUMN unit_ta VARCHAR(50);

ALTER TABLE recipe_steps ADD COLUMN instruction_ta TEXT;
