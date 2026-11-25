# SK Tape Ball Academy — Phase 1 inventory aur Task 4 v15 audit

**Review date:** 25 November 2026  
**Source:** `sk-tape-ball-academy.zip`  
**Scope:** ZIP inventory, project architecture ka initial audit, aur `task4_migration_v15.sql` ka complete static review.

## Faisla

- **Original v15:** **NEEDS CORRECTIONS** — Step 8 aur Step 9 mein nested `$$` delimiters DO blocks ko waqt se pehle band kar dete hain; script parse nahi hoti. Step 2 mein `ON DELETE SET NULL` ke liye nullable-column guard bhi missing hai.
- **Reviewed candidate:** **STATIC REVIEW PASSED — DATABASE VERIFICATION REQUIRED** — candidate mein delimiter issue fix kiya aur Step 2 guard add kiya. PostgreSQL parser/database test nahi chalaya; live schema/data ki tasdeeq aur controlled execution plan abhi baqi hain.
- Koi SQL execute nahi hua, live Supabase se connection nahi ki, aur user data ya policies change nahi ki.

## Execution blockers / preflight

- Original v15 ko execute nahi karna: Step 8/9 ke nested dollar delimiters syntax blocker hain.
- Reviewed candidate ko PostgreSQL parser ke against verify karna abhi baqi hai; is environment mein `psql`/SQL parser nahi mila. Candidate par database execution nahi hui.
- Read-only diagnostics se pehle actual column types/nullability, role/status values, duplicates, RLS/full visibility, function ACLs, sequence state, aur table sizes verify karne honge.
- Controlled execution se pehle backup/recovery aur write-lock window tay karni hogi. SQL ke liye user ki explicit execution approval alag se required hai; is pass mein woh action nahi liya.

## Phase 1 — Project inventory

- ZIP mein 10,423 entries hain. Is mein React app ka source, `dist/` build output, `node_modules/`, aur Task 4 ke v9 se v15 tak saat SQL files shamil hain. Source/config ko `work/` mein extract kiya; `.env.local` aur purana `dist/` extract nahi kiye. `node_modules/` baad mein sirf isolated frontend checks ke liye extract hua; naya build output bhi isi temporary copy ke andar bana.
- Actual stack: React 19, TypeScript, Vite 8, React Router 7, Tailwind CSS 4, aur Supabase JS 2. Source folder mein 123 files hain. Package scripts `dev`, `build`, `preview`, `clean`, aur `lint` hain; lock file `bun.lock` hai.
- Structure `src/pages`, `src/pages/admin`, `src/components`, `src/routes`, `src/services`, `src/data`, `src/types` mein divided hai. Public aur admin routes dono present hain. Navy/gold brand tokens maujood hain, lekin official logo asset ZIP mein nahi hai; `OFFICIAL_LOGO_CONFIG.src` abhi `null` hai aur component `LOGO` placeholder dikhata hai. Release se pehle original logo asset dena zaroori hai; code usay recreate ya recolor nahi karta.
- Supabase client `src/services/supabaseClient.ts` mein initialize hota hai aur frontend mein `service_role` key detect karke reject karta hai. Lekin source search mein Supabase `.from()`, `.auth`, ya `.storage` operations nahi mile. `academyService.ts` placeholder arrays/validation return karta hai; registration, trial booking aur login pages browser-side preview/validation hain.
- Admin dashboard aur management pages ka UI kaafi complete hai, magar `adminMockData.ts`, local React state, aur page text unhein demo/preview dikhate hain. `AdminLayout.tsx` khud “Frontend Demonstration Only” kehta hai; route ke samne authentication guard nazar nahi aaya. Yeh Phase 5–8 ke liye pending kaam hai, live CRUD ka saboot nahi.
- ZIP mein base schema migration ya Supabase project config nahi mili; sirf Task 4 v9–v15 files hain. Is liye existing tables, policies aur actual data ko source package se independently confirm nahi kiya ja sakta.
- ZIP mein `.env.local` maujood hai, halanke `.gitignore` `.env*` ignore karta hai. Maine is file ka content nahi khola aur koi value report nahi ki. Is ZIP ko share karne se pehle is file ko hata dein; agar is mein koi private key thi aur ZIP bahar share hua hai, to us key ko rotate karein. Supabase anon/publishable key public hoti hai, lekin `service_role`/secret key kabhi frontend ya shared ZIP mein nahi honi chahiye.

## v15 source aur integrity

- Reviewed source: `task4_migration_v15.sql`, **2,147 lines**, **90,859 bytes**.
- Original v15 SHA-256: `3ECC185977761C227F246C6B3C7E693D43B58D25BF489C410B30F2E51FD2DCF9`.
- Reviewed candidate: **2,158 lines**. Candidate mein Step 8/9 ke default-string delimiters `$default$` kiye, unki wajah batane ke liye do comments add kiye, Step 2 nullability preflight guard add kiya, aur review-copy header/end label update kiya. Original ZIP/v15 overwrite nahi hua.
- Reviewed candidate SHA-256: `15B0B317C8402FCCEFFCDA559F4FFF9D7667706FDC08F2C3557F1B9E272A78E6`.
- Frontend checks isolated copy mein: `npm run lint` **passed** (`tsc --noEmit`, exit 0); `npm run build` **passed** (Vite 8.3.8, exit 0). Build ne `vite.config.ts` ke `__dirname` use par native config-loader warning di. `package.json` mein test script nahi hai. Yeh checks SQL syntax ya database behavior test nahi karte.

## Findings

### C1 — Critical — Nested dollar-quoted strings script ko parse nahi hone dete

**Location:** v15 Step 8 lines 1024, 1029–1030; Step 9 lines 1219, 1222. Dono blocks outer `DO $$ ... $$` use karte hain.

In lines par andarooni string values bhi `$$...$$` se quote ki gayi hain. PostgreSQL dollar quote nesting support nahi karta: pehla inner `$$` outer DO body ko close kar deta hai, jis ke baad bacha hua text SQL ke taur par parse nahi hota. Is liye original v15 `COMMIT` tak nahi pohanch sakta. Explicit transaction ki wajah se aam DDL/DML rollback honi chahiye, lekin us se pehle chal chuke `setval()` changes rollback nahi hote aur sequence gaps/high-water advance reh sakte hain.

**Zaroori correction:** reviewed candidate mein in five default-expression lines ke inner delimiters `$default$...$default$` kar diye hain, jo outer DO delimiter se alag hain. Yeh migration ko database mein test karne ka saboot nahi; parser test abhi baqi hai.

### H1 — High — FK action aur column nullability mismatch

**Location:** v15 Step 2, lines 169–348; column/type check lines 202–225; FK creation lines 341–348.

`students.guardian_profile_id` ke liye FK `ON DELETE SET NULL` banaya jata hai. Agar column pehle se `NOT NULL` ho, migration phir bhi FK ko add/accept kar sakti hai; baad mein linked profile delete karne par database `NULL` nahi rakh payega aur delete fail hoga. Migration existing column ka type check karti hai, nullability nahi.

**Zaroori correction:** reviewed candidate mein `attnotnull` check hai. Agar column `NOT NULL` ho to script koi automatic schema change kiye baghair exception degi; relationship ka intended behavior pehle decide karna hoga. Yeh correction database execution se pehle zaroori hai.

### M1 — Medium — `created_at` data type aur UTC year assumption verify honi chahiye

**Location:** v15 lines 1473–1505, 1529–1561, 1902–1905, 1958–1961.

Backfill aur triggers `created_at AT TIME ZONE 'UTC'` se `YY` nikalte hain, lekin `created_at` ka type verify nahi karte. `timestamptz` aur `timestamp without time zone` ke liye `AT TIME ZONE` ka result alag hota hai; doosri surat mein formatting session timezone se affect ho sakti hai, khas taur par saal ke boundary par. PostgreSQL docs in dono conversions ko alag define karte hain: [Date/Time functions](https://www.postgresql.org/docs/current/functions-datetime.html).

**Zaroori action:** read-only diagnostics se dono tables ka `created_at` type check karein. Agar type `timestamp with time zone` nahi hai, to timestamp ka intended timezone decide karke expression ko us hisaab se review karein; main ne type assume nahi kiya.

### M2 — Medium — RLS ke tehat preflight query ka full row visibility zaroori hai

**Location:** v15 lines 441–488, 491–524, 1039–1083, 1234–1277.

**Static inference:** role/status preflight `SELECT` aur normalization `UPDATE` RLS ke rules ke mutabiq rows dekhte hain. Agar migration role kuch rows nahi dekh sakta, aur table par pehle se matching magar `NOT VALID` CHECK ho, to script kuch hidden legacy values miss karke us constraint ko “already correct” samajh sakti hai. PostgreSQL docs ke mutabiq RLS rows ko filter kar sakti hai aur `FORCE ROW LEVEL SECURITY` owner ko bhi policy ke tehat la sakta hai: [Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html). Yeh conditional risk hai; current RLS/schema state ZIP mein nahi hai.

**Zaroori action:** migration sirf us database role se chalane ka plan banayein jo tamam rows dekh sakta ho, aur diagnostic output se RLS/`FORCE ROW LEVEL SECURITY` check karein. Policies disable ya modify karne ki recommendation nahi hai.

### M3 — Medium — Migration writes ko der tak block kar sakti hai

**Location:** v15 lines 121–130; backfill lines 1488–1511 aur 1544–1567.

Chaar tables par `SHARE ROW EXCLUSIVE` locks `COMMIT` tak rehte hain. Reference codes row-by-row backfill hote hain; table size ke mutabiq transaction aur write block lamba ho sakta hai. PostgreSQL constraint scans aur concurrent update locking ke asraat document karta hai: [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html).

**Recommended action:** diagnostic se row-count estimates aur table sizes dekhein; phir low-traffic maintenance window aur backup/rollback plan ke sath controlled execution plan banayein. `SHARE ROW EXCLUSIVE` lock `INSERT`/`UPDATE`/`DELETE` ke `ROW EXCLUSIVE` lock se conflict karta hai: [Explicit Locking](https://www.postgresql.org/docs/17/explicit-locking.html). Is review mein migration run nahi hui.

### L1 — Low — Existing function grants `CREATE OR REPLACE` ke baad reh sakte hain

**Location:** v15 lines 1883–1936 aur 1939–1992.

`CREATE OR REPLACE FUNCTION` existing function ki ownership aur permissions retain karta hai; script sirf `PUBLIC` se `EXECUTE` revoke karti hai. Agar pehle kisi app role ko explicit grant diya gaya tha, woh grant re-run ke baad bhi reh sakta hai. PostgreSQL is behavior ko [CREATE FUNCTION](https://www.postgresql.org/docs/current/sql-createfunction.html) mein document karta hai.

**Recommended action:** diagnostics se function owner aur ACL review karein. Existing app-role grants hon to unhein intended trigger-use ke mutabiq explicitly review karein; custom roles ko bina review blanket revoke na karein.

### L2 — Low — Same FK kisi aur naam se ho to duplicate FK ban sakta hai

**Location:** v15 lines 227–348.

Existing FK ko sirf `fk_students_guardian_profile` naam se dhoonda jata hai. Agar wahi relationship kisi aur constraint name ke sath pehle se maujood ho, script usay equivalent nahi pehchanti aur doosra FK add kar sakti hai. Yeh row loss ka risk nahi, magar redundant checks aur maintenance cost barhate hain.

**Recommended action:** diagnostics mein `students` ke tamam FK constraints dekhein. Agar duplicate relation pehle se hai to execution se pehle dono ko manually review karein.

### H2 — High, conditional — ZIP ke andar `.env.local`

**Location:** archive entry `sk-tape-ball-academy/.env.local`; content read nahi kiya.

Yeh file ZIP mein hai jabke `.gitignore` isay ignore karta hai. Agar is mein private credential ho aur archive kisi aur ko bheja gaya ho, credential exposed samjha jaye aur rotate kiya jaye. Is review ne koi secret value display nahi ki.

## Review checklist — v15

- **Destructive/data-loss operations:** koi `DROP TABLE`, `TRUNCATE`, ya `DELETE FROM` nahi mila. Migration roles/statuses normalize aur reference codes backfill karne ke liye rows `UPDATE` karti hai. Sirf pehchani gayi legacy CHECK constraints aur named triggers drop hote hain; unknown definition par error hota hai. Data mutation phir bhi hoti hai, lekin row deletion ka operation nahi.
- **Schema/columns:** `students.full_name`, `students.guardian_profile_id`, aur dono `reference_code` columns ke existing types check hote hain. Required table/column presence aur status/role column data types ki tamam tasdeeq nahi hai; live diagnostics zaroori hain.
- **Role normalization:** Step 3 `admin/coach/student/parent` aur title-case variants ko handle karta hai. `guardian`, `user`, aur unknown values ko remap nahi karta; unsupported values CHECK changes se pehle error dete hain. User ka yeh review target **pass** hai.
- **Statuses/constraints:** known values map hoti hain; unknown values halt karti hain. `NOT NULL` lagane se pehle NULL row count check hota hai. CHECK changes se pehle values/definitions inspect hote hain. Kuch catalog comparisons exact text definition par dependent hain; equivalent magar differently-rendered constraints safely halt kar sakte hain.
- **Backfill/uniqueness:** blank/whitespace codes backfill ke baad `NOT NULL` aur duplicate audit ke baad unique enforcement hoti hai. Existing nonblank codes preserve hote hain. Standalone valid single-column unique index reuse ho sakta hai.
- **Sequences/reference codes:** expected sequence settings validate hoti hain; sequence ko reset/drop nahi kiya jata, high-water mark sirf advance hota hai. Sequence values gaps rakh sakti hain; PostgreSQL ke mutabiq `nextval`/`setval` transaction rollback se undo nahi hote: [Sequence functions](https://www.postgresql.org/docs/15/functions-sequence.html). Script is caveat ko comments mein disclose karti hai.
- **Triggers/functions:** named existing triggers ko drop karne se pehle table, event, type, arguments aur function binding check hote hain. New trigger functions `SECURITY DEFINER`, fixed empty `search_path`, qualified sequence names aur `PUBLIC` execute revoke use karti hain. Explicit grants ke liye L1 dekhein.
- **Step 14 target:** function ko sirf naam se identify nahi karta: `pronargs = 0`, return type `trigger`, aur exactly one match verify hota hai. Is review target ka code **pass** hai.
- **Transaction/Supabase/RLS:** explicit `BEGIN`/`COMMIT` hai. Policies ya RLS settings change nahi hotin. Original v15 ka nested quote syntax defect `COMMIT` tak pohanchne se rokta hai; corrected candidate mein delimiters alag hain, magar database parser test baqi hai. Sequence state rollback exception aur privileged/full-visibility execution requirement upar note kiye gaye hain. Supabase ke live PostgreSQL version, role grants, tables, RLS aur data ki tasdeeq ZIP se nahi ho sakti.

## Exact next step

`Task4-v15-database-diagnostics.sql` ko pehle parhein. Yeh sirf `SELECT` statements hain, magar kuch queries table data group/scan karti hain aur read load paida kar sakti hain. Isay sirf apne intended Supabase project par, credentials share kiye baghair, low-traffic waqt chalayein. Output mein `created_at` types, roles/statuses, NULL/blank timestamps/codes, duplicates, constraints/indexes, triggers/functions, sequence settings aur RLS visibility inspect karein. Us result ke baad execution plan banega; SQL ko abhi run nahi karna.
