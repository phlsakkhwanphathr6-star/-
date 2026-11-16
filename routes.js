const express = require("express");
const crypto = require("crypto");
const db = require("./db");
const router = express.Router();

function userKey(req, res, next) {
  const key = String(req.get("x-user-key") || "");
  if (!/^[a-zA-Z0-9_-]{8,100}$/.test(key)) return res.status(400).json({error:"invalid user key"});
  req.userKey = key; next();
}
function adminOnly(req, res, next) {
  const expected = process.env.ADMIN_TOKEN || "";
  const supplied = (req.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!expected || !supplied) return res.sendStatus(401);
  const a=Buffer.from(expected), b=Buffer.from(supplied);
  if(a.length!==b.length || !crypto.timingSafeEqual(a,b)) return res.sendStatus(403);
  next();
}
router.get("/records", userKey, (req,res) => {
  const rows=db.prepare("SELECT * FROM records WHERE user_key=? ORDER BY created_at DESC LIMIT 30").all(req.userKey);
  res.json(rows.map(row => ({id:row.id,t:row.created_at,ty:row.type,lb:row.label,inc:row.income,net:row.net_income,tax:row.tax,sn:JSON.parse(row.snapshot)})));
});
router.put("/records", userKey, (req,res) => {
  const items=Array.isArray(req.body.items)?req.body.items.slice(0,30):[];
  const insert=db.prepare(`INSERT OR REPLACE INTO records
    (id,user_key,created_at,type,label,income,net_income,tax,snapshot)
    VALUES (@id,@user_key,@created_at,@type,@label,@income,@net_income,@tax,@snapshot)`);
  const tx=db.transaction(() => {
    db.prepare("DELETE FROM records WHERE user_key=?").run(req.userKey);
    for(const r of items){
      if(!r || !["p","c"].includes(r.ty)) continue;
      insert.run({
        id:String(r.id || crypto.randomUUID()), user_key:req.userKey,
        created_at:Number(r.t)||Date.now(), type:r.ty, label:String(r.lb||"").slice(0,60),
        income:Number(r.inc)||0, net_income:Number(r.net)||0, tax:Number(r.tax)||0,
        snapshot:JSON.stringify(r.sn||{})
      });
    }
  });
  tx(); res.json({ok:true,count:items.length});
});
router.delete("/records/:id", userKey, (req,res) => {
  const result=db.prepare("DELETE FROM records WHERE id=? AND user_key=?").run(req.params.id,req.userKey);
  res.json({ok:result.changes>0});
});
router.get("/admin/records", adminOnly, (req,res) => {
  const records=db.prepare("SELECT id,user_key,created_at AS t,type AS ty,label AS lb,income AS inc,net_income AS net,tax FROM records ORDER BY created_at DESC LIMIT 500").all();
  res.json({records});
});
module.exports=router;
