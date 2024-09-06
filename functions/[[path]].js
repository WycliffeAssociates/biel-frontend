globalThis.process = {
  argv: [],
  env: {},
};
var zv = Object.create;
var Qc = Object.defineProperty;
var qv = Object.getOwnPropertyDescriptor;
var Uv = Object.getOwnPropertyNames;
var Bv = Object.getPrototypeOf,
  Vv = Object.prototype.hasOwnProperty;
var op = ((t) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
    ? new Proxy(t, {get: (e, r) => (typeof require < "u" ? require : e)[r]})
    : t)(function (t) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + t + '" is not supported');
});
var b = (t, e) => () => (t && (e = t((t = 0))), e);
var de = (t, e) => () => (e || t((e = {exports: {}}).exports, e), e.exports),
  vt = (t, e) => {
    for (var r in e) Qc(t, r, {get: e[r], enumerable: !0});
  },
  Kv = (t, e, r, n) => {
    if ((e && typeof e == "object") || typeof e == "function")
      for (let s of Uv(e))
        !Vv.call(t, s) &&
          s !== r &&
          Qc(t, s, {
            get: () => e[s],
            enumerable: !(n = qv(e, s)) || n.enumerable,
          });
    return t;
  };
var Ot = (t, e, r) => (
  (r = t != null ? zv(Bv(t)) : {}),
  Kv(
    e || !t || !t.__esModule ? Qc(r, "default", {value: t, enumerable: !0}) : r,
    t
  )
);
function Wv(t) {
  return t instanceof Error
    ? t
    : new Error(typeof t == "string" ? t : "Unknown error", {cause: t});
}
function zn(t, e = Z) {
  let r = e && e.context && e.context[lp],
    n = Wv(t);
  if (!r) throw n;
  try {
    for (let s of r) s(n);
  } catch (s) {
    zn(s, (e && e.owner) || null);
  }
}
function Po() {
  let t = {
    owner: Z,
    context: Z ? Z.context : null,
    owned: null,
    cleanups: null,
  };
  return Z && (Z.owned ? Z.owned.push(t) : (Z.owned = [t])), t;
}
function qn(t, e) {
  let r = Z,
    n = e === void 0 ? r : e,
    s =
      t.length === 0
        ? Gv
        : {
            context: n ? n.context : null,
            owner: n,
            owned: null,
            cleanups: null,
          };
  Z = s;
  let i;
  try {
    i = t(t.length === 0 ? () => {} : () => sl(s));
  } catch (o) {
    zn(o);
  } finally {
    Z = r;
  }
  return i;
}
function V(t, e) {
  return [() => t, (r) => (t = typeof r == "function" ? r(t) : r)];
}
function rl(t, e) {
  Z = Po();
  try {
    t(e);
  } catch (r) {
    zn(r);
  } finally {
    Z = Z.owner;
  }
}
function Ae(t, e) {
  Z = Po();
  let r;
  try {
    r = t(e);
  } catch (n) {
    zn(n);
  } finally {
    Z = Z.owner;
  }
  return () => r;
}
function fp(t) {
  return t();
}
function Dr(t, e, r = {}) {
  let n = Array.isArray(t),
    s = r.defer;
  return () => {
    if (s) return;
    let i;
    if (n) {
      i = [];
      for (let o = 0; o < t.length; o++) i.push(t[o]());
    } else i = t();
    return e(i);
  };
}
function se(t) {
  return Z && (Z.cleanups ? Z.cleanups.push(t) : (Z.cleanups = [t])), t;
}
function sl(t) {
  if (t.owned) {
    for (let e = 0; e < t.owned.length; e++) sl(t.owned[e]);
    t.owned = null;
  }
  if (t.cleanups) {
    for (let e = 0; e < t.cleanups.length; e++) t.cleanups[e]();
    t.cleanups = null;
  }
}
function ap(t, e) {
  let r = Po();
  (r.context = {...r.context, [lp]: [e]}), (Z = r);
  try {
    return t();
  } catch (n) {
    zn(n);
  } finally {
    Z = Z.owner;
  }
}
function Jt(t) {
  let e = Symbol("context");
  return {id: e, Provider: Yv(e), defaultValue: t};
}
function Mr(t) {
  return Z && Z.context && Z.context[t.id] !== void 0
    ? Z.context[t.id]
    : t.defaultValue;
}
function sn() {
  return Z;
}
function il(t) {
  let e = Ae(() => tl(t()));
  return (
    (e.toArray = () => {
      let r = e();
      return Array.isArray(r) ? r : r != null ? [r] : [];
    }),
    e
  );
}
function el(t, e) {
  let r = Z;
  Z = t;
  try {
    return e();
  } catch (n) {
    zn(n);
  } finally {
    Z = r;
  }
}
function tl(t) {
  if (typeof t == "function" && !t.length) return tl(t());
  if (Array.isArray(t)) {
    let e = [];
    for (let r = 0; r < t.length; r++) {
      let n = tl(t[r]);
      Array.isArray(n) ? e.push.apply(e, n) : e.push(n);
    }
    return e;
  }
  return t;
}
function Yv(t) {
  return function (r) {
    return Ae(
      () => ((Z.context = {...Z.context, [t]: r.value}), il(() => r.children))
    );
  };
}
function No(t) {
  let e = typeof t;
  if (e === "string") return t;
  if (t == null || e === "boolean") return "";
  if (Array.isArray(t)) {
    let r = "";
    for (let n = 0, s = t.length; n < s; n++) r += No(t[n]);
    return r;
  }
  return e === "object" ? t.t : e === "function" ? No(t()) : String(t);
}
function jn(t) {
  pe.context = t;
}
function Xv() {
  return pe.context
    ? {...pe.context, id: `${pe.context.id}${pe.context.count++}-`, count: 0}
    : void 0;
}
function Un() {
  let t = pe.context;
  if (!t)
    throw new Error(
      "createUniqueId cannot be used under non-hydrating context"
    );
  return `${t.id}${t.count++}`;
}
function E(t, e) {
  if (pe.context && !pe.context.noHydrate) {
    let r = pe.context;
    jn(Xv());
    let n = t(e || {});
    return jn(r), n;
  }
  return t(e || {});
}
function oe(...t) {
  let e = {};
  for (let r = 0; r < t.length; r++) {
    let n = t[r];
    if ((typeof n == "function" && (n = n()), n)) {
      let s = Object.getOwnPropertyDescriptors(n);
      for (let i in s)
        i in e ||
          Object.defineProperty(e, i, {
            enumerable: !0,
            get() {
              for (let o = t.length - 1; o >= 0; o--) {
                let a,
                  u = t[o];
                if (
                  (typeof u == "function" && (u = u()),
                  (a = (u || {})[i]),
                  a !== void 0)
                )
                  return a;
              }
            },
          });
    }
  }
  return e;
}
function tt(t, ...e) {
  let r = Object.getOwnPropertyDescriptors(t),
    n = (s) => {
      let i = {};
      for (let o = 0; o < s.length; o++) {
        let a = s[o];
        r[a] && (Object.defineProperty(i, a, r[a]), delete r[a]);
      }
      return i;
    };
  return e.map(n).concat(n(Object.keys(r)));
}
function Jv(t, e) {
  let r = t.each || [],
    n = r.length,
    s = t.children;
  if (n) {
    let i = Array(n);
    for (let o = 0; o < n; o++) i[o] = e(s, r[o], o);
    return i;
  }
  return t.fallback;
}
function Pe(t) {
  return Jv(t, (e, r, n) => e(r, () => n));
}
function Ce(t) {
  let e;
  return t.when
    ? typeof (e = t.children) == "function"
      ? e(t.keyed ? t.when : () => t.when)
      : e
    : t.fallback || "";
}
function ol(t) {
  let e = t.children;
  Array.isArray(e) || (e = [e]);
  for (let r = 0; r < e.length; r++) {
    let n = e[r].when;
    if (n) {
      let s = e[r].children;
      return typeof s == "function" ? s(e[r].keyed ? n : () => n) : s;
    }
  }
  return t.fallback || "";
}
function $s(t) {
  return t;
}
function up(t) {
  for (let e of t.resources.values()) if (e.loading) return !1;
  return !0;
}
function Io(t) {
  let e,
    r = pe.context,
    n = r.id + r.count,
    s = Po(),
    i =
      r.suspense[n] ||
      (r.suspense[n] = {
        resources: new Map(),
        completed: () => {
          let c = a();
          up(i) && e(No(c));
        },
      });
  function o(c) {
    (!e || !e(void 0, c)) &&
      el(s.owner, () => {
        throw c;
      });
  }
  function a() {
    return (
      jn({...r, count: 0}),
      sl(s),
      el(s, () =>
        E(Zv.Provider, {
          value: i,
          get children() {
            return ap(() => t.children, o);
          },
        })
      )
    );
  }
  let u = a();
  return up(i)
    ? (delete r.suspense[n], u)
    : ((e = r.async ? r.registerFragment(n) : void 0),
      ap(() => {
        if (r.async) {
          jn({...r, count: 0, id: r.id + "0-f", noHydrate: !0});
          let c = {
            t: `<template id="pl-${n}"></template>${No(
              t.fallback
            )}<!--pl-${n}-->`,
          };
          return jn(r), c;
        }
        return (
          jn({...r, count: 0, id: r.id + "0-f"}),
          r.serialize(n, "$$f"),
          t.fallback
        );
      }, o));
}
var cp,
  SN,
  EN,
  Lo,
  lp,
  Gv,
  Z,
  dp,
  nl,
  pe,
  Zv,
  Bn = b(() => {
    (cp = Symbol("solid-proxy")),
      (SN = Symbol("solid-track")),
      (EN = Symbol("solid-dev-component")),
      (Lo = void 0),
      (lp = Symbol("error"));
    (Gv = {context: null, owner: null, owned: null, cleanups: null}),
      (Z = null);
    dp = rl;
    nl = fp;
    pe = {};
    Zv = Jt();
  });
function Qv(t) {
  switch (t) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return;
  }
}
function Dt(t) {
  let e = "",
    r = 0,
    n;
  for (let s = 0, i = t.length; s < i; s++)
    (n = Qv(t[s])), n && ((e += t.slice(r, s) + n), (r = s + 1));
  return r === 0 ? (e = t) : (e += t.slice(r)), e;
}
function bp(t) {
  return t == null ? `${ko}=${ko}||[]` : `(${ko}=${ko}||{})["${Dt(t)}"]=[]`;
}
function al(t, e) {
  if (!t) throw e;
}
function ul(t) {
  return yp.has(t);
}
function ew(t) {
  return al(ul(t), new Ow(t)), yp.get(t);
}
function xp(t, e) {
  for (let r = 0, n = e.length; r < n; r++) {
    let s = e[r];
    t.has(s) || (t.add(s), s.extends && xp(t, s.extends));
  }
}
function vp(t) {
  if (t) {
    let e = new Set();
    return xp(e, t), [...e];
  }
}
function _r(t) {
  return {
    t: 2,
    i: void 0,
    s: t,
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function fl(t) {
  return t instanceof EvalError
    ? 1
    : t instanceof RangeError
    ? 2
    : t instanceof ReferenceError
    ? 3
    : t instanceof SyntaxError
    ? 4
    : t instanceof TypeError
    ? 5
    : t instanceof URIError
    ? 6
    : 0;
}
function cw(t) {
  let e = Sp[fl(t)];
  return t.name !== e
    ? {name: t.name}
    : t.constructor.name !== e
    ? {name: t.constructor.name}
    : {};
}
function pp(t, e) {
  let r = cw(t),
    n = Object.getOwnPropertyNames(t);
  for (let s = 0, i = n.length, o; s < i; s++)
    (o = n[s]),
      o !== "name" &&
        o !== "message" &&
        (o === "stack"
          ? e & 4 && ((r = r || {}), (r[o] = t[o]))
          : ((r = r || {}), (r[o] = t[o])));
  return r;
}
function Ep(t) {
  return Object.isFrozen(t)
    ? 3
    : Object.isSealed(t)
    ? 2
    : Object.isExtensible(t)
    ? 0
    : 1;
}
function lw(t) {
  switch (t) {
    case Number.POSITIVE_INFINITY:
      return ow;
    case Number.NEGATIVE_INFINITY:
      return aw;
  }
  return t !== t
    ? uw
    : Object.is(t, -0)
    ? iw
    : {
        t: 0,
        i: void 0,
        s: t,
        l: void 0,
        c: void 0,
        m: void 0,
        p: void 0,
        e: void 0,
        a: void 0,
        f: void 0,
        b: void 0,
        o: void 0,
      };
}
function dl(t) {
  return {
    t: 1,
    i: void 0,
    s: Dt(t),
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function dw(t) {
  return {
    t: 3,
    i: void 0,
    s: "" + t,
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function fw(t) {
  return {
    t: 4,
    i: t,
    s: void 0,
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function pw(t, e) {
  return {
    t: 5,
    i: t,
    s: e.toISOString(),
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    f: void 0,
    a: void 0,
    b: void 0,
    o: void 0,
  };
}
function hw(t, e) {
  return {
    t: 6,
    i: t,
    s: void 0,
    l: void 0,
    c: Dt(e.source),
    m: e.flags,
    p: void 0,
    e: void 0,
    a: void 0,
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function mw(t, e) {
  let r = new Uint8Array(e),
    n = r.length,
    s = new Array(n);
  for (let i = 0; i < n; i++) s[i] = r[i];
  return {
    t: 19,
    i: t,
    s,
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function gw(t, e) {
  return {
    t: 17,
    i: t,
    s: wp[e],
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function hp(t, e) {
  return {
    t: 18,
    i: t,
    s: Dt(ew(e)),
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function Tp(t, e, r) {
  return {
    t: 25,
    i: t,
    s: r,
    l: void 0,
    c: Dt(e),
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function bw(t, e, r) {
  return {
    t: 9,
    i: t,
    s: void 0,
    l: e.length,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: r,
    f: void 0,
    b: void 0,
    o: Ep(e),
  };
}
function yw(t, e) {
  return {
    t: 21,
    i: t,
    s: void 0,
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: e,
    b: void 0,
    o: void 0,
  };
}
function xw(t, e, r) {
  return {
    t: 15,
    i: t,
    s: void 0,
    l: e.length,
    c: e.constructor.name,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: r,
    b: e.byteOffset,
    o: void 0,
  };
}
function vw(t, e, r) {
  return {
    t: 16,
    i: t,
    s: void 0,
    l: e.length,
    c: e.constructor.name,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: r,
    b: e.byteOffset,
    o: void 0,
  };
}
function ww(t, e, r) {
  return {
    t: 20,
    i: t,
    s: void 0,
    l: e.byteLength,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: r,
    b: e.byteOffset,
    o: void 0,
  };
}
function Sw(t, e, r) {
  return {
    t: 13,
    i: t,
    s: fl(e),
    l: void 0,
    c: void 0,
    m: Dt(e.message),
    p: r,
    e: void 0,
    a: void 0,
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function Ew(t, e, r) {
  return {
    t: 14,
    i: t,
    s: fl(e),
    l: void 0,
    c: void 0,
    m: Dt(e.message),
    p: r,
    e: void 0,
    a: void 0,
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function Tw(t, e, r) {
  return {
    t: 7,
    i: t,
    s: void 0,
    l: e,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: r,
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function Ap(t, e) {
  return {
    t: 28,
    i: void 0,
    s: void 0,
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: [t, e],
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function Cp(t, e) {
  return {
    t: 30,
    i: void 0,
    s: void 0,
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: [t, e],
    f: void 0,
    b: void 0,
    o: void 0,
  };
}
function Rp(t, e, r) {
  return {
    t: 31,
    i: t,
    s: void 0,
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: r,
    f: e,
    b: void 0,
    o: void 0,
  };
}
function Aw(t, e) {
  return {
    t: 32,
    i: t,
    s: void 0,
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: e,
    b: void 0,
    o: void 0,
  };
}
function Cw(t, e) {
  return {
    t: 33,
    i: t,
    s: void 0,
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: e,
    b: void 0,
    o: void 0,
  };
}
function Rw(t, e) {
  return {
    t: 34,
    i: t,
    s: void 0,
    l: void 0,
    c: void 0,
    m: void 0,
    p: void 0,
    e: void 0,
    a: void 0,
    f: e,
    b: void 0,
    o: void 0,
  };
}
function Nw(t, e) {
  return e instanceof Error
    ? `Seroval caught an error during the ${t} process.
  
${e.name}
${e.message}

- For more information, please check the "cause" property of this error.
- If you believe this is an error in Seroval, please submit an issue at https://github.com/lxsmnsyc/seroval/issues/new`
    : `Seroval caught an error during the ${t} process.

"${pl.call(e)}"

For more information, please check the "cause" property of this error.`;
}
function $w(t) {
  return "__SEROVAL_STREAM__" in t;
}
function js() {
  let t = new Set(),
    e = [],
    r = !0,
    n = !1;
  function s(a) {
    for (let u of t.keys()) u.next(a);
  }
  function i(a) {
    for (let u of t.keys()) u.throw(a);
  }
  function o(a) {
    for (let u of t.keys()) u.return(a);
  }
  return {
    __SEROVAL_STREAM__: !0,
    on(a) {
      r && t.add(a);
      for (let u = 0, c = e.length; u < c; u++) {
        let l = e[u];
        u === c - 1 ? (n ? a.return(l) : a.throw(l)) : a.next(l);
      }
      return () => {
        r && t.delete(a);
      };
    },
    next(a) {
      r && (e.push(a), s(a));
    },
    throw(a) {
      r && (e.push(a), i(a), (r = !1), (n = !1), t.clear());
    },
    return(a) {
      r && (e.push(a), o(a), (r = !1), (n = !0), t.clear());
    },
  };
}
function Fw(t) {
  let e = js(),
    r = t[Symbol.asyncIterator]();
  async function n() {
    try {
      let s = await r.next();
      s.done ? e.return(s.value) : (e.next(s.value), await n());
    } catch (s) {
      e.throw(s);
    }
  }
  return n().catch(() => {}), e;
}
function Lp(t) {
  let e = [],
    r = -1,
    n = -1,
    s = t[Symbol.iterator]();
  for (;;)
    try {
      let i = s.next();
      if ((e.push(i.value), i.done)) {
        n = e.length - 1;
        break;
      }
    } catch (i) {
      (r = e.length), e.push(i);
    }
  return {v: e, t: r, d: n};
}
function mp(t) {
  let e = t[0];
  return (
    (e === "$" ||
      e === "_" ||
      (e >= "A" && e <= "Z") ||
      (e >= "a" && e <= "z")) &&
    jw.test(t)
  );
}
function Hs(t) {
  switch (t.t) {
    case 0:
      return t.s + "=" + t.v;
    case 2:
      return t.s + ".set(" + t.k + "," + t.v + ")";
    case 1:
      return t.s + ".add(" + t.v + ")";
    case 3:
      return t.s + ".delete(" + t.k + ")";
  }
}
function zw(t) {
  let e = [],
    r = t[0];
  for (let n = 1, s = t.length, i, o = r; n < s; n++)
    (i = t[n]),
      i.t === 0 && i.v === o.v
        ? (r = {t: 0, s: i.s, k: void 0, v: Hs(r)})
        : i.t === 2 && i.s === o.s
        ? (r = {t: 2, s: Hs(r), k: i.k, v: i.v})
        : i.t === 1 && i.s === o.s
        ? (r = {t: 1, s: Hs(r), k: void 0, v: i.v})
        : i.t === 3 && i.s === o.s
        ? (r = {t: 3, s: Hs(r), k: i.k, v: void 0})
        : (e.push(r), (r = i)),
      (o = i);
  return e.push(r), e;
}
function gp(t) {
  if (t.length) {
    let e = "",
      r = zw(t);
    for (let n = 0, s = r.length; n < s; n++) e += Hs(r[n]) + ",";
    return e;
  }
}
function tS(t, e) {
  let r = vp(e.plugins),
    n = new eS({
      plugins: r,
      refs: e.refs,
      disabledFeatures: e.disabledFeatures,
      onParse(s, i) {
        let o = new Zw({
            plugins: r,
            features: n.features,
            scopeId: e.scopeId,
            markedRefs: n.marked,
          }),
          a;
        try {
          a = o.serializeTop(s);
        } catch (u) {
          e.onError && e.onError(u);
          return;
        }
        e.onSerialize(a, i);
      },
      onError: e.onError,
      onDone: e.onDone,
    });
  return (
    n.start(t),
    () => {
      n.destroy();
    }
  );
}
var _o,
  Fs,
  Do,
  ko,
  yp,
  Oo,
  tw,
  wp,
  rw,
  AN,
  Sp,
  cl,
  ll,
  nw,
  sw,
  iw,
  ow,
  aw,
  uw,
  pl,
  Np,
  Lw,
  Pw,
  Mo,
  Iw,
  kw,
  Ow,
  Dw,
  Mw,
  _w,
  Hw,
  jw,
  qw,
  Uw,
  Bw,
  Vw,
  Kw,
  Ww,
  Gw,
  Yw,
  CN,
  Xw,
  RN,
  Jw,
  Zw,
  Qw,
  eS,
  Pp,
  Ye = b(() => {
    _o = ((t) => (
      (t[(t.AggregateError = 1)] = "AggregateError"),
      (t[(t.ArrowFunction = 2)] = "ArrowFunction"),
      (t[(t.ErrorPrototypeStack = 4)] = "ErrorPrototypeStack"),
      (t[(t.ObjectAssign = 8)] = "ObjectAssign"),
      (t[(t.BigIntTypedArray = 16)] = "BigIntTypedArray"),
      t
    ))(_o || {});
    (Fs = "__SEROVAL_REFS__"), (Do = "$R"), (ko = `self.${Do}`);
    (yp = new Map()), (Oo = new Map());
    typeof globalThis < "u"
      ? Object.defineProperty(globalThis, Fs, {
          value: Oo,
          configurable: !0,
          writable: !1,
          enumerable: !1,
        })
      : typeof window < "u"
      ? Object.defineProperty(window, Fs, {
          value: Oo,
          configurable: !0,
          writable: !1,
          enumerable: !1,
        })
      : typeof self < "u"
      ? Object.defineProperty(self, Fs, {
          value: Oo,
          configurable: !0,
          writable: !1,
          enumerable: !1,
        })
      : typeof global < "u" &&
        Object.defineProperty(global, Fs, {
          value: Oo,
          configurable: !0,
          writable: !1,
          enumerable: !1,
        });
    (tw = {
      0: "Symbol.asyncIterator",
      1: "Symbol.hasInstance",
      2: "Symbol.isConcatSpreadable",
      3: "Symbol.iterator",
      4: "Symbol.match",
      5: "Symbol.matchAll",
      6: "Symbol.replace",
      7: "Symbol.search",
      8: "Symbol.species",
      9: "Symbol.split",
      10: "Symbol.toPrimitive",
      11: "Symbol.toStringTag",
      12: "Symbol.unscopables",
    }),
      (wp = {
        [Symbol.asyncIterator]: 0,
        [Symbol.hasInstance]: 1,
        [Symbol.isConcatSpreadable]: 2,
        [Symbol.iterator]: 3,
        [Symbol.match]: 4,
        [Symbol.matchAll]: 5,
        [Symbol.replace]: 6,
        [Symbol.search]: 7,
        [Symbol.species]: 8,
        [Symbol.split]: 9,
        [Symbol.toPrimitive]: 10,
        [Symbol.toStringTag]: 11,
        [Symbol.unscopables]: 12,
      }),
      (rw = {
        2: "!0",
        3: "!1",
        1: "void 0",
        0: "null",
        4: "-0",
        5: "1/0",
        6: "-1/0",
        7: "0/0",
      }),
      (AN = {
        2: !0,
        3: !1,
        1: void 0,
        0: null,
        4: -0,
        5: Number.POSITIVE_INFINITY,
        6: Number.NEGATIVE_INFINITY,
        7: Number.NaN,
      }),
      (Sp = {
        0: "Error",
        1: "EvalError",
        2: "RangeError",
        3: "ReferenceError",
        4: "SyntaxError",
        5: "TypeError",
        6: "URIError",
      });
    (cl = _r(2)),
      (ll = _r(3)),
      (nw = _r(1)),
      (sw = _r(0)),
      (iw = _r(4)),
      (ow = _r(5)),
      (aw = _r(6)),
      (uw = _r(7));
    ({toString: pl} = Object.prototype);
    (Np = class extends Error {
      constructor(t, e) {
        super(Nw(t, e)), (this.cause = e);
      }
    }),
      (Lw = class extends Np {
        constructor(t) {
          super("parsing", t);
        }
      }),
      (Pw = class extends Np {
        constructor(t) {
          super("serialization", t);
        }
      }),
      (Mo = class extends Error {
        constructor(t) {
          super(`The value ${pl.call(
            t
          )} of type "${typeof t}" cannot be parsed/serialized.
      
There are few workarounds for this problem:
- Transform the value in a way that it can be serialized.
- If the reference is present on multiple runtimes (isomorphic), you can use the Reference API to map the references.`),
            (this.value = t);
        }
      }),
      (Iw = class extends Error {
        constructor(t) {
          super('Unsupported node type "' + t.t + '".');
        }
      }),
      (kw = class extends Error {
        constructor(t) {
          super('Missing plugin for tag "' + t + '".');
        }
      }),
      (Ow = class extends Error {
        constructor(t) {
          super(
            'Missing reference for the value "' +
              pl.call(t) +
              '" of type "' +
              typeof t +
              '"'
          ),
            (this.value = t);
        }
      }),
      (Dw = {}),
      (Mw = {}),
      (_w = {0: {}, 1: {}, 2: {}, 3: {}, 4: {}});
    (Hw = class {
      constructor(t) {
        (this.marked = new Set()),
          (this.plugins = t.plugins),
          (this.features = 31 ^ (t.disabledFeatures || 0)),
          (this.refs = t.refs || new Map());
      }
      markRef(t) {
        this.marked.add(t);
      }
      isMarked(t) {
        return this.marked.has(t);
      }
      getIndexedValue(t) {
        let e = this.refs.get(t);
        if (e != null) return this.markRef(e), {type: 1, value: fw(e)};
        let r = this.refs.size;
        return this.refs.set(t, r), {type: 0, value: r};
      }
      getReference(t) {
        let e = this.getIndexedValue(t);
        return e.type === 1 ? e : ul(t) ? {type: 2, value: hp(e.value, t)} : e;
      }
      getStrictReference(t) {
        al(ul(t), new Mo(t));
        let e = this.getIndexedValue(t);
        return e.type === 1 ? e.value : hp(e.value, t);
      }
      parseFunction(t) {
        return this.getStrictReference(t);
      }
      parseWellKnownSymbol(t) {
        let e = this.getReference(t);
        return e.type !== 0
          ? e.value
          : (al(t in wp, new Mo(t)), gw(e.value, t));
      }
      parseSpecialReference(t) {
        let e = this.getIndexedValue(_w[t]);
        return e.type === 1
          ? e.value
          : {
              t: 26,
              i: e.value,
              s: t,
              l: void 0,
              c: void 0,
              m: void 0,
              p: void 0,
              e: void 0,
              a: void 0,
              f: void 0,
              b: void 0,
              o: void 0,
            };
      }
      parseIteratorFactory() {
        let t = this.getIndexedValue(Dw);
        return t.type === 1
          ? t.value
          : {
              t: 27,
              i: t.value,
              s: void 0,
              l: void 0,
              c: void 0,
              m: void 0,
              p: void 0,
              e: void 0,
              a: void 0,
              f: this.parseWellKnownSymbol(Symbol.iterator),
              b: void 0,
              o: void 0,
            };
      }
      parseAsyncIteratorFactory() {
        let t = this.getIndexedValue(Mw);
        return t.type === 1
          ? t.value
          : {
              t: 29,
              i: t.value,
              s: void 0,
              l: void 0,
              c: void 0,
              m: void 0,
              p: void 0,
              e: void 0,
              a: [
                this.parseSpecialReference(1),
                this.parseWellKnownSymbol(Symbol.asyncIterator),
              ],
              f: void 0,
              b: void 0,
              o: void 0,
            };
      }
      createObjectNode(t, e, r, n) {
        return {
          t: r ? 11 : 10,
          i: t,
          s: void 0,
          l: void 0,
          c: void 0,
          m: void 0,
          p: n,
          e: void 0,
          a: void 0,
          f: void 0,
          b: void 0,
          o: Ep(e),
        };
      }
      createMapNode(t, e, r, n) {
        return {
          t: 8,
          i: t,
          s: void 0,
          l: void 0,
          c: void 0,
          m: void 0,
          p: void 0,
          e: {k: e, v: r, s: n},
          a: void 0,
          f: this.parseSpecialReference(0),
          b: void 0,
          o: void 0,
        };
      }
      createPromiseConstructorNode(t) {
        return {
          t: 22,
          i: t,
          s: void 0,
          l: void 0,
          c: void 0,
          m: void 0,
          p: void 0,
          e: void 0,
          a: void 0,
          f: this.parseSpecialReference(1),
          b: void 0,
          o: void 0,
        };
      }
    }),
      (jw = /^[$A-Z_][0-9A-Z_$]*$/i);
    (qw = "Object.create(null)"),
      (Uw = "new Set"),
      (Bw = "new Map"),
      (Vw = "Promise.resolve"),
      (Kw = "Promise.reject"),
      (Ww = {
        3: "Object.freeze",
        2: "Object.seal",
        1: "Object.preventExtensions",
        0: void 0,
      }),
      (Gw = class {
        constructor(t) {
          (this.stack = []),
            (this.flags = []),
            (this.assignments = []),
            (this.plugins = t.plugins),
            (this.features = t.features),
            (this.marked = new Set(t.markedRefs));
        }
        createFunction(t, e) {
          return this.features & 2
            ? (t.length === 1 ? t[0] : "(" + t.join(",") + ")") + "=>" + e
            : "function(" + t.join(",") + "){return " + e + "}";
        }
        createEffectfulFunction(t, e) {
          return this.features & 2
            ? (t.length === 1 ? t[0] : "(" + t.join(",") + ")") +
                "=>{" +
                e +
                "}"
            : "function(" + t.join(",") + "){" + e + "}";
        }
        markRef(t) {
          this.marked.add(t);
        }
        isMarked(t) {
          return this.marked.has(t);
        }
        pushObjectFlag(t, e) {
          t !== 0 &&
            (this.markRef(e),
            this.flags.push({type: t, value: this.getRefParam(e)}));
        }
        resolveFlags() {
          let t = "";
          for (let e = 0, r = this.flags, n = r.length; e < n; e++) {
            let s = r[e];
            t += Ww[s.type] + "(" + s.value + "),";
          }
          return t;
        }
        resolvePatches() {
          let t = gp(this.assignments),
            e = this.resolveFlags();
          return t ? (e ? t + e : t) : e;
        }
        createAssignment(t, e) {
          this.assignments.push({t: 0, s: t, k: void 0, v: e});
        }
        createAddAssignment(t, e) {
          this.assignments.push({
            t: 1,
            s: this.getRefParam(t),
            k: void 0,
            v: e,
          });
        }
        createSetAssignment(t, e, r) {
          this.assignments.push({t: 2, s: this.getRefParam(t), k: e, v: r});
        }
        createDeleteAssignment(t, e) {
          this.assignments.push({
            t: 3,
            s: this.getRefParam(t),
            k: e,
            v: void 0,
          });
        }
        createArrayAssign(t, e, r) {
          this.createAssignment(this.getRefParam(t) + "[" + e + "]", r);
        }
        createObjectAssign(t, e, r) {
          this.createAssignment(this.getRefParam(t) + "." + e, r);
        }
        isIndexedValueInStack(t) {
          return t.t === 4 && this.stack.includes(t.i);
        }
        serializeReference(t) {
          return this.assignIndexedValue(t.i, Fs + '.get("' + t.s + '")');
        }
        serializeArrayItem(t, e, r) {
          return e
            ? this.isIndexedValueInStack(e)
              ? (this.markRef(t),
                this.createArrayAssign(t, r, this.getRefParam(e.i)),
                "")
              : this.serialize(e)
            : "";
        }
        serializeArray(t) {
          let e = t.i;
          if (t.l) {
            this.stack.push(e);
            let r = t.a,
              n = this.serializeArrayItem(e, r[0], 0),
              s = n === "";
            for (let i = 1, o = t.l, a; i < o; i++)
              (a = this.serializeArrayItem(e, r[i], i)),
                (n += "," + a),
                (s = a === "");
            return (
              this.stack.pop(),
              this.pushObjectFlag(t.o, t.i),
              this.assignIndexedValue(e, "[" + n + (s ? ",]" : "]"))
            );
          }
          return this.assignIndexedValue(e, "[]");
        }
        serializeProperty(t, e, r) {
          if (typeof e == "string") {
            let n = Number(e),
              s = (n >= 0 && n.toString() === e) || mp(e);
            if (this.isIndexedValueInStack(r)) {
              let i = this.getRefParam(r.i);
              return (
                this.markRef(t.i),
                s && n !== n
                  ? this.createObjectAssign(t.i, e, i)
                  : this.createArrayAssign(t.i, s ? e : '"' + e + '"', i),
                ""
              );
            }
            return (s ? e : '"' + e + '"') + ":" + this.serialize(r);
          }
          return "[" + this.serialize(e) + "]:" + this.serialize(r);
        }
        serializeProperties(t, e) {
          let r = e.s;
          if (r) {
            let n = e.k,
              s = e.v;
            this.stack.push(t.i);
            let i = this.serializeProperty(t, n[0], s[0]);
            for (let o = 1, a = i; o < r; o++)
              (a = this.serializeProperty(t, n[o], s[o])),
                (i += (a && i && ",") + a);
            return this.stack.pop(), "{" + i + "}";
          }
          return "{}";
        }
        serializeObject(t) {
          return (
            this.pushObjectFlag(t.o, t.i),
            this.assignIndexedValue(t.i, this.serializeProperties(t, t.p))
          );
        }
        serializeWithObjectAssign(t, e, r) {
          let n = this.serializeProperties(t, e);
          return n !== "{}" ? "Object.assign(" + r + "," + n + ")" : r;
        }
        serializeStringKeyAssignment(t, e, r, n) {
          let s = this.serialize(n),
            i = Number(r),
            o = (i >= 0 && i.toString() === r) || mp(r);
          if (this.isIndexedValueInStack(n))
            o && i !== i
              ? this.createObjectAssign(t.i, r, s)
              : this.createArrayAssign(t.i, o ? r : '"' + r + '"', s);
          else {
            let a = this.assignments;
            (this.assignments = e),
              o && i !== i
                ? this.createObjectAssign(t.i, r, s)
                : this.createArrayAssign(t.i, o ? r : '"' + r + '"', s),
              (this.assignments = a);
          }
        }
        serializeAssignment(t, e, r, n) {
          if (typeof r == "string")
            this.serializeStringKeyAssignment(t, e, r, n);
          else {
            let s = this.stack;
            this.stack = [];
            let i = this.serialize(n);
            this.stack = s;
            let o = this.assignments;
            (this.assignments = e),
              this.createArrayAssign(t.i, this.serialize(r), i),
              (this.assignments = o);
          }
        }
        serializeAssignments(t, e) {
          let r = e.s;
          if (r) {
            let n = [],
              s = e.k,
              i = e.v;
            this.stack.push(t.i);
            for (let o = 0; o < r; o++)
              this.serializeAssignment(t, n, s[o], i[o]);
            return this.stack.pop(), gp(n);
          }
        }
        serializeDictionary(t, e) {
          if (t.p)
            if (this.features & 8)
              e = this.serializeWithObjectAssign(t, t.p, e);
            else {
              this.markRef(t.i);
              let r = this.serializeAssignments(t, t.p);
              if (r)
                return (
                  "(" +
                  this.assignIndexedValue(t.i, e) +
                  "," +
                  r +
                  this.getRefParam(t.i) +
                  ")"
                );
            }
          return this.assignIndexedValue(t.i, e);
        }
        serializeNullConstructor(t) {
          return this.pushObjectFlag(t.o, t.i), this.serializeDictionary(t, qw);
        }
        serializeDate(t) {
          return this.assignIndexedValue(t.i, 'new Date("' + t.s + '")');
        }
        serializeRegExp(t) {
          return this.assignIndexedValue(t.i, "/" + t.c + "/" + t.m);
        }
        serializeSetItem(t, e) {
          return this.isIndexedValueInStack(e)
            ? (this.markRef(t),
              this.createAddAssignment(t, this.getRefParam(e.i)),
              "")
            : this.serialize(e);
        }
        serializeSet(t) {
          let e = Uw,
            r = t.l,
            n = t.i;
          if (r) {
            let s = t.a;
            this.stack.push(n);
            let i = this.serializeSetItem(n, s[0]);
            for (let o = 1, a = i; o < r; o++)
              (a = this.serializeSetItem(n, s[o])), (i += (a && i && ",") + a);
            this.stack.pop(), i && (e += "([" + i + "])");
          }
          return this.assignIndexedValue(n, e);
        }
        serializeMapEntry(t, e, r, n) {
          if (this.isIndexedValueInStack(e)) {
            let s = this.getRefParam(e.i);
            if ((this.markRef(t), this.isIndexedValueInStack(r))) {
              let o = this.getRefParam(r.i);
              return this.createSetAssignment(t, s, o), "";
            }
            if (r.t !== 4 && r.i != null && this.isMarked(r.i)) {
              let o = "(" + this.serialize(r) + ",[" + n + "," + n + "])";
              return (
                this.createSetAssignment(t, s, this.getRefParam(r.i)),
                this.createDeleteAssignment(t, n),
                o
              );
            }
            let i = this.stack;
            return (
              (this.stack = []),
              this.createSetAssignment(t, s, this.serialize(r)),
              (this.stack = i),
              ""
            );
          }
          if (this.isIndexedValueInStack(r)) {
            let s = this.getRefParam(r.i);
            if (
              (this.markRef(t), e.t !== 4 && e.i != null && this.isMarked(e.i))
            ) {
              let o = "(" + this.serialize(e) + ",[" + n + "," + n + "])";
              return (
                this.createSetAssignment(t, this.getRefParam(e.i), s),
                this.createDeleteAssignment(t, n),
                o
              );
            }
            let i = this.stack;
            return (
              (this.stack = []),
              this.createSetAssignment(t, this.serialize(e), s),
              (this.stack = i),
              ""
            );
          }
          return "[" + this.serialize(e) + "," + this.serialize(r) + "]";
        }
        serializeMap(t) {
          let e = Bw,
            r = t.e.s,
            n = t.i,
            s = t.f,
            i = this.getRefParam(s.i);
          if (r) {
            let o = t.e.k,
              a = t.e.v;
            this.stack.push(n);
            let u = this.serializeMapEntry(n, o[0], a[0], i);
            for (let c = 1, l = u; c < r; c++)
              (l = this.serializeMapEntry(n, o[c], a[c], i)),
                (u += (l && u && ",") + l);
            this.stack.pop(), u && (e += "([" + u + "])");
          }
          return (
            s.t === 26 &&
              (this.markRef(s.i),
              (e = "(" + this.serialize(s) + "," + e + ")")),
            this.assignIndexedValue(n, e)
          );
        }
        serializeArrayBuffer(t) {
          let e = "new Uint8Array(",
            r = t.s,
            n = r.length;
          if (n) {
            e += "[" + r[0];
            for (let s = 1; s < n; s++) e += "," + r[s];
            e += "]";
          }
          return this.assignIndexedValue(t.i, e + ").buffer");
        }
        serializeTypedArray(t) {
          return this.assignIndexedValue(
            t.i,
            "new " +
              t.c +
              "(" +
              this.serialize(t.f) +
              "," +
              t.b +
              "," +
              t.l +
              ")"
          );
        }
        serializeDataView(t) {
          return this.assignIndexedValue(
            t.i,
            "new DataView(" + this.serialize(t.f) + "," + t.b + "," + t.l + ")"
          );
        }
        serializeAggregateError(t) {
          let e = t.i;
          this.stack.push(e);
          let r = this.serializeDictionary(
            t,
            'new AggregateError([],"' + t.m + '")'
          );
          return this.stack.pop(), r;
        }
        serializeError(t) {
          return this.serializeDictionary(
            t,
            "new " + Sp[t.s] + '("' + t.m + '")'
          );
        }
        serializePromise(t) {
          let e,
            r = t.f,
            n = t.i,
            s = t.s ? Vw : Kw;
          if (this.isIndexedValueInStack(r)) {
            let i = this.getRefParam(r.i);
            e =
              s +
              (t.s
                ? "().then(" + this.createFunction([], i) + ")"
                : "().catch(" +
                  this.createEffectfulFunction([], "throw " + i) +
                  ")");
          } else {
            this.stack.push(n);
            let i = this.serialize(r);
            this.stack.pop(), (e = s + "(" + i + ")");
          }
          return this.assignIndexedValue(n, e);
        }
        serializeWellKnownSymbol(t) {
          return this.assignIndexedValue(t.i, tw[t.s]);
        }
        serializeBoxed(t) {
          return this.assignIndexedValue(
            t.i,
            "Object(" + this.serialize(t.f) + ")"
          );
        }
        serializePlugin(t) {
          let e = this.plugins;
          if (e)
            for (let r = 0, n = e.length; r < n; r++) {
              let s = e[r];
              if (s.tag === t.c)
                return this.assignIndexedValue(
                  t.i,
                  s.serialize(t.s, this, {id: t.i})
                );
            }
          throw new kw(t.c);
        }
        getConstructor(t) {
          let e = this.serialize(t);
          return e === this.getRefParam(t.i) ? e : "(" + e + ")";
        }
        serializePromiseConstructor(t) {
          return this.assignIndexedValue(t.i, this.getConstructor(t.f) + "()");
        }
        serializePromiseResolve(t) {
          return (
            this.getConstructor(t.a[0]) +
            "(" +
            this.getRefParam(t.i) +
            "," +
            this.serialize(t.a[1]) +
            ")"
          );
        }
        serializePromiseReject(t) {
          return (
            this.getConstructor(t.a[0]) +
            "(" +
            this.getRefParam(t.i) +
            "," +
            this.serialize(t.a[1]) +
            ")"
          );
        }
        serializeSpecialReferenceValue(t) {
          switch (t) {
            case 0:
              return "[]";
            case 1:
              return this.createFunction(
                ["s", "f", "p"],
                "((p=new Promise(" +
                  this.createEffectfulFunction(["a", "b"], "s=a,f=b") +
                  ")).s=s,p.f=f,p)"
              );
            case 2:
              return this.createEffectfulFunction(
                ["p", "d"],
                'p.s(d),p.status="success",p.value=d;delete p.s;delete p.f'
              );
            case 3:
              return this.createEffectfulFunction(
                ["p", "d"],
                'p.f(d),p.status="failure",p.value=d;delete p.s;delete p.f'
              );
            case 4:
              return this.createFunction(
                ["b", "a", "s", "l", "p", "f", "e", "n"],
                "(b=[],a=!0,s=!1,l=[],p=0,f=" +
                  this.createEffectfulFunction(
                    ["v", "m", "x"],
                    "for(x=0;x<p;x++)l[x]&&l[x][m](v)"
                  ) +
                  ",n=" +
                  this.createEffectfulFunction(
                    ["o", "x", "z", "c"],
                    'for(x=0,z=b.length;x<z;x++)(c=b[x],x===z-1?o[s?"return":"throw"](c):o.next(c))'
                  ) +
                  ",e=" +
                  this.createFunction(
                    ["o", "t"],
                    "(a&&(l[t=p++]=o),n(o)," +
                      this.createEffectfulFunction([], "a&&(l[t]=void 0)") +
                      ")"
                  ) +
                  ",{__SEROVAL_STREAM__:!0,on:" +
                  this.createFunction(["o"], "e(o)") +
                  ",next:" +
                  this.createEffectfulFunction(
                    ["v"],
                    'a&&(b.push(v),f(v,"next"))'
                  ) +
                  ",throw:" +
                  this.createEffectfulFunction(
                    ["v"],
                    'a&&(b.push(v),f(v,"throw"),a=s=!1,l.length=0)'
                  ) +
                  ",return:" +
                  this.createEffectfulFunction(
                    ["v"],
                    'a&&(b.push(v),f(v,"return"),a=!1,s=!0,l.length=0)'
                  ) +
                  "})"
              );
            default:
              return "";
          }
        }
        serializeSpecialReference(t) {
          return this.assignIndexedValue(
            t.i,
            this.serializeSpecialReferenceValue(t.s)
          );
        }
        serializeIteratorFactory(t) {
          let e = "",
            r = !1;
          return (
            t.f.t !== 4 &&
              (this.markRef(t.f.i),
              (e = "(" + this.serialize(t.f) + ","),
              (r = !0)),
            (e += this.assignIndexedValue(
              t.i,
              this.createFunction(
                ["s"],
                this.createFunction(
                  ["i", "c", "d", "t"],
                  "(i=0,t={[" +
                    this.getRefParam(t.f.i) +
                    "]:" +
                    this.createFunction([], "t") +
                    ",next:" +
                    this.createEffectfulFunction(
                      [],
                      "if(i>s.d)return{done:!0,value:void 0};if(d=s.v[c=i++],c===s.t)throw d;return{done:c===s.d,value:d}"
                    ) +
                    "})"
                )
              )
            )),
            r && (e += ")"),
            e
          );
        }
        serializeIteratorFactoryInstance(t) {
          return (
            this.getConstructor(t.a[0]) + "(" + this.serialize(t.a[1]) + ")"
          );
        }
        serializeAsyncIteratorFactory(t) {
          let e = t.a[0],
            r = t.a[1],
            n = "";
          e.t !== 4 && (this.markRef(e.i), (n += "(" + this.serialize(e))),
            r.t !== 4 &&
              (this.markRef(r.i), (n += (n ? "," : "(") + this.serialize(r))),
            n && (n += ",");
          let s = this.assignIndexedValue(
            t.i,
            this.createFunction(
              ["s"],
              this.createFunction(
                ["b", "c", "p", "d", "e", "t", "f"],
                "(b=[],c=0,p=[],d=-1,e=!1,f=" +
                  this.createEffectfulFunction(
                    ["i", "l"],
                    "for(i=0,l=p.length;i<l;i++)p[i].s({done:!0,value:void 0})"
                  ) +
                  ",s.on({next:" +
                  this.createEffectfulFunction(
                    ["v", "t"],
                    "if(t=p.shift())t.s({done:!1,value:v});b.push(v)"
                  ) +
                  ",throw:" +
                  this.createEffectfulFunction(
                    ["v", "t"],
                    "if(t=p.shift())t.f(v);f(),d=b.length,e=!0,b.push(v)"
                  ) +
                  ",return:" +
                  this.createEffectfulFunction(
                    ["v", "t"],
                    "if(t=p.shift())t.s({done:!0,value:v});f(),d=b.length,b.push(v)"
                  ) +
                  "}),t={[" +
                  this.getRefParam(r.i) +
                  "]:" +
                  this.createFunction([], "t") +
                  ",next:" +
                  this.createEffectfulFunction(
                    ["i", "t", "v"],
                    "if(d===-1){return((i=c++)>=b.length)?(p.push(t=" +
                      this.getRefParam(e.i) +
                      "()),t):{done:!0,value:b[i]}}if(c>d)return{done:!0,value:void 0};if(v=b[i=c++],i!==d)return{done:!1,value:v};if(e)throw v;return{done:!0,value:v}"
                  ) +
                  "})"
              )
            )
          );
          return n ? n + s + ")" : s;
        }
        serializeAsyncIteratorFactoryInstance(t) {
          return (
            this.getConstructor(t.a[0]) + "(" + this.serialize(t.a[1]) + ")"
          );
        }
        serializeStreamConstructor(t) {
          let e = this.assignIndexedValue(t.i, this.getConstructor(t.f) + "()"),
            r = t.a.length;
          if (r) {
            let n = this.serialize(t.a[0]);
            for (let s = 1; s < r; s++) n += "," + this.serialize(t.a[s]);
            return "(" + e + "," + n + "," + this.getRefParam(t.i) + ")";
          }
          return e;
        }
        serializeStreamNext(t) {
          return this.getRefParam(t.i) + ".next(" + this.serialize(t.f) + ")";
        }
        serializeStreamThrow(t) {
          return this.getRefParam(t.i) + ".throw(" + this.serialize(t.f) + ")";
        }
        serializeStreamReturn(t) {
          return this.getRefParam(t.i) + ".return(" + this.serialize(t.f) + ")";
        }
        serialize(t) {
          try {
            switch (t.t) {
              case 2:
                return rw[t.s];
              case 0:
                return "" + t.s;
              case 1:
                return '"' + t.s + '"';
              case 3:
                return t.s + "n";
              case 4:
                return this.getRefParam(t.i);
              case 18:
                return this.serializeReference(t);
              case 9:
                return this.serializeArray(t);
              case 10:
                return this.serializeObject(t);
              case 11:
                return this.serializeNullConstructor(t);
              case 5:
                return this.serializeDate(t);
              case 6:
                return this.serializeRegExp(t);
              case 7:
                return this.serializeSet(t);
              case 8:
                return this.serializeMap(t);
              case 19:
                return this.serializeArrayBuffer(t);
              case 16:
              case 15:
                return this.serializeTypedArray(t);
              case 20:
                return this.serializeDataView(t);
              case 14:
                return this.serializeAggregateError(t);
              case 13:
                return this.serializeError(t);
              case 12:
                return this.serializePromise(t);
              case 17:
                return this.serializeWellKnownSymbol(t);
              case 21:
                return this.serializeBoxed(t);
              case 22:
                return this.serializePromiseConstructor(t);
              case 23:
                return this.serializePromiseResolve(t);
              case 24:
                return this.serializePromiseReject(t);
              case 25:
                return this.serializePlugin(t);
              case 26:
                return this.serializeSpecialReference(t);
              case 27:
                return this.serializeIteratorFactory(t);
              case 28:
                return this.serializeIteratorFactoryInstance(t);
              case 29:
                return this.serializeAsyncIteratorFactory(t);
              case 30:
                return this.serializeAsyncIteratorFactoryInstance(t);
              case 31:
                return this.serializeStreamConstructor(t);
              case 32:
                return this.serializeStreamNext(t);
              case 33:
                return this.serializeStreamThrow(t);
              case 34:
                return this.serializeStreamReturn(t);
              default:
                throw new Iw(t);
            }
          } catch (e) {
            throw new Pw(e);
          }
        }
      }),
      (Yw = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_"),
      (CN = Yw.length),
      (Xw = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_"),
      (RN = Xw.length),
      (Jw = class extends Hw {
        parseItems(t) {
          let e = [];
          for (let r = 0, n = t.length; r < n; r++)
            r in t && (e[r] = this.parse(t[r]));
          return e;
        }
        parseArray(t, e) {
          return bw(t, e, this.parseItems(e));
        }
        parseProperties(t) {
          let e = Object.entries(t),
            r = [],
            n = [];
          for (let i = 0, o = e.length; i < o; i++)
            r.push(Dt(e[i][0])), n.push(this.parse(e[i][1]));
          let s = Symbol.iterator;
          return (
            s in t &&
              (r.push(this.parseWellKnownSymbol(s)),
              n.push(Ap(this.parseIteratorFactory(), this.parse(Lp(t))))),
            (s = Symbol.asyncIterator),
            s in t &&
              (r.push(this.parseWellKnownSymbol(s)),
              n.push(Cp(this.parseAsyncIteratorFactory(), this.parse(js())))),
            (s = Symbol.toStringTag),
            s in t && (r.push(this.parseWellKnownSymbol(s)), n.push(dl(t[s]))),
            (s = Symbol.isConcatSpreadable),
            s in t &&
              (r.push(this.parseWellKnownSymbol(s)), n.push(t[s] ? cl : ll)),
            {k: r, v: n, s: r.length}
          );
        }
        parsePlainObject(t, e, r) {
          return this.createObjectNode(t, e, r, this.parseProperties(e));
        }
        parseBoxed(t, e) {
          return yw(t, this.parse(e.valueOf()));
        }
        parseTypedArray(t, e) {
          return xw(t, e, this.parse(e.buffer));
        }
        parseBigIntTypedArray(t, e) {
          return vw(t, e, this.parse(e.buffer));
        }
        parseDataView(t, e) {
          return ww(t, e, this.parse(e.buffer));
        }
        parseError(t, e) {
          let r = pp(e, this.features);
          return Sw(t, e, r ? this.parseProperties(r) : void 0);
        }
        parseAggregateError(t, e) {
          let r = pp(e, this.features);
          return Ew(t, e, r ? this.parseProperties(r) : void 0);
        }
        parseMap(t, e) {
          let r = [],
            n = [];
          for (let [s, i] of e.entries())
            r.push(this.parse(s)), n.push(this.parse(i));
          return this.createMapNode(t, r, n, e.size);
        }
        parseSet(t, e) {
          let r = [];
          for (let n of e.keys()) r.push(this.parse(n));
          return Tw(t, e.size, r);
        }
        parsePlugin(t, e) {
          let r = this.plugins;
          if (r)
            for (let n = 0, s = r.length; n < s; n++) {
              let i = r[n];
              if (i.parse.sync && i.test(e))
                return Tp(t, i.tag, i.parse.sync(e, this, {id: t}));
            }
        }
        parseStream(t, e) {
          return Rp(t, this.parseSpecialReference(4), []);
        }
        parsePromise(t, e) {
          return this.createPromiseConstructorNode(t);
        }
        parseObject(t, e) {
          if (Array.isArray(e)) return this.parseArray(t, e);
          if ($w(e)) return this.parseStream(t, e);
          let r = this.parsePlugin(t, e);
          if (r) return r;
          let n = e.constructor;
          switch (n) {
            case Object:
              return this.parsePlainObject(t, e, !1);
            case void 0:
              return this.parsePlainObject(t, e, !0);
            case Date:
              return pw(t, e);
            case RegExp:
              return hw(t, e);
            case Error:
            case EvalError:
            case RangeError:
            case ReferenceError:
            case SyntaxError:
            case TypeError:
            case URIError:
              return this.parseError(t, e);
            case Number:
            case Boolean:
            case String:
            case BigInt:
              return this.parseBoxed(t, e);
            case ArrayBuffer:
              return mw(t, e);
            case Int8Array:
            case Int16Array:
            case Int32Array:
            case Uint8Array:
            case Uint16Array:
            case Uint32Array:
            case Uint8ClampedArray:
            case Float32Array:
            case Float64Array:
              return this.parseTypedArray(t, e);
            case DataView:
              return this.parseDataView(t, e);
            case Map:
              return this.parseMap(t, e);
            case Set:
              return this.parseSet(t, e);
            default:
              break;
          }
          if (n === Promise || e instanceof Promise)
            return this.parsePromise(t, e);
          let s = this.features;
          if (s & 16)
            switch (n) {
              case BigInt64Array:
              case BigUint64Array:
                return this.parseBigIntTypedArray(t, e);
              default:
                break;
            }
          if (
            s & 1 &&
            typeof AggregateError < "u" &&
            (n === AggregateError || e instanceof AggregateError)
          )
            return this.parseAggregateError(t, e);
          if (e instanceof Error) return this.parseError(t, e);
          if (Symbol.iterator in e || Symbol.asyncIterator in e)
            return this.parsePlainObject(t, e, !!n);
          throw new Mo(e);
        }
        parse(t) {
          try {
            switch (typeof t) {
              case "boolean":
                return t ? cl : ll;
              case "undefined":
                return nw;
              case "string":
                return dl(t);
              case "number":
                return lw(t);
              case "bigint":
                return dw(t);
              case "object": {
                if (t) {
                  let e = this.getReference(t);
                  return e.type === 0 ? this.parseObject(e.value, t) : e.value;
                }
                return sw;
              }
              case "symbol":
                return this.parseWellKnownSymbol(t);
              case "function":
                return this.parseFunction(t);
              default:
                throw new Mo(t);
            }
          } catch (e) {
            throw new Lw(e);
          }
        }
      }),
      (Zw = class extends Gw {
        constructor(t) {
          super(t), (this.mode = "cross"), (this.scopeId = t.scopeId);
        }
        getRefParam(t) {
          return Do + "[" + t + "]";
        }
        assignIndexedValue(t, e) {
          return this.getRefParam(t) + "=" + e;
        }
        serializeTop(t) {
          let e = this.serialize(t),
            r = t.i;
          if (r == null) return e;
          let n = this.resolvePatches(),
            s = this.getRefParam(r),
            i = this.scopeId == null ? "" : Do,
            o = n ? e + "," + n + s : e;
          if (i === "") return n ? "(" + o + ")" : o;
          let a =
            this.scopeId == null
              ? "()"
              : "(" + Do + '["' + Dt(this.scopeId) + '"])';
          return "(" + this.createFunction([i], o) + ")" + a;
        }
      }),
      (Qw = class extends Jw {
        constructor(t) {
          super(t),
            (this.alive = !0),
            (this.pending = 0),
            (this.initial = !0),
            (this.buffer = []),
            (this.onParseCallback = t.onParse),
            (this.onErrorCallback = t.onError),
            (this.onDoneCallback = t.onDone);
        }
        onParseInternal(t, e) {
          try {
            this.onParseCallback(t, e);
          } catch (r) {
            this.onError(r);
          }
        }
        flush() {
          for (let t = 0, e = this.buffer.length; t < e; t++)
            this.onParseInternal(this.buffer[t], !1);
        }
        onParse(t) {
          this.initial ? this.buffer.push(t) : this.onParseInternal(t, !1);
        }
        onError(t) {
          if (this.onErrorCallback) this.onErrorCallback(t);
          else throw t;
        }
        onDone() {
          this.onDoneCallback && this.onDoneCallback();
        }
        pushPendingState() {
          this.pending++;
        }
        popPendingState() {
          --this.pending <= 0 && this.onDone();
        }
        parseProperties(t) {
          let e = Object.entries(t),
            r = [],
            n = [];
          for (let i = 0, o = e.length; i < o; i++)
            r.push(Dt(e[i][0])), n.push(this.parse(e[i][1]));
          let s = Symbol.iterator;
          return (
            s in t &&
              (r.push(this.parseWellKnownSymbol(s)),
              n.push(Ap(this.parseIteratorFactory(), this.parse(Lp(t))))),
            (s = Symbol.asyncIterator),
            s in t &&
              (r.push(this.parseWellKnownSymbol(s)),
              n.push(Cp(this.parseAsyncIteratorFactory(), this.parse(Fw(t))))),
            (s = Symbol.toStringTag),
            s in t && (r.push(this.parseWellKnownSymbol(s)), n.push(dl(t[s]))),
            (s = Symbol.isConcatSpreadable),
            s in t &&
              (r.push(this.parseWellKnownSymbol(s)), n.push(t[s] ? cl : ll)),
            {k: r, v: n, s: r.length}
          );
        }
        parsePromise(t, e) {
          return (
            e.then(
              (r) => {
                let n = this.parseWithError(r);
                n &&
                  this.onParse({
                    t: 23,
                    i: t,
                    s: void 0,
                    l: void 0,
                    c: void 0,
                    m: void 0,
                    p: void 0,
                    e: void 0,
                    a: [this.parseSpecialReference(2), n],
                    f: void 0,
                    b: void 0,
                    o: void 0,
                  }),
                  this.popPendingState();
              },
              (r) => {
                if (this.alive) {
                  let n = this.parseWithError(r);
                  n &&
                    this.onParse({
                      t: 24,
                      i: t,
                      s: void 0,
                      l: void 0,
                      c: void 0,
                      m: void 0,
                      p: void 0,
                      e: void 0,
                      a: [this.parseSpecialReference(3), n],
                      f: void 0,
                      b: void 0,
                      o: void 0,
                    });
                }
                this.popPendingState();
              }
            ),
            this.pushPendingState(),
            this.createPromiseConstructorNode(t)
          );
        }
        parsePlugin(t, e) {
          let r = this.plugins;
          if (r)
            for (let n = 0, s = r.length; n < s; n++) {
              let i = r[n];
              if (i.parse.stream && i.test(e))
                return Tp(t, i.tag, i.parse.stream(e, this, {id: t}));
            }
        }
        parseStream(t, e) {
          let r = Rp(t, this.parseSpecialReference(4), []);
          return (
            this.pushPendingState(),
            e.on({
              next: (n) => {
                if (this.alive) {
                  let s = this.parseWithError(n);
                  s && this.onParse(Aw(t, s));
                }
              },
              throw: (n) => {
                if (this.alive) {
                  let s = this.parseWithError(n);
                  s && this.onParse(Cw(t, s));
                }
                this.popPendingState();
              },
              return: (n) => {
                if (this.alive) {
                  let s = this.parseWithError(n);
                  s && this.onParse(Rw(t, s));
                }
                this.popPendingState();
              },
            }),
            r
          );
        }
        parseWithError(t) {
          try {
            return this.parse(t);
          } catch (e) {
            this.onError(e);
            return;
          }
        }
        start(t) {
          let e = this.parseWithError(t);
          e &&
            (this.onParseInternal(e, !0),
            (this.initial = !1),
            this.flush(),
            this.pending <= 0 && this.destroy());
        }
        destroy() {
          this.alive && (this.onDone(), (this.alive = !1));
        }
        isAlive() {
          return this.alive;
        }
      }),
      (eS = class extends Qw {
        constructor() {
          super(...arguments), (this.mode = "cross");
        }
      });
    Pp = class {
      constructor(t) {
        (this.options = t),
          (this.alive = !0),
          (this.flushed = !1),
          (this.done = !1),
          (this.pending = 0),
          (this.cleanups = []),
          (this.refs = new Map()),
          (this.keys = new Set()),
          (this.ids = 0),
          (this.plugins = vp(t.plugins));
      }
      write(t, e) {
        this.alive &&
          !this.flushed &&
          (this.pending++,
          this.keys.add(t),
          this.cleanups.push(
            tS(e, {
              plugins: this.plugins,
              scopeId: this.options.scopeId,
              refs: this.refs,
              disabledFeatures: this.options.disabledFeatures,
              onError: this.options.onError,
              onSerialize: (r, n) => {
                this.alive &&
                  this.options.onData(
                    n
                      ? this.options.globalIdentifier + '["' + Dt(t) + '"]=' + r
                      : r
                  );
              },
              onDone: () => {
                this.alive &&
                  (this.pending--,
                  this.pending <= 0 &&
                    this.flushed &&
                    !this.done &&
                    this.options.onDone &&
                    (this.options.onDone(), (this.done = !0)));
              },
            })
          ));
      }
      getNextID() {
        for (; this.keys.has("" + this.ids); ) this.ids++;
        return "" + this.ids;
      }
      push(t) {
        let e = this.getNextID();
        return this.write(e, t), e;
      }
      flush() {
        this.alive &&
          ((this.flushed = !0),
          this.pending <= 0 &&
            !this.done &&
            this.options.onDone &&
            (this.options.onDone(), (this.done = !0)));
      }
      close() {
        if (this.alive) {
          for (let t = 0, e = this.cleanups.length; t < e; t++)
            this.cleanups[t]();
          !this.done &&
            this.options.onDone &&
            (this.options.onDone(), (this.done = !0)),
            (this.alive = !1);
        }
      }
    };
  });
function hl(t) {
  return {
    detail: t.detail,
    bubbles: t.bubbles,
    cancelable: t.cancelable,
    composed: t.composed,
  };
}
function ml(t) {
  return {bubbles: t.bubbles, cancelable: t.cancelable, composed: t.composed};
}
function gl(t) {
  let e = [];
  return (
    t.forEach((r, n) => {
      e.push([n, r]);
    }),
    e
  );
}
function bl(t) {
  let e = [];
  return (
    t.forEach((r, n) => {
      e.push([n, r]);
    }),
    e
  );
}
function Ip(t) {
  let e = js(),
    r = t.getReader();
  async function n() {
    try {
      let s = await r.read();
      s.done ? e.return(s.value) : (e.next(s.value), await n());
    } catch (s) {
      e.throw(s);
    }
  }
  return n().catch(() => {}), e;
}
function kp(t, e) {
  return {
    body: e,
    cache: t.cache,
    credentials: t.credentials,
    headers: t.headers,
    integrity: t.integrity,
    keepalive: t.keepalive,
    method: t.method,
    mode: t.mode,
    redirect: t.redirect,
    referrer: t.referrer,
    referrerPolicy: t.referrerPolicy,
  };
}
function Op(t) {
  return {headers: t.headers, status: t.status, statusText: t.statusText};
}
var BN,
  rS,
  Dp,
  nS,
  Mp,
  sS,
  _p,
  iS,
  oS,
  zs,
  aS,
  uS,
  $p,
  cS,
  $o,
  ZN,
  qs,
  lS,
  dS,
  Fo,
  fS,
  Fp,
  pS,
  Hp,
  hS,
  jp,
  mS,
  zp,
  qp = b(() => {
    Ye();
    Ye();
    Ye();
    Ye();
    Ye();
    Ye();
    Ye();
    Ye();
    Ye();
    Ye();
    Ye();
    Ye();
    Ye();
    BN = {
      tag: "seroval-plugins/web/Blob",
      test(t) {
        return typeof Blob > "u" ? !1 : t instanceof Blob;
      },
      parse: {
        async async(t, e) {
          return {
            type: await e.parse(t.type),
            buffer: await e.parse(await t.arrayBuffer()),
          };
        },
      },
      serialize(t, e) {
        return (
          "new Blob([" +
          e.serialize(t.buffer) +
          "],{type:" +
          e.serialize(t.type) +
          "})"
        );
      },
      deserialize(t, e) {
        return new Blob([e.deserialize(t.buffer)], {
          type: e.deserialize(t.type),
        });
      },
    };
    (rS = {
      tag: "seroval-plugins/web/CustomEvent",
      test(t) {
        return typeof CustomEvent > "u" ? !1 : t instanceof CustomEvent;
      },
      parse: {
        sync(t, e) {
          return {type: e.parse(t.type), options: e.parse(hl(t))};
        },
        async async(t, e) {
          return {type: await e.parse(t.type), options: await e.parse(hl(t))};
        },
        stream(t, e) {
          return {type: e.parse(t.type), options: e.parse(hl(t))};
        },
      },
      serialize(t, e) {
        return (
          "new CustomEvent(" +
          e.serialize(t.type) +
          "," +
          e.serialize(t.options) +
          ")"
        );
      },
      deserialize(t, e) {
        return new CustomEvent(e.deserialize(t.type), e.deserialize(t.options));
      },
    }),
      (Dp = rS),
      (nS = {
        tag: "seroval-plugins/web/DOMException",
        test(t) {
          return typeof DOMException > "u" ? !1 : t instanceof DOMException;
        },
        parse: {
          sync(t, e) {
            return {name: e.parse(t.name), message: e.parse(t.message)};
          },
          async async(t, e) {
            return {
              name: await e.parse(t.name),
              message: await e.parse(t.message),
            };
          },
          stream(t, e) {
            return {name: e.parse(t.name), message: e.parse(t.message)};
          },
        },
        serialize(t, e) {
          return (
            "new DOMException(" +
            e.serialize(t.message) +
            "," +
            e.serialize(t.name) +
            ")"
          );
        },
        deserialize(t, e) {
          return new DOMException(
            e.deserialize(t.message),
            e.deserialize(t.name)
          );
        },
      }),
      (Mp = nS);
    (sS = {
      tag: "seroval-plugins/web/Event",
      test(t) {
        return typeof Event > "u" ? !1 : t instanceof Event;
      },
      parse: {
        sync(t, e) {
          return {type: e.parse(t.type), options: e.parse(ml(t))};
        },
        async async(t, e) {
          return {type: await e.parse(t.type), options: await e.parse(ml(t))};
        },
        stream(t, e) {
          return {type: e.parse(t.type), options: e.parse(ml(t))};
        },
      },
      serialize(t, e) {
        return (
          "new Event(" +
          e.serialize(t.type) +
          "," +
          e.serialize(t.options) +
          ")"
        );
      },
      deserialize(t, e) {
        return new Event(e.deserialize(t.type), e.deserialize(t.options));
      },
    }),
      (_p = sS),
      (iS = {
        tag: "seroval-plugins/web/File",
        test(t) {
          return typeof File > "u" ? !1 : t instanceof File;
        },
        parse: {
          async async(t, e) {
            return {
              name: await e.parse(t.name),
              options: await e.parse({
                type: t.type,
                lastModified: t.lastModified,
              }),
              buffer: await e.parse(await t.arrayBuffer()),
            };
          },
        },
        serialize(t, e) {
          return (
            "new File([" +
            e.serialize(t.buffer) +
            "]," +
            e.serialize(t.name) +
            "," +
            e.serialize(t.options) +
            ")"
          );
        },
        deserialize(t, e) {
          return new File(
            [e.deserialize(t.buffer)],
            e.deserialize(t.name),
            e.deserialize(t.options)
          );
        },
      }),
      (oS = iS);
    (zs = {}),
      (aS = {
        tag: "seroval-plugins/web/FormDataFactory",
        test(t) {
          return t === zs;
        },
        parse: {
          sync() {},
          async async() {
            return await Promise.resolve(void 0);
          },
          stream() {},
        },
        serialize(t, e) {
          return e.createEffectfulFunction(
            ["e", "f", "i", "s", "t"],
            "f=new FormData;for(i=0,s=e.length;i<s;i++)f.append((t=e[i])[0],t[1]);return f"
          );
        },
        deserialize() {
          return zs;
        },
      }),
      (uS = {
        tag: "seroval-plugins/web/FormData",
        extends: [oS, aS],
        test(t) {
          return typeof FormData > "u" ? !1 : t instanceof FormData;
        },
        parse: {
          sync(t, e) {
            return {factory: e.parse(zs), entries: e.parse(gl(t))};
          },
          async async(t, e) {
            return {factory: await e.parse(zs), entries: await e.parse(gl(t))};
          },
          stream(t, e) {
            return {factory: e.parse(zs), entries: e.parse(gl(t))};
          },
        },
        serialize(t, e) {
          return (
            "(" + e.serialize(t.factory) + ")(" + e.serialize(t.entries) + ")"
          );
        },
        deserialize(t, e) {
          let r = new FormData(),
            n = e.deserialize(t.entries);
          for (let s = 0, i = n.length; s < i; s++) {
            let o = n[s];
            r.append(o[0], o[1]);
          }
          return r;
        },
      }),
      ($p = uS);
    (cS = {
      tag: "seroval-plugins/web/Headers",
      test(t) {
        return typeof Headers > "u" ? !1 : t instanceof Headers;
      },
      parse: {
        sync(t, e) {
          return e.parse(bl(t));
        },
        async async(t, e) {
          return await e.parse(bl(t));
        },
        stream(t, e) {
          return e.parse(bl(t));
        },
      },
      serialize(t, e) {
        return "new Headers(" + e.serialize(t) + ")";
      },
      deserialize(t, e) {
        return new Headers(e.deserialize(t));
      },
    }),
      ($o = cS),
      (ZN = {
        tag: "seroval-plugins/web/ImageData",
        test(t) {
          return typeof ImageData > "u" ? !1 : t instanceof ImageData;
        },
        parse: {
          sync(t, e) {
            return {
              data: e.parse(t.data),
              width: e.parse(t.width),
              height: e.parse(t.height),
              options: e.parse({colorSpace: t.colorSpace}),
            };
          },
          async async(t, e) {
            return {
              data: await e.parse(t.data),
              width: await e.parse(t.width),
              height: await e.parse(t.height),
              options: await e.parse({colorSpace: t.colorSpace}),
            };
          },
          stream(t, e) {
            return {
              data: e.parse(t.data),
              width: e.parse(t.width),
              height: e.parse(t.height),
              options: e.parse({colorSpace: t.colorSpace}),
            };
          },
        },
        serialize(t, e) {
          return (
            "new ImageData(" +
            e.serialize(t.data) +
            "," +
            e.serialize(t.width) +
            "," +
            e.serialize(t.height) +
            "," +
            e.serialize(t.options) +
            ")"
          );
        },
        deserialize(t, e) {
          return new ImageData(
            e.deserialize(t.data),
            e.deserialize(t.width),
            e.deserialize(t.height),
            e.deserialize(t.options)
          );
        },
      }),
      (qs = {}),
      (lS = {
        tag: "seroval-plugins/web/ReadableStreamFactory",
        test(t) {
          return t === qs;
        },
        parse: {
          sync() {},
          async async() {
            return await Promise.resolve(void 0);
          },
          stream() {},
        },
        serialize(t, e) {
          return e.createFunction(
            ["d"],
            "new ReadableStream({start:" +
              e.createEffectfulFunction(
                ["c"],
                "d.on({next:" +
                  e.createEffectfulFunction(["v"], "c.enqueue(v)") +
                  ",throw:" +
                  e.createEffectfulFunction(["v"], "c.error(v)") +
                  ",return:" +
                  e.createEffectfulFunction([], "c.close()") +
                  "})"
              ) +
              "})"
          );
        },
        deserialize() {
          return qs;
        },
      });
    (dS = {
      tag: "seroval/plugins/web/ReadableStream",
      extends: [lS],
      test(t) {
        return typeof ReadableStream > "u" ? !1 : t instanceof ReadableStream;
      },
      parse: {
        sync(t, e) {
          return {factory: e.parse(qs), stream: e.parse(js())};
        },
        async async(t, e) {
          return {factory: await e.parse(qs), stream: await e.parse(Ip(t))};
        },
        stream(t, e) {
          return {factory: e.parse(qs), stream: e.parse(Ip(t))};
        },
      },
      serialize(t, e) {
        return (
          "(" + e.serialize(t.factory) + ")(" + e.serialize(t.stream) + ")"
        );
      },
      deserialize(t, e) {
        let r = e.deserialize(t.stream);
        return new ReadableStream({
          start(n) {
            r.on({
              next(s) {
                n.enqueue(s);
              },
              throw(s) {
                n.error(s);
              },
              return() {
                n.close();
              },
            });
          },
        });
      },
    }),
      (Fo = dS);
    (fS = {
      tag: "seroval-plugins/web/Request",
      extends: [Fo, $o],
      test(t) {
        return typeof Request > "u" ? !1 : t instanceof Request;
      },
      parse: {
        async async(t, e) {
          return {
            url: await e.parse(t.url),
            options: await e.parse(
              kp(t, t.body ? await t.clone().arrayBuffer() : null)
            ),
          };
        },
        stream(t, e) {
          return {url: e.parse(t.url), options: e.parse(kp(t, t.clone().body))};
        },
      },
      serialize(t, e) {
        return (
          "new Request(" +
          e.serialize(t.url) +
          "," +
          e.serialize(t.options) +
          ")"
        );
      },
      deserialize(t, e) {
        return new Request(e.deserialize(t.url), e.deserialize(t.options));
      },
    }),
      (Fp = fS);
    (pS = {
      tag: "seroval-plugins/web/Response",
      extends: [Fo, $o],
      test(t) {
        return typeof Response > "u" ? !1 : t instanceof Response;
      },
      parse: {
        async async(t, e) {
          return {
            body: await e.parse(t.body ? await t.clone().arrayBuffer() : null),
            options: await e.parse(Op(t)),
          };
        },
        stream(t, e) {
          return {body: e.parse(t.clone().body), options: e.parse(Op(t))};
        },
      },
      serialize(t, e) {
        return (
          "new Response(" +
          e.serialize(t.body) +
          "," +
          e.serialize(t.options) +
          ")"
        );
      },
      deserialize(t, e) {
        return new Response(e.deserialize(t.body), e.deserialize(t.options));
      },
    }),
      (Hp = pS),
      (hS = {
        tag: "seroval-plugins/web/URLSearchParams",
        test(t) {
          return typeof URLSearchParams > "u"
            ? !1
            : t instanceof URLSearchParams;
        },
        parse: {
          sync(t, e) {
            return e.parse(t.toString());
          },
          async async(t, e) {
            return await e.parse(t.toString());
          },
          stream(t, e) {
            return e.parse(t.toString());
          },
        },
        serialize(t, e) {
          return "new URLSearchParams(" + e.serialize(t) + ")";
        },
        deserialize(t, e) {
          return new URLSearchParams(e.deserialize(t));
        },
      }),
      (jp = hS),
      (mS = {
        tag: "seroval-plugins/web/URL",
        test(t) {
          return typeof URL > "u" ? !1 : t instanceof URL;
        },
        parse: {
          sync(t, e) {
            return e.parse(t.href);
          },
          async async(t, e) {
            return await e.parse(t.href);
          },
          stream(t, e) {
            return e.parse(t.href);
          },
        },
        serialize(t, e) {
          return "new URL(" + e.serialize(t) + ")";
        },
        deserialize(t, e) {
          return new URL(e.deserialize(t));
        },
      }),
      (zp = mS);
  });
function Up({onData: t, onDone: e, scopeId: r, onError: n}) {
  return new Pp({
    scopeId: r,
    plugins: [Dp, Mp, _p, $p, $o, Fo, Fp, Hp, jp, zp],
    globalIdentifier: wS,
    disabledFeatures: vS,
    onData: t,
    onDone: e,
    onError: n,
  });
}
function Bp(t) {
  return bp(t) + ";";
}
function Vp(t, e = {}) {
  let {renderId: r} = e,
    n = "",
    s = Up({
      scopeId: r,
      onData(o) {
        n || (n = Bp(r)), (n += o);
      },
      onError: e.onError,
    });
  pe.context = {
    id: r || "",
    count: 0,
    suspense: {},
    lazy: {},
    assets: [],
    nonce: e.nonce,
    serialize(o, a) {
      !pe.context.noHydrate && s.write(o, a);
    },
    roots: 0,
    nextRoot() {
      return this.renderId + "i-" + this.roots++;
    },
  };
  let i = qn((o) => (setTimeout(o), an(R(t()))));
  return (
    (pe.context.noHydrate = !0),
    s.close(),
    (i = Yp(pe.context.assets, i)),
    n.length && (i = Xp(i, n, e.nonce)),
    i
  );
}
function Kp(t, e = {}) {
  let {timeoutMs: r = 3e4} = e,
    n,
    s = new Promise((i, o) => {
      n = setTimeout(() => o("renderToString timed out"), r);
    });
  return Promise.race([TS(t, e), s]).then((i) => (clearTimeout(n), i));
}
function TS(t, e = {}) {
  let {
      nonce: r,
      onCompleteShell: n,
      onCompleteAll: s,
      renderId: i,
      noScripts: o,
    } = e,
    a,
    u = [],
    c = (F) => {
      o ||
        (!y && !A && (y = Bp(i)),
        (y += F + ";"),
        !w && A && (w = setTimeout(p)));
    },
    l = () => {
      p(),
        te(),
        s &&
          s({
            write(F) {
              !T && k.write(F);
            },
          }),
        g && g.end(),
        (T = !0),
        A && a();
    },
    d = Up({scopeId: e.renderId, onData: c, onDone: l, onError: e.onError}),
    f = () => {
      h.size || on(() => on(() => d.flush()));
    },
    h = new Map(),
    p = () => {
      y.length &&
        !T &&
        A &&
        (k.write(`<script${r ? ` nonce="${r}"` : ""}>${y}<\/script>`),
        (y = "")),
        w && clearTimeout(w),
        (w = null);
    },
    m,
    g,
    x = "",
    y = "",
    A = !1,
    T = !1,
    O = !1,
    C = !1,
    w = null,
    k = {
      write(F) {
        x += F;
      },
    };
  pe.context = m = {
    id: i || "",
    count: 0,
    async: !0,
    resources: {},
    lazy: {},
    suspense: {},
    assets: [],
    nonce: r,
    block(F) {
      A || u.push(F);
    },
    replace(F, K) {
      if (A) return;
      let le = `<!--!$${F}-->`,
        G = D.indexOf(le);
      if (G === -1) return;
      let ne = D.indexOf(`<!--!$/${F}-->`, G + le.length);
      D = D.replace(D.slice(G, ne + le.length + 1), an(K()));
    },
    serialize(F, K, le) {
      let G = pe.context.noHydrate;
      !A && le && typeof K == "object" && "then" in K
        ? (u.push(K),
          !G &&
            K.then((ne) => {
              d.write(F, ne);
            }).catch((ne) => {
              d.write(F, ne);
            }))
        : G || d.write(F, K);
    },
    roots: 0,
    nextRoot() {
      return this.renderId + "i-" + this.roots++;
    },
    registerFragment(F) {
      if (!h.has(F)) {
        let K,
          le,
          G = new Promise((ne, Le) => ((K = ne), (le = Le)));
        h.set(F, (ne) =>
          on(() =>
            on(() => {
              ne ? le(ne) : K(!0), on(f);
            })
          )
        ),
          d.write(F, G);
      }
      return (K, le) => {
        if (h.has(F)) {
          let G = h.get(F);
          if ((h.delete(F), NS(h, F))) {
            G();
            return;
          }
          T ||
            (A
              ? (k.write(
                  `<template id="${F}">${K !== void 0 ? K : " "}</template>`
                ),
                c(`$df("${F}")${C ? "" : ";" + ES}`),
                G(le),
                (C = !0))
              : (on(() => (D = LS(D, F, K !== void 0 ? K : ""))), G(le)));
        }
        return A;
      };
    },
  };
  let D = qn((F) => ((a = F), an(R(t()))));
  function te() {
    O ||
      ((pe.context = m),
      (m.noHydrate = !0),
      (D = Yp(m.assets, D)),
      y.length && (D = Xp(D, y, r)),
      k.write(D),
      (y = ""),
      n &&
        n({
          write(F) {
            !T && k.write(F);
          },
        }),
      (O = !0));
  }
  return {
    then(F) {
      function K() {
        a(), F(x);
      }
      if (s) {
        let le = s;
        s = (G) => {
          le(G), K();
        };
      } else s = K;
      on(f);
    },
    pipe(F) {
      yl(u).then(() => {
        setTimeout(() => {
          te(), (k = g = F), k.write(x), (A = !0), T ? (a(), g.end()) : f();
        });
      });
    },
    pipeTo(F) {
      return yl(u).then(() => {
        let K,
          le = new Promise((G) => (K = G));
        return (
          setTimeout(() => {
            te();
            let G = new TextEncoder(),
              ne = F.getWriter();
            (g = {
              end() {
                ne.releaseLock(), F.close(), K();
              },
            }),
              (k = {
                write(Le) {
                  ne.write(G.encode(Le));
                },
              }),
              k.write(x),
              (A = !0),
              T ? (a(), g.end()) : f();
          }),
          le
        );
      });
    },
  };
}
function H(t, ...e) {
  if (e.length) {
    let r = "";
    for (let n = 0; n < e.length; n++) {
      r += t[n];
      let s = e[n];
      s !== void 0 && (r += an(s));
    }
    t = r + t[e.length];
  }
  return {t};
}
function AS(t) {
  if (!t) return "";
  let e = Object.keys(t),
    r = "";
  for (let n = 0, s = e.length; n < s; n++) {
    let i = e[n],
      o = !!t[i];
    !i || i === "undefined" || !o || (n && (r += " "), (r += R(i)));
  }
  return r;
}
function CS(t) {
  if (!t) return "";
  if (typeof t == "string") return R(t, !0);
  let e = "",
    r = Object.keys(t);
  for (let n = 0; n < r.length; n++) {
    let s = r[n],
      i = t[s];
    i != null && (n && (e += ";"), (e += `${s}:${R(i, !0)}`));
  }
  return e;
}
function Zt(t, e, r, n) {
  e == null ? (e = {}) : typeof e == "function" && (e = e());
  let s = SS.test(t),
    i = Object.keys(e),
    o = `<${t}${n ? B() : ""} `,
    a;
  for (let u = 0; u < i.length; u++) {
    let c = i[u];
    if (yS.has(c)) {
      r === void 0 && !s && (r = c === "innerHTML" ? e[c] : R(e[c]));
      continue;
    }
    let l = e[c];
    if (c === "style") o += `style="${CS(l)}"`;
    else if (c === "class" || c === "className" || c === "classList") {
      if (a) continue;
      let d;
      (o += `class="${
        R(
          ((d = e.class) ? d + " " : "") + ((d = e.className) ? d + " " : ""),
          !0
        ) + AS(e.classList)
      }"`),
        (a = !0);
    } else if (bS.has(c))
      if (l) o += c;
      else continue;
    else {
      if (l == null || c === "ref" || c.slice(0, 2) === "on") continue;
      o += `${xS[c] || c}="${R(l, !0)}"`;
    }
    u !== i.length - 1 && (o += " ");
  }
  return s
    ? {t: o + "/>"}
    : (typeof r == "function" && (r = r()), {t: o + `>${an(r, !0)}</${t}>`});
}
function je(t, e, r) {
  return r ? (e ? " " + t : "") : e != null ? ` ${t}="${e}"` : "";
}
function B() {
  let t = RS();
  return t ? ` data-hk="${t}"` : "";
}
function R(t, e) {
  let r = typeof t;
  if (r !== "string") {
    if (!e && r === "function") return R(t());
    if (!e && Array.isArray(t)) {
      for (let c = 0; c < t.length; c++) t[c] = R(t[c]);
      return t;
    }
    return e && r === "boolean" ? String(t) : t;
  }
  let n = e ? '"' : "<",
    s = e ? "&quot;" : "&lt;",
    i = t.indexOf(n),
    o = t.indexOf("&");
  if (i < 0 && o < 0) return t;
  let a = 0,
    u = "";
  for (; i >= 0 && o >= 0; )
    i < o
      ? (a < i && (u += t.substring(a, i)),
        (u += s),
        (a = i + 1),
        (i = t.indexOf(n, a)))
      : (a < o && (u += t.substring(a, o)),
        (u += "&amp;"),
        (a = o + 1),
        (o = t.indexOf("&", a)));
  if (i >= 0)
    do
      a < i && (u += t.substring(a, i)),
        (u += s),
        (a = i + 1),
        (i = t.indexOf(n, a));
    while (i >= 0);
  else
    for (; o >= 0; )
      a < o && (u += t.substring(a, o)),
        (u += "&amp;"),
        (a = o + 1),
        (o = t.indexOf("&", a));
  return a < t.length ? u + t.substring(a) : u;
}
function an(t, e) {
  let r = typeof t;
  if (r === "string") return t;
  if (t == null || r === "boolean") return "";
  if (Array.isArray(t)) {
    let n = {},
      s = "";
    for (let i = 0, o = t.length; i < o; i++)
      !e &&
        typeof n != "object" &&
        typeof t[i] != "object" &&
        (s += "<!--!$-->"),
        (s += an((n = t[i])));
    return s;
  }
  return r === "object" ? t.t : r === "function" ? an(t()) : String(t);
}
function RS() {
  let t = pe.context;
  return t && !t.noHydrate && `${t.id}${t.count++}`;
}
function Wp({eventNames: t = ["click", "input"], nonce: e} = {}) {
  return `<script${
    e ? ` nonce="${e}"` : ""
  }>window._$HY||(e=>{let t=e=>e&&e.hasAttribute&&(e.hasAttribute("data-hk")?e:t(e.host&&e.host.nodeType?e.host:e.parentNode));["${t.join(
    '", "'
  )}"].forEach((o=>document.addEventListener(o,(o=>{let a=o.composedPath&&o.composedPath()[0]||o.target,s=t(a);s&&!e.completed.has(s)&&e.events.push([s,o])}))))})(_$HY={events:[],completed:new WeakSet,r:{},fe(){}});<\/script><!--xs-->`;
}
function Gp(t) {
  return (pe.context.noHydrate = !0), t.children;
}
function on(t) {
  return Promise.resolve().then(t);
}
function yl(t) {
  let e = t.length;
  return Promise.allSettled(t).then(() => {
    if (t.length !== e) return yl(t);
  });
}
function Yp(t, e) {
  if (!t || !t.length) return e;
  let r = "";
  for (let n = 0, s = t.length; n < s; n++) r += t[n]();
  return e.replace("</head>", r + "</head>");
}
function Xp(t, e, r) {
  let n = `<script${r ? ` nonce="${r}"` : ""}>${e}<\/script>`,
    s = t.indexOf("<!--xs-->");
  return s > -1 ? t.slice(0, s) + n + t.slice(s) : t + n;
}
function NS(t, e) {
  for (let r of [...t.keys()].reverse()) if (e.startsWith(r)) return !0;
  return !1;
}
function LS(t, e, r) {
  let n = `<template id="pl-${e}">`,
    s = `<!--pl-${e}-->`,
    i = t.indexOf(n);
  if (i === -1) return t;
  let o = t.indexOf(s, i + n.length);
  return t.slice(0, i) + r + t.slice(o + s.length);
}
function Ho(t) {
  let [e, r] = tt(t, ["component"]),
    n = e.component,
    s = typeof n;
  if (n) {
    if (s === "function") return n(r);
    if (s === "string") return Zt(n, r, void 0, !0);
  }
}
function Jp(t) {
  return "";
}
var gS,
  bS,
  yS,
  xS,
  vS,
  wS,
  SS,
  ES,
  d9,
  ze,
  Vn = b(() => {
    Bn();
    Bn();
    Ye();
    qp();
    (gS = [
      "allowfullscreen",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "controls",
      "default",
      "disabled",
      "formnovalidate",
      "hidden",
      "indeterminate",
      "inert",
      "ismap",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "seamless",
      "selected",
    ]),
      (bS = new Set(gS)),
      (yS = new Set(["innerHTML", "textContent", "innerText", "children"])),
      (xS = Object.assign(Object.create(null), {
        className: "class",
        htmlFor: "for",
      })),
      (vS = _o.AggregateError | _o.BigIntTypedArray),
      (wS = "_$HY.r");
    (SS =
      /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i),
      (ES =
        'function $df(e,n,o,t){if(n=document.getElementById(e),o=document.getElementById("pl-"+e)){for(;o&&8!==o.nodeType&&o.nodeValue!=="pl-"+e;)t=o.nextSibling,o.remove(),o=t;_$HY.done?o.remove():o.replaceWith(n.content)}n.remove(),_$HY.fe(e)}');
    (d9 = Symbol()), (ze = !0);
  });
function PS(t) {
  if (xl.has(t)) return xl.get(t);
  let e = {
    c: 0,
    get id() {
      return "s" + this.c.toString();
    },
  };
  return xl.set(t, e), e;
}
function IS(t) {
  let e = t.id;
  return t.c++, e;
}
async function OS(t, e, r) {
  if (typeof t != "function" || t.name === "QwikComponent") return !1;
  let {html: n} = await Zp.call(this, t, e, r, {renderStrategy: "sync"});
  return typeof n == "string";
}
async function Zp(t, e, {default: r, ...n}, s) {
  let i = PS(this.result),
    o = s?.hydrate ? IS(i) : "",
    a = s?.astroStaticSlot ? !!s.hydrate : !0,
    u = a ? "astro-slot" : "astro-static-slot",
    c = s?.renderStrategy ?? "async",
    l = () => {
      let f = {};
      for (let [p, m] of Object.entries(n)) {
        let g = kS(p);
        f[g] = H(`<${u} name="${g}">${m}</${u}>`);
      }
      let h = {...e, ...f, children: r != null ? H(`<${u}>${r}</${u}>`) : r};
      return c === "sync"
        ? E(t, h)
        : a
        ? E(Io, {
            get children() {
              return E(t, h);
            },
          })
        : E(Gp, {
            get children() {
              return E(Io, {
                get children() {
                  return E(t, h);
                },
              });
            },
          });
    },
    d =
      c === "async"
        ? await Kp(l, {renderId: o, noScripts: !a})
        : Vp(l, {renderId: o});
  return {attrs: {"data-solid-render-id": o}, html: d};
}
var xl,
  kS,
  DS,
  St,
  un = b(() => {
    "use strict";
    Vn();
    xl = new WeakMap();
    kS = (t) => t.trim().replace(/[-_]([a-z])/g, (e, r) => r.toUpperCase());
    (DS = {
      check: OS,
      renderToStaticMarkup: Zp,
      supportsAstroStaticSlot: !0,
      renderHydrationScript: () => Wp(),
    }),
      (St = [
        Object.assign(
          {
            name: "@astrojs/solid-js",
            clientEntrypoint: "@astrojs/solid-js/client.js",
            serverEntrypoint: "@astrojs/solid-js/server.js",
          },
          {ssr: DS}
        ),
      ]);
  });
var wl = de((vl) => {
  "use strict";
  vl.parse = _S;
  vl.serialize = $S;
  var MS = Object.prototype.toString,
    jo = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function _S(t, e) {
    if (typeof t != "string")
      throw new TypeError("argument str must be a string");
    for (var r = {}, n = e || {}, s = n.decode || FS, i = 0; i < t.length; ) {
      var o = t.indexOf("=", i);
      if (o === -1) break;
      var a = t.indexOf(";", i);
      if (a === -1) a = t.length;
      else if (a < o) {
        i = t.lastIndexOf(";", o - 1) + 1;
        continue;
      }
      var u = t.slice(i, o).trim();
      if (r[u] === void 0) {
        var c = t.slice(o + 1, a).trim();
        c.charCodeAt(0) === 34 && (c = c.slice(1, -1)), (r[u] = zS(c, s));
      }
      i = a + 1;
    }
    return r;
  }
  function $S(t, e, r) {
    var n = r || {},
      s = n.encode || HS;
    if (typeof s != "function") throw new TypeError("option encode is invalid");
    if (!jo.test(t)) throw new TypeError("argument name is invalid");
    var i = s(e);
    if (i && !jo.test(i)) throw new TypeError("argument val is invalid");
    var o = t + "=" + i;
    if (n.maxAge != null) {
      var a = n.maxAge - 0;
      if (isNaN(a) || !isFinite(a))
        throw new TypeError("option maxAge is invalid");
      o += "; Max-Age=" + Math.floor(a);
    }
    if (n.domain) {
      if (!jo.test(n.domain)) throw new TypeError("option domain is invalid");
      o += "; Domain=" + n.domain;
    }
    if (n.path) {
      if (!jo.test(n.path)) throw new TypeError("option path is invalid");
      o += "; Path=" + n.path;
    }
    if (n.expires) {
      var u = n.expires;
      if (!jS(u) || isNaN(u.valueOf()))
        throw new TypeError("option expires is invalid");
      o += "; Expires=" + u.toUTCString();
    }
    if (
      (n.httpOnly && (o += "; HttpOnly"),
      n.secure && (o += "; Secure"),
      n.priority)
    ) {
      var c =
        typeof n.priority == "string" ? n.priority.toLowerCase() : n.priority;
      switch (c) {
        case "low":
          o += "; Priority=Low";
          break;
        case "medium":
          o += "; Priority=Medium";
          break;
        case "high":
          o += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (n.sameSite) {
      var l =
        typeof n.sameSite == "string" ? n.sameSite.toLowerCase() : n.sameSite;
      switch (l) {
        case !0:
          o += "; SameSite=Strict";
          break;
        case "lax":
          o += "; SameSite=Lax";
          break;
        case "strict":
          o += "; SameSite=Strict";
          break;
        case "none":
          o += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return o;
  }
  function FS(t) {
    return t.indexOf("%") !== -1 ? decodeURIComponent(t) : t;
  }
  function HS(t) {
    return encodeURIComponent(t);
  }
  function jS(t) {
    return MS.call(t) === "[object Date]" || t instanceof Date;
  }
  function zS(t, e) {
    try {
      return e(t);
    } catch {
      return t;
    }
  }
});
function Qp(t) {
  var e,
    r,
    n = "";
  if (typeof t == "string" || typeof t == "number") n += t;
  else if (typeof t == "object")
    if (Array.isArray(t))
      for (e = 0; e < t.length; e++)
        t[e] && (r = Qp(t[e])) && (n && (n += " "), (n += r));
    else for (e in t) t[e] && (n && (n += " "), (n += e));
  return n;
}
function Sl() {
  for (var t, e, r = 0, n = ""; r < arguments.length; )
    (t = arguments[r++]) && (e = Qp(t)) && (n && (n += " "), (n += e));
  return n;
}
var Kn = b(() => {});
function KS(t) {
  return t.replace(
    /\r\n|\r(?!\n)|\n/g,
    `
`
  );
}
function WS(t, e) {
  if (!e || e.line === void 0 || e.column === void 0) return "";
  let r = KS(t)
      .split(
        `
`
      )
      .map((o) => o.replace(/\t/g, "  ")),
    n = [];
  for (let o = -2; o <= 2; o++) r[e.line + o] && n.push(e.line + o);
  let s = 0;
  for (let o of n) {
    let a = `> ${o}`;
    a.length > s && (s = a.length);
  }
  let i = "";
  for (let o of n) {
    let a = o === e.line - 1;
    (i += a ? "> " : "  "),
      (i += `${o + 1} | ${r[o]}
`),
      a &&
        (i += `${Array.from({length: s}).join(" ")}  | ${Array.from({
          length: e.column,
        }).join(" ")}^
`);
  }
  return i;
}
function Gs(t, e) {
  let r = new RegExp(`\\x1b\\[${e}m`, "g"),
    n = `\x1B[${t}m`,
    s = `\x1B[${e}m`;
  return function (i) {
    return !GS.enabled || i == null
      ? i
      : n + (~("" + i).indexOf(s) ? i.replace(r, s + n) : i) + s;
  };
}
async function Mh(t, e, r, n) {
  let {request: s, url: i} = e,
    o = s.method.toUpperCase(),
    a = t[o] ?? t.ALL;
  if (
    (!r &&
      r === !1 &&
      o !== "GET" &&
      n.warn(
        "router",
        `${i.pathname} ${Xl(
          o
        )} requests are not available for a static site. Update your config to \`output: 'server'\` or \`output: 'hybrid'\` to enable.`
      ),
    a === void 0)
  )
    return (
      n.warn(
        "router",
        `No API Route handler exists for the method "${o}" for the route "${
          i.pathname
        }".
Found handlers: ${Object.keys(t)
          .map((c) => JSON.stringify(c))
          .join(", ")}
` +
          ("all" in t
            ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
`
            : "")
      ),
      new Response(null, {status: 404})
    );
  if (typeof a != "function")
    return (
      n.error(
        "router",
        `The route "${
          i.pathname
        }" exports a value for the method "${o}", but it is of the type ${typeof a} instead of a function.`
      ),
      new Response(null, {status: 500})
    );
  let u = await a.call(t, e);
  if (!u || !(u instanceof Response)) throw new z(VS);
  return Gl.includes(u.status) && u.headers.set(fn, "no"), u;
}
function YS(t) {
  return !(t.length !== 3 || !t[0] || typeof t[0] != "object");
}
function _h(t, e, r) {
  let n = e?.split("/").pop()?.replace(".astro", "") ?? "",
    s = (...i) => {
      if (!YS(i)) throw new z({...nh, message: nh.message(n)});
      return t(...i);
    };
  return (
    Object.defineProperty(s, "name", {value: n, writable: !1}),
    (s.isAstroComponentFactory = !0),
    (s.moduleId = e),
    (s.propagation = r),
    s
  );
}
function XS(t) {
  return _h(t.factory, t.moduleId, t.propagation);
}
function fr(t, e, r) {
  return typeof t == "function" ? _h(t, e, r) : XS(t);
}
function JS() {
  return (e) => {
    if (typeof e == "string")
      throw new z({...sh, message: sh.message(JSON.stringify(e))});
    let r = [...Object.values(e)];
    if (r.length === 0)
      throw new z({...ih, message: ih.message(JSON.stringify(e))});
    return Promise.all(r.map((n) => n()));
  };
}
function pr(t) {
  return {site: t ? new URL(t) : void 0, generator: `Astro v${Wl}`, glob: JS()};
}
function Zl(t) {
  return !!t && typeof t == "object" && typeof t.then == "function";
}
async function* n3(t) {
  let e = t.getReader();
  try {
    for (;;) {
      let {done: r, value: n} = await e.read();
      if (r) return;
      yield n;
    }
  } finally {
    e.releaseLock();
  }
}
function s3(t) {
  return Object.prototype.toString.call(t) === "[object HTMLString]";
}
function i3(t) {
  return new zo(t);
}
function $h(t) {
  return typeof t.getReader == "function";
}
async function* oh(t) {
  if ($h(t)) for await (let e of n3(t)) yield dn(e);
  else for await (let e of t) yield dn(e);
}
function* o3(t) {
  for (let e of t) yield dn(e);
}
function dn(t) {
  if (t && typeof t == "object") {
    if (t instanceof Uint8Array) return i3(t);
    if (t instanceof Response && t.body) {
      let e = t.body;
      return oh(e);
    } else {
      if (typeof t.then == "function")
        return Promise.resolve(t).then((e) => dn(e));
      if (t[Symbol.for("astro:slot-string")]) return t;
      if (Symbol.iterator in t) return o3(t);
      if (Symbol.asyncIterator in t || $h(t)) return oh(t);
    }
  }
  return re(t);
}
function ah(t) {
  return t && typeof t == "object" && t[Fh];
}
function qo(t) {
  return Object.defineProperty(t, Hh, {value: !0});
}
function a3(t) {
  return t && typeof t == "object" && t[Hh];
}
function Al(t, e = {}, r = new WeakSet()) {
  if (r.has(t))
    throw new Error(`Cyclic reference detected while serializing props for <${e.displayName} client:${e.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  r.add(t);
  let n = t.map((s) => zh(s, e, r));
  return r.delete(t), n;
}
function jh(t, e = {}, r = new WeakSet()) {
  if (r.has(t))
    throw new Error(`Cyclic reference detected while serializing props for <${e.displayName} client:${e.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  r.add(t);
  let n = Object.fromEntries(
    Object.entries(t).map(([s, i]) => [s, zh(i, e, r)])
  );
  return r.delete(t), n;
}
function zh(t, e = {}, r = new WeakSet()) {
  switch (Object.prototype.toString.call(t)) {
    case "[object Date]":
      return [lt.Date, t.toISOString()];
    case "[object RegExp]":
      return [lt.RegExp, t.source];
    case "[object Map]":
      return [lt.Map, Al(Array.from(t), e, r)];
    case "[object Set]":
      return [lt.Set, Al(Array.from(t), e, r)];
    case "[object BigInt]":
      return [lt.BigInt, t.toString()];
    case "[object URL]":
      return [lt.URL, t.toString()];
    case "[object Array]":
      return [lt.JSON, Al(t, e, r)];
    case "[object Uint8Array]":
      return [lt.Uint8Array, Array.from(t)];
    case "[object Uint16Array]":
      return [lt.Uint16Array, Array.from(t)];
    case "[object Uint32Array]":
      return [lt.Uint32Array, Array.from(t)];
    default:
      return t !== null && typeof t == "object"
        ? [lt.Value, jh(t, e, r)]
        : t === void 0
        ? [lt.Value]
        : [lt.Value, t];
  }
}
function qh(t, e) {
  return JSON.stringify(jh(t, e));
}
function u3(t, e) {
  let r = {
    isPage: !1,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {},
  };
  for (let [n, s] of Object.entries(t))
    if (
      (n.startsWith("server:") && n === "server:root" && (r.isPage = !0),
      n.startsWith("client:"))
    )
      switch (
        (r.hydration ||
          (r.hydration = {
            directive: "",
            value: "",
            componentUrl: "",
            componentExport: {value: ""},
          }),
        n)
      ) {
        case "client:component-path": {
          r.hydration.componentUrl = s;
          break;
        }
        case "client:component-export": {
          r.hydration.componentExport.value = s;
          break;
        }
        case "client:component-hydration":
          break;
        case "client:display-name":
          break;
        default: {
          if (
            ((r.hydration.directive = n.split(":")[1]),
            (r.hydration.value = s),
            !e.has(r.hydration.directive))
          ) {
            let i = Array.from(e.keys())
              .map((o) => `client:${o}`)
              .join(", ");
            throw new Error(
              `Error: invalid hydration directive "${n}". Supported hydration methods: ${i}`
            );
          }
          if (
            r.hydration.directive === "media" &&
            typeof r.hydration.value != "string"
          )
            throw new z(BS);
          break;
        }
      }
    else
      (r.props[n] = s),
        Uh.includes(n) || (r.propsWithoutTransitionAttributes[n] = s);
  for (let n of Object.getOwnPropertySymbols(t))
    (r.props[n] = t[n]), (r.propsWithoutTransitionAttributes[n] = t[n]);
  return r;
}
async function c3(t, e) {
  let {renderer: r, result: n, astroId: s, props: i, attrs: o} = t,
    {hydrate: a, componentUrl: u, componentExport: c} = e;
  if (!c.value) throw new z({...rh, message: rh.message(e.displayName)});
  let l = {children: "", props: {uid: s}};
  if (o) for (let [f, h] of Object.entries(o)) l.props[f] = Bs(h);
  (l.props["component-url"] = await n.resolve(decodeURI(u))),
    r.clientEntrypoint &&
      ((l.props["component-export"] = c.value),
      (l.props["renderer-url"] = await n.resolve(
        decodeURI(r.clientEntrypoint)
      )),
      (l.props.props = Bs(qh(i, e)))),
    (l.props.ssr = ""),
    (l.props.client = a);
  let d = await n.resolve("astro:scripts/before-hydration.js");
  return (
    d.length && (l.props["before-hydration-url"] = d),
    (l.props.opts = Bs(
      JSON.stringify({name: e.displayName, value: e.hydrateArgs || ""})
    )),
    Uh.forEach((f) => {
      typeof i[f] < "u" && (l.props[f] = i[f]);
    }),
    l
  );
}
function l3(t) {
  let e = 0;
  if (t.length === 0) return e;
  for (let r = 0; r < t.length; r++) {
    let n = t.charCodeAt(r);
    (e = (e << 5) - e + n), (e = e & e);
  }
  return e;
}
function d3(t) {
  let e,
    r = "",
    n = l3(t),
    s = n < 0 ? "Z" : "";
  for (n = Math.abs(n); n >= Cl; )
    (e = n % Cl), (n = Math.floor(n / Cl)), (r = Ll[e] + r);
  return n > 0 && (r = Ll[n] + r), s + r;
}
function Bh(t) {
  return t == null ? !1 : t.isAstroComponentFactory === !0;
}
function f3(t, e) {
  let r = e.propagation || "none";
  return (
    e.moduleId &&
      t.componentMetadata.has(e.moduleId) &&
      r === "none" &&
      (r = t.componentMetadata.get(e.moduleId).propagation),
    r === "in-tree" || r === "self"
  );
}
function Ql(t) {
  return typeof t == "object" && !!t[p3];
}
function g3(t) {
  return t._metadata.hasHydrationScript
    ? !1
    : (t._metadata.hasHydrationScript = !0);
}
function b3(t, e) {
  return t._metadata.hasDirectives.has(e)
    ? !1
    : (t._metadata.hasDirectives.add(e), !0);
}
function uh(t, e) {
  let n = t.clientDirectives.get(e);
  if (!n) throw new Error(`Unknown directive: ${e}`);
  return n;
}
function y3(t, e, r) {
  switch (e) {
    case "both":
      return `${m3}<script>${uh(t, r)};${h3}<\/script>`;
    case "directive":
      return `<script>${uh(t, r)}<\/script>`;
  }
  return "";
}
function A3(t) {
  let e = "";
  for (let [r, n] of Object.entries(t))
    e += `const ${E3(r)} = ${JSON.stringify(n)?.replace(
      /<\/script>/g,
      "\\x3C/script>"
    )};
`;
  return re(e);
}
function lh(t) {
  return t.length === 1
    ? t[0]
    : `${t.slice(0, -1).join(", ")} or ${t[t.length - 1]}`;
}
function Xe(t, e, r = !0) {
  if (t == null) return "";
  if (t === !1) return v3.test(e) || w3.test(e) ? re(` ${e}="false"`) : "";
  if (S3.has(e))
    return (
      console.warn(`[astro] The "${e}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${e}={value}\`) instead of the dynamic spread syntax (\`{...{ "${e}": value }}\`).`),
      ""
    );
  if (e === "class:list") {
    let n = cn(Sl(t), r);
    return n === "" ? "" : re(` ${e.slice(0, -5)}="${n}"`);
  }
  if (e === "style" && !(t instanceof ln)) {
    if (Array.isArray(t) && t.length === 2)
      return re(` ${e}="${cn(`${ch(t[0])};${t[1]}`, r)}"`);
    if (typeof t == "object") return re(` ${e}="${cn(ch(t), r)}"`);
  }
  return e === "className"
    ? re(` class="${cn(t, r)}"`)
    : typeof t == "string" && t.includes("&") && R3(t)
    ? re(` ${e}="${cn(t, !1)}"`)
    : t === !0 && (e.startsWith("data-") || x3.test(e))
    ? re(` ${e}`)
    : re(` ${e}="${cn(t, r)}"`);
}
function Pl(t, e = !0) {
  let r = "";
  for (let [n, s] of Object.entries(t)) r += Xe(s, n, e);
  return re(r);
}
function Us(t, {props: e, children: r = ""}, n = !0) {
  let {lang: s, "data-astro-id": i, "define:vars": o, ...a} = e;
  return (
    o &&
      (t === "style" && (delete a["is:global"], delete a["is:scoped"]),
      t === "script" &&
        (delete a.hoist,
        (r =
          A3(o) +
          `
` +
          r))),
    (r == null || r == "") && ed.test(t)
      ? `<${t}${Pl(a, n)}>`
      : `<${t}${Pl(a, n)}>${r}</${t}>`
  );
}
function Vh(t) {
  let e = [],
    r = {write: (s) => e.push(s)},
    n = t(r);
  return (
    Promise.resolve(n).catch(() => {}),
    {
      async renderToFinalDestination(s) {
        for (let i of e) s.write(i);
        (r.write = (i) => s.write(i)), await n;
      },
    }
  );
}
function dh() {
  let t, e;
  return {
    promise: new Promise((n, s) => {
      (t = n), (e = s);
    }),
    resolve: t,
    reject: e,
  };
}
function R3(t) {
  try {
    return new URL(t), !0;
  } catch {
    return !1;
  }
}
function fh(t) {
  t._metadata.hasRenderedHead = !0;
  let e = Array.from(t.styles)
    .filter(Rl)
    .map((i) =>
      i.props.rel === "stylesheet" ? Us("link", i) : Us("style", i)
    );
  t.styles.clear();
  let r = Array.from(t.scripts)
      .filter(Rl)
      .map((i) => Us("script", i, !1)),
    n = Array.from(t.links)
      .filter(Rl)
      .map((i) => Us("link", i, !1)),
    s =
      e.join(`
`) +
      n.join(`
`) +
      r.join(`
`);
  if (t._metadata.extraHead.length > 0)
    for (let i of t._metadata.extraHead) s += i;
  return re(s);
}
function Kh() {
  return qo({type: "head"});
}
function pn() {
  return qo({type: "maybe-head"});
}
function N3(t) {
  return !!t[td];
}
function Yo(t, e, r) {
  return !e && r
    ? Yo(t, r)
    : {
        async render(n) {
          await Wn(n, typeof e == "function" ? e(t) : e);
        },
      };
}
async function hn(t, e, r) {
  let n = "",
    s = null,
    i = {
      write(a) {
        if (a instanceof Vs)
          (n += a), a.instructions && ((s ??= []), s.push(...a.instructions));
        else {
          if (a instanceof Response) return;
          typeof a == "object" && "type" in a && typeof a.type == "string"
            ? (s === null && (s = []), s.push(a))
            : (n += Fr(t, a));
        }
      },
    };
  return await Yo(t, e, r).render(i), re(new Vs(n, s));
}
async function Wh(t, e = {}) {
  let r = null,
    n = {};
  return (
    e &&
      (await Promise.all(
        Object.entries(e).map(([s, i]) =>
          hn(t, i).then((o) => {
            o.instructions &&
              (r === null && (r = []), r.push(...o.instructions)),
              (n[s] = o);
          })
        )
      )),
    {slotInstructions: r, children: n}
  );
}
function nd(t, e) {
  if (a3(e)) {
    let r = e;
    switch (r.type) {
      case "directive": {
        let {hydration: n} = r,
          s = n && g3(t),
          i = n && b3(t, n.directive),
          o = s ? "both" : i ? "directive" : null;
        if (o) {
          let a = y3(t, o, n.directive);
          return re(a);
        } else return "";
      }
      case "head":
        return t._metadata.hasRenderedHead || t.partial ? "" : fh(t);
      case "maybe-head":
        return t._metadata.hasRenderedHead ||
          t._metadata.headInTree ||
          t.partial
          ? ""
          : fh(t);
      case "renderer-hydration-script": {
        let {rendererSpecificHydrationScripts: n} = t._metadata,
          {rendererName: s} = r;
        return n.has(s) ? "" : (n.add(s), r.render());
      }
      default:
        throw new Error(`Unknown chunk type: ${e.type}`);
    }
  } else {
    if (e instanceof Response) return "";
    if (N3(e)) {
      let r = "",
        n = e;
      if (n.instructions) for (let s of n.instructions) r += nd(t, s);
      return (r += e.toString()), r;
    }
  }
  return e.toString();
}
function Fr(t, e) {
  return ArrayBuffer.isView(e) ? L3.decode(e) : nd(t, e);
}
function Gh(t, e) {
  if (ArrayBuffer.isView(e)) return e;
  {
    let r = nd(t, e);
    return Ks.encode(r.toString());
  }
}
function P3(t) {
  return (
    !!t &&
    typeof t == "object" &&
    "render" in t &&
    typeof t.render == "function"
  );
}
async function Wn(t, e) {
  if (((e = await e), e instanceof Vs)) t.write(e);
  else if (s3(e)) t.write(e);
  else if (Array.isArray(e)) {
    let r = e.map((n) => Vh((s) => Wn(s, n)));
    for (let n of r) n && (await n.renderToFinalDestination(t));
  } else if (typeof e == "function") await Wn(t, e());
  else if (typeof e == "string") t.write(re(Bs(e)));
  else if (!(!e && e !== 0))
    if (P3(e)) await e.render(t);
    else if (Jh(e)) await e.render(t);
    else if (O3(e)) await e.render(t);
    else if (ArrayBuffer.isView(e)) t.write(e);
    else if (
      typeof e == "object" &&
      (Symbol.asyncIterator in e || Symbol.iterator in e)
    )
      for await (let r of e) await Wn(t, r);
    else t.write(e);
}
function I3(t, e) {
  if (t != null)
    for (let r of Object.keys(t))
      r.startsWith("client:") &&
        console.warn(
          `You are attempting to render <${e} ${r} />, but ${e} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
}
function k3(t, e, r, n, s = {}) {
  I3(n, e);
  let i = new Il(t, n, s, r);
  return f3(t, r) && t._metadata.propagators.add(i), i;
}
function O3(t) {
  return typeof t == "object" && !!t[Yh];
}
function Jh(t) {
  return typeof t == "object" && !!t[Xh];
}
function he(t, ...e) {
  return new kl(t, e);
}
async function Zh(t, e, r, n, s = !1, i) {
  let o = await id(t, e, r, n, i);
  if (o instanceof Response) return o;
  let a = "",
    u = !1,
    c = {
      write(l) {
        if (s && !u && ((u = !0), !t.partial && !sd.test(String(l)))) {
          let d = t.compressHTML
            ? "<!DOCTYPE html>"
            : `<!DOCTYPE html>
`;
          a += d;
        }
        l instanceof Response || (a += Fr(t, l));
      },
    };
  return await o.render(c), a;
}
async function D3(t, e, r, n, s = !1, i) {
  let o = await id(t, e, r, n, i);
  if (o instanceof Response) return o;
  let a = !1;
  return (
    s && (await Qh(t)),
    new ReadableStream({
      start(u) {
        let c = {
          write(l) {
            if (s && !a && ((a = !0), !t.partial && !sd.test(String(l)))) {
              let f = t.compressHTML
                ? "<!DOCTYPE html>"
                : `<!DOCTYPE html>
`;
              u.enqueue(Ks.encode(f));
            }
            if (l instanceof Response) throw new z({...Ws});
            let d = Gh(t, l);
            u.enqueue(d);
          },
        };
        (async () => {
          try {
            await o.render(c), u.close();
          } catch (l) {
            z.is(l) && !l.loc && l.setLocation({file: i?.component}),
              setTimeout(() => u.error(l), 0);
          }
        })();
      },
      cancel() {
        t.cancelled = !0;
      },
    })
  );
}
async function id(t, e, r, n, s) {
  let i = await e(t, r, n);
  if (i instanceof Response) return i;
  if (!Jh(i))
    throw new z({
      ...eh,
      message: eh.message(s?.route, typeof i),
      location: {file: s?.component},
    });
  return Ql(i) ? i.content : i;
}
async function Qh(t) {
  let e = t._metadata.propagators.values();
  for (;;) {
    let {value: r, done: n} = e.next();
    if (n) break;
    let s = await r.init(t);
    Ql(s) && t._metadata.extraHead.push(s.head);
  }
}
async function M3(t, e, r, n, s = !1, i) {
  let o = await id(t, e, r, n, i);
  if (o instanceof Response) return o;
  let a = !1;
  s && (await Qh(t));
  let u = null,
    c = dh(),
    l = [],
    d = {
      async next() {
        if (t.cancelled) return {done: !0, value: void 0};
        if ((await c.promise, u)) throw u;
        let p = 0;
        for (let y = 0, A = l.length; y < A; y++) p += l[y].length;
        let m = new Uint8Array(p),
          g = 0;
        for (let y = 0, A = l.length; y < A; y++) {
          let T = l[y];
          m.set(T, g), (g += T.length);
        }
        return (l.length = 0), {done: p === 0, value: m};
      },
      async return() {
        return (t.cancelled = !0), {done: !0, value: void 0};
      },
    },
    f = {
      write(p) {
        if (s && !a && ((a = !0), !t.partial && !sd.test(String(p)))) {
          let g = t.compressHTML
            ? "<!DOCTYPE html>"
            : `<!DOCTYPE html>
`;
          l.push(Ks.encode(g));
        }
        if (p instanceof Response) throw new z(Ws);
        let m = Gh(t, p);
        m.length > 0 && (l.push(m), c.resolve(), (c = dh()));
      },
    };
  return (
    o
      .render(f)
      .then(() => {
        c.resolve();
      })
      .catch((p) => {
        (u = p), c.resolve();
      }),
    {
      [Symbol.asyncIterator]() {
        return d;
      },
    }
  );
}
function _3(t) {
  return typeof HTMLElement < "u" && HTMLElement.isPrototypeOf(t);
}
async function $3(t, e, r, n) {
  let s = F3(e),
    i = "";
  for (let o in r) i += ` ${o}="${cn(await r[o])}"`;
  return re(`<${s}${i}>${await hn(t, n?.default)}</${s}>`);
}
function F3(t) {
  let e = customElements.getName(t);
  return (
    e ||
    t.name
      .replace(/^HTML|Element$/g, "")
      .replace(/[A-Z]/g, "-$&")
      .toLowerCase()
      .replace(/^-/, "html-")
  );
}
function j3(t) {
  switch (t?.split(".").pop()) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue (jsx)",
      ];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte",
        "@astrojs/lit",
      ];
  }
}
function z3(t) {
  return t === rd;
}
function q3(t) {
  return t && t["astro:html"] === !0;
}
function V3(t, e = !0) {
  let r = e ? B3 : U3;
  return t.replace(r, "");
}
async function K3(t, e, r, n, s = {}) {
  if (!r && !n["client:only"])
    throw new Error(`Unable to render ${e} because it is ${r}!
Did you forget to import the component or is it possible there is a typo?`);
  let {renderers: i, clientDirectives: o} = t,
    a = {astroStaticSlot: !0, displayName: e},
    {
      hydration: u,
      isPage: c,
      props: l,
      propsWithoutTransitionAttributes: d,
    } = u3(n, o),
    f = "",
    h;
  u &&
    ((a.hydrate = u.directive),
    (a.hydrateArgs = u.value),
    (a.componentExport = u.componentExport),
    (a.componentUrl = u.componentUrl));
  let p = j3(a.componentUrl),
    m = i.filter((w) => w.name !== "astro:jsx"),
    {children: g, slotInstructions: x} = await Wh(t, s),
    y;
  if (a.hydrate !== "only") {
    let w = !1;
    try {
      w = r && r[ph];
    } catch {}
    if (w) {
      let k = r[ph];
      y = i.find(({name: D}) => D === k);
    }
    if (!y) {
      let k;
      for (let D of i)
        try {
          if (await D.ssr.check.call({result: t}, r, l, g)) {
            y = D;
            break;
          }
        } catch (te) {
          k ??= te;
        }
      if (!y && k) throw k;
    }
    if (!y && typeof HTMLElement == "function" && _3(r)) {
      let k = await $3(t, r, n, s);
      return {
        render(D) {
          D.write(k);
        },
      };
    }
  } else {
    if (a.hydrateArgs) {
      let w = a.hydrateArgs,
        k = hh.has(w) ? hh.get(w) : w;
      y = i.find(({name: D}) => D === `@astrojs/${k}` || D === k);
    }
    if ((!y && m.length === 1 && (y = m[0]), !y)) {
      let w = a.componentUrl?.split(".").pop();
      y = i.filter(({name: k}) => k === `@astrojs/${w}` || k === w)[0];
    }
  }
  if (y)
    a.hydrate === "only"
      ? (f = await hn(t, s?.fallback))
      : (performance.now(),
        ({html: f, attrs: h} = await y.ssr.renderToStaticMarkup.call(
          {result: t},
          r,
          d,
          g,
          a
        )));
  else {
    if (a.hydrate === "only")
      throw new z({
        ...Tl,
        message: Tl.message(a.displayName),
        hint: Tl.hint(p.map((w) => w.replace("@astrojs/", "")).join("|")),
      });
    if (typeof r != "string") {
      let w = m.filter((D) => p.includes(D.name)),
        k = m.length > 1;
      if (w.length === 0)
        throw new z({
          ...El,
          message: El.message(
            a.displayName,
            a?.componentUrl?.split(".").pop(),
            k,
            m.length
          ),
          hint: El.hint(lh(p.map((D) => "`" + D + "`"))),
        });
      if (w.length === 1)
        (y = w[0]),
          ({html: f, attrs: h} = await y.ssr.renderToStaticMarkup.call(
            {result: t},
            r,
            d,
            g,
            a
          ));
      else
        throw new Error(`Unable to render ${a.displayName}!

This component likely uses ${lh(p)},
but Astro encountered an error during server-side rendering.

Please ensure that ${a.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
    }
  }
  if (y && !y.clientEntrypoint && y.name !== "@astrojs/lit" && a.hydrate)
    throw new z({...th, message: th.message(e, a.hydrate, y.name)});
  if (!f && typeof r == "string") {
    let w = W3(r),
      k = Object.values(g).join(""),
      D = he`<${w}${Pl(l)}${re(
        k === "" && ed.test(w) ? "/>" : `>${k}</${w}>`
      )}`;
    f = "";
    let te = {
      write(F) {
        F instanceof Response || (f += Fr(t, F));
      },
    };
    await D.render(te);
  }
  if (!u)
    return {
      render(w) {
        if (x) for (let k of x) w.write(k);
        c || y?.name === "astro:jsx"
          ? w.write(f)
          : f &&
            f.length > 0 &&
            w.write(re(V3(f, y?.ssr?.supportsAstroStaticSlot)));
      },
    };
  let A = d3(`<!--${a.componentExport.value}:${a.componentUrl}-->
${f}
${qh(l, a)}`),
    T = await c3({renderer: y, result: t, astroId: A, props: l, attrs: h}, a),
    O = [];
  if (f) {
    if (Object.keys(g).length > 0)
      for (let w of Object.keys(g)) {
        let k = y?.ssr?.supportsAstroStaticSlot
            ? a.hydrate
              ? "astro-slot"
              : "astro-static-slot"
            : "astro-slot",
          D = w === "default" ? `<${k}>` : `<${k} name="${w}">`;
        f.includes(D) || O.push(w);
      }
  } else O = Object.keys(g);
  let C =
    O.length > 0
      ? O.map(
          (w) =>
            `<template data-astro-template${w !== "default" ? `="${w}"` : ""}>${
              g[w]
            }</template>`
        ).join("")
      : "";
  return (
    (T.children = `${f ?? ""}${C}`),
    T.children &&
      ((T.props["await-children"] = ""), (T.children += "<!--astro:end-->")),
    {
      render(w) {
        if (x) for (let D of x) w.write(D);
        w.write(qo({type: "directive", hydration: u})),
          u.directive !== "only" &&
            y?.ssr.renderHydrationScript &&
            w.write(
              qo({
                type: "renderer-hydration-script",
                rendererName: y.name,
                render: y.ssr.renderHydrationScript,
              })
            );
        let k = Us("astro-island", T, !1);
        w.write(re(k));
      },
    }
  );
}
function W3(t) {
  let e = /[&<>'"\s]+/;
  return e.test(t) ? t.trim().split(e)[0].trim() : t;
}
async function G3(t, e = {}) {
  let r = await hn(t, e?.default);
  return {
    render(n) {
      r != null && n.write(r);
    },
  };
}
async function Y3(t, e, r, n = {}) {
  let {slotInstructions: s, children: i} = await Wh(t, n),
    o = e({slots: i}),
    a = s ? s.map((u) => Fr(t, u)).join("") : "";
  return {
    render(u) {
      u.write(re(a + o));
    },
  };
}
function X3(t, e, r, n, s = {}) {
  let i = k3(t, e, r, n, s);
  return {
    async render(o) {
      await i.render(o);
    },
  };
}
async function dt(t, e, r, n, s = {}) {
  if ((Zl(r) && (r = await r.catch(i)), z3(r))) return await G3(t, s).catch(i);
  if (((n = J3(n)), q3(r))) return await Y3(t, r, n, s).catch(i);
  if (Bh(r)) return X3(t, e, r, n, s);
  return await K3(t, e, r, n, s).catch(i);
  function i(o) {
    if (t.cancelled) return {render() {}};
    throw o;
  }
}
function J3(t) {
  if (t["class:list"] !== void 0) {
    let e = t["class:list"];
    delete t["class:list"],
      (t.class = Sl(t.class, e)),
      t.class === "" && delete t.class;
  }
  return t;
}
async function Ol(t, e, r, n, s = {}, i = !1, o) {
  let a = "",
    u = !1,
    c = "";
  i && !t.partial && Z3(r) && (c += Fr(t, pn()));
  try {
    let l = {
      write(f) {
        if (
          i &&
          !t.partial &&
          !u &&
          ((u = !0), !/<!doctype html/i.test(String(f)))
        ) {
          let h = t.compressHTML
            ? "<!DOCTYPE html>"
            : `<!DOCTYPE html>
`;
          a += h + c;
        }
        f instanceof Response || (a += Fr(t, f));
      },
    };
    await (await dt(t, e, r, n, s)).render(l);
  } catch (l) {
    throw (z.is(l) && !l.loc && l.setLocation({file: o?.component}), l);
  }
  return a;
}
function Z3(t) {
  return !!t?.[H3];
}
async function $r(t, e) {
  switch (!0) {
    case e instanceof ln:
      return e.toString().trim() === "" ? "" : e;
    case typeof e == "string":
      return re(Bs(e));
    case typeof e == "function":
      return e;
    case !e && e !== 0:
      return "";
    case Array.isArray(e):
      return re((await Promise.all(e.map((r) => $r(t, r)))).join(""));
  }
  return em(t, e);
}
async function em(t, e) {
  if (ah(e)) {
    switch (!0) {
      case !e.type:
        throw new Error(`Unable to render ${t.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      case e.type === Symbol.for("astro:fragment"):
        return $r(t, e.props.children);
      case e.type.isAstroComponentFactory: {
        let r = {},
          n = {};
        for (let [o, a] of Object.entries(e.props ?? {}))
          o === "children" || (a && typeof a == "object" && a.$$slot)
            ? (n[o === "children" ? "default" : o] = () => $r(t, a))
            : (r[o] = a);
        let s = await Zh(t, e.type, r, n);
        if (s instanceof Response) throw s;
        return re(s);
      }
      case !e.type && e.type !== 0:
        return "";
      case typeof e.type == "string" && e.type !== mh:
        return re(await Q3(t, e.type, e.props ?? {}));
    }
    if (e.type) {
      let r = function (c) {
        if (Array.isArray(c)) return c.map((l) => r(l));
        if (!ah(c)) {
          i.default.push(c);
          return;
        }
        if ("slot" in c.props) {
          (i[c.props.slot] = [...(i[c.props.slot] ?? []), c]),
            delete c.props.slot;
          return;
        }
        i.default.push(c);
      };
      if (typeof e.type == "function" && e.props["server:root"]) {
        let c = await e.type(e.props ?? {});
        return await $r(t, c);
      }
      if (typeof e.type == "function")
        if (e.props[gh]) {
          let c = await e.type(e.props ?? {});
          return c?.[Fh] || !c ? await em(t, c) : void 0;
        } else e.props[gh] = !0;
      let {children: n = null, ...s} = e.props ?? {},
        i = {default: []};
      r(n);
      for (let [c, l] of Object.entries(s))
        l.$$slot && ((i[c] = l), delete s[c]);
      let o = [],
        a = {};
      for (let [c, l] of Object.entries(i))
        o.push(
          $r(t, l).then((d) => {
            d.toString().trim().length !== 0 && (a[c] = () => d);
          })
        );
      await Promise.all(o);
      let u;
      return (
        e.type === mh && e.props["client:only"]
          ? (u = await Ol(t, e.props["client:display-name"] ?? "", null, s, a))
          : (u = await Ol(
              t,
              typeof e.type == "function" ? e.type.name : e.type,
              e.type,
              s,
              a
            )),
        re(u)
      );
    }
  }
  return re(`${e}`);
}
async function Q3(t, e, {children: r, ...n}) {
  return re(
    `<${e}${Hr(n)}${re(
      (r == null || r == "") && ed.test(e)
        ? "/>"
        : `>${r == null ? "" : await $r(t, e6(e, r))}</${e}>`
    )}`
  );
}
function e6(t, e) {
  return typeof e == "string" && (t === "style" || t === "script") ? re(e) : e;
}
async function tm(t, e, r, n, s, i) {
  if (!Bh(e)) {
    t._metadata.headInTree =
      t.componentMetadata.get(e.moduleId)?.containsHead ?? !1;
    let l = {...(r ?? {}), "server:root": !0},
      d = await Ol(t, e.name, e, l, {}, !0, i),
      f = Ks.encode(d);
    return new Response(f, {
      headers: new Headers([
        ["Content-Type", "text/html; charset=utf-8"],
        ["Content-Length", f.byteLength.toString()],
      ]),
    });
  }
  t._metadata.headInTree =
    t.componentMetadata.get(e.moduleId)?.containsHead ?? !1;
  let o;
  if (
    (s
      ? C3
        ? (o = await M3(t, e, r, n, !0, i))
        : (o = await D3(t, e, r, n, !0, i))
      : (o = await Zh(t, e, r, n, !0, i)),
    o instanceof Response)
  )
    return o;
  let a = t.response,
    u = new Headers(a.headers);
  return (
    !s &&
      typeof o == "string" &&
      ((o = Ks.encode(o)), u.set("Content-Length", o.byteLength.toString())),
    i?.component.endsWith(".md") &&
      u.set("Content-Type", "text/html; charset=utf-8"),
    new Response(o, {...a, headers: u})
  );
}
function rm(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default")
    ? t.default
    : t;
}
function Hr(t = {}, e, {class: r} = {}) {
  let n = "";
  r &&
    (typeof t.class < "u"
      ? (t.class += ` ${r}`)
      : typeof t["class:list"] < "u"
      ? (t["class:list"] = [t["class:list"], r])
      : (t.class = r));
  for (let [s, i] of Object.entries(t)) n += Xe(i, s, !0);
  return re(n);
}
var qS,
  US,
  qe,
  bh,
  yh,
  xh,
  Dl,
  vh,
  Uo,
  eh,
  BS,
  El,
  th,
  Tl,
  Ml,
  _l,
  wh,
  $l,
  Sh,
  Fl,
  rh,
  nh,
  Hl,
  jl,
  Eh,
  zl,
  ql,
  Ul,
  Th,
  Bo,
  Gn,
  Bl,
  Ah,
  Ws,
  Ch,
  Vo,
  VS,
  Vl,
  Rh,
  Kl,
  sh,
  ih,
  z,
  Wl,
  fn,
  Yn,
  Ko,
  Gl,
  Wo,
  Yl,
  Go,
  Nl,
  Nh,
  Lh,
  Ph,
  Ih,
  GS,
  Xl,
  Jl,
  kh,
  Oh,
  Dh,
  ZS,
  QS,
  e3,
  t3,
  r3,
  Bs,
  zo,
  ln,
  re,
  Fh,
  Hh,
  lt,
  Uh,
  Ll,
  Cl,
  p3,
  h3,
  m3,
  ed,
  x3,
  v3,
  w3,
  S3,
  E3,
  cn,
  T3,
  ch,
  C3,
  Rl,
  td,
  Vs,
  rd,
  ph,
  Ks,
  L3,
  Yh,
  Il,
  Xh,
  kl,
  sd,
  H3,
  hh,
  U3,
  B3,
  mh,
  gh,
  t6,
  r6,
  n6,
  s6,
  i6,
  o6,
  nm,
  Xn = b(() => {
    "use strict";
    Kn();
    (qS = Object.defineProperty),
      (US = (t, e, r) =>
        e in t
          ? qS(t, e, {enumerable: !0, configurable: !0, writable: !0, value: r})
          : (t[e] = r)),
      (qe = (t, e, r) => (US(t, typeof e != "symbol" ? e + "" : e, r), r)),
      (Dl = {
        name: "ClientAddressNotAvailable",
        title: "`Astro.clientAddress` is not available in current adapter.",
        message: (t) =>
          `\`Astro.clientAddress\` is not available in the \`${t}\` adapter. File an issue with the adapter to add support.`,
      }),
      (vh = {
        name: "StaticClientAddressNotAvailable",
        title: "`Astro.clientAddress` is not available in static mode.",
        message:
          "`Astro.clientAddress` is only available when using `output: 'server'` or `output: 'hybrid'`. Update your Astro config if you need SSR features.",
        hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information on how to enable SSR.",
      }),
      (Uo = {
        name: "NoMatchingStaticPathFound",
        title: "No static path found for requested path.",
        message: (t) =>
          `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${t}\`.`,
        hint: (t) => `Possible dynamic routes being matched: ${t.join(", ")}.`,
      }),
      (eh = {
        name: "OnlyResponseCanBeReturned",
        title: "Invalid type returned by Astro page.",
        message: (t, e) =>
          `Route \`${
            t || ""
          }\` returned a \`${e}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`,
        hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information.",
      }),
      (BS = {
        name: "MissingMediaQueryDirective",
        title: "Missing value for `client:media` directive.",
        message:
          'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided',
      }),
      (El = {
        name: "NoMatchingRenderer",
        title: "No matching renderer found.",
        message: (t, e, r, n) => `Unable to render \`${t}\`.

${
  n > 0
    ? `There ${r ? "are" : "is"} ${n} renderer${
        r ? "s" : ""
      } configured in your \`astro.config.mjs\` file,
but ${r ? "none were" : "it was not"} able to server-side render \`${t}\`.`
    : `No valid renderer was found ${
        e ? `for the \`.${e}\` file extension.` : "for this file extension."
      }`
}`,
        hint: (t) => `Did you mean to enable the ${t} integration?

See https://docs.astro.build/en/guides/framework-components/ for more information on how to install and configure integrations.`,
      }),
      (th = {
        name: "NoClientEntrypoint",
        title: "No client entrypoint specified in renderer.",
        message: (t, e, r) =>
          `\`${t}\` component has a \`client:${e}\` directive, but no client entrypoint was provided by \`${r}\`.`,
        hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer.",
      }),
      (Tl = {
        name: "NoClientOnlyHint",
        title: "Missing hint on client:only directive.",
        message: (t) =>
          `Unable to render \`${t}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
        hint: (t) =>
          `Did you mean to pass \`client:only="${t}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`,
      }),
      (Ml = {
        name: "InvalidGetStaticPathsEntry",
        title: "Invalid entry inside getStaticPath's return value",
        message: (t) =>
          `Invalid entry returned by getStaticPaths. Expected an object, got \`${t}\``,
        hint: "If you're using a `.map` call, you might be looking for `.flatMap()` instead. See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths.",
      }),
      (_l = {
        name: "InvalidGetStaticPathsReturn",
        title: "Invalid value returned by getStaticPaths.",
        message: (t) =>
          `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${t}\``,
        hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths.",
      }),
      (wh = {
        name: "GetStaticPathsExpectedParams",
        title: "Missing params property on `getStaticPaths` route.",
        message:
          "Missing or empty required `params` property on `getStaticPaths` route.",
        hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths.",
      }),
      ($l = {
        name: "GetStaticPathsInvalidRouteParam",
        title: "Invalid value for `getStaticPaths` route parameter.",
        message: (t, e, r) =>
          `Invalid getStaticPaths route parameter for \`${t}\`. Expected undefined, a string or a number, received \`${r}\` (\`${e}\`)`,
        hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths.",
      }),
      (Sh = {
        name: "GetStaticPathsRequired",
        title: "`getStaticPaths()` function required for dynamic routes.",
        message:
          "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
        hint: 'See https://docs.astro.build/en/guides/routing/#dynamic-routes for more information on dynamic routes.\n\nAlternatively, set `output: "server"` or `output: "hybrid"` in your Astro config file to switch to a non-static server build. This error can also occur if using `export const prerender = true;`.\nSee https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.',
      }),
      (Fl = {
        name: "ReservedSlotName",
        title: "Invalid slot name.",
        message: (t) =>
          `Unable to create a slot named \`${t}\`. \`${t}\` is a reserved slot name. Please update the name of this slot.`,
      }),
      (rh = {
        name: "NoMatchingImport",
        title: "No import found for component.",
        message: (t) =>
          `Could not render \`${t}\`. No matching import has been found for \`${t}\`.`,
        hint: "Please make sure the component is properly imported.",
      }),
      (nh = {
        name: "InvalidComponentArgs",
        title: "Invalid component arguments.",
        message: (t) =>
          `Invalid arguments passed to${t ? ` <${t}>` : ""} component.`,
        hint: "Astro components cannot be rendered directly via function call, such as `Component()` or `{items.map(Component)}`.",
      }),
      (Hl = {
        name: "PageNumberParamNotFound",
        title: "Page number param not found.",
        message: (t) =>
          `[paginate()] page number param \`${t}\` not found in your filepath.`,
        hint: "Rename your file to `[page].astro` or `[...page].astro`.",
      }),
      (jl = {
        name: "ImageMissingAlt",
        title: 'Image missing required "alt" property.',
        message:
          'Image missing "alt" property. "alt" text is required to describe important images on the page.',
        hint: 'Use an empty string ("") for decorative images.',
      }),
      (Eh = {
        name: "InvalidImageService",
        title: "Error while loading image service.",
        message:
          "There was an error loading the configured image service. Please see the stack trace for more information.",
      }),
      (zl = {
        name: "MissingImageDimension",
        title: "Missing image dimensions",
        message: (t, e) =>
          `Missing ${
            t === "both" ? "width and height attributes" : `${t} attribute`
          } for ${e}. When using remote images, both dimensions are required unless in order to avoid CLS.`,
        hint: "If your image is inside your `src` folder, you probably meant to import it instead. See [the Imports guide for more information](https://docs.astro.build/en/guides/imports/#other-assets). You can also use `inferSize={true}` for remote images to get the original dimensions.",
      }),
      (ql = {
        name: "FailedToFetchRemoteImageDimensions",
        title: "Failed to retrieve remote image dimensions",
        message: (t) => `Failed to get the dimensions for ${t}.`,
        hint: "Verify your remote image URL is accurate, and that you are not using `inferSize` with a file located in your `public/` folder.",
      }),
      (Ul = {
        name: "UnsupportedImageFormat",
        title: "Unsupported image format",
        message: (t, e, r) =>
          `Received unsupported format \`${t}\` from \`${e}\`. Currently only ${r.join(
            ", "
          )} are supported by our image services.`,
        hint: "Using an `img` tag directly instead of the `Image` component might be what you're looking for.",
      }),
      (Th = {
        name: "UnsupportedImageConversion",
        title: "Unsupported image conversion",
        message:
          "Converting between vector (such as SVGs) and raster (such as PNGs and JPEGs) images is not currently supported.",
      }),
      (Bo = {
        name: "PrerenderDynamicEndpointPathCollide",
        title: "Prerendered dynamic endpoint has path collision.",
        message: (t) =>
          `Could not render \`${t}\` with an \`undefined\` param as the generated path will collide during prerendering. Prevent passing \`undefined\` as \`params\` for the endpoint's \`getStaticPaths()\` function, or add an additional extension to the endpoint's filename.`,
        hint: (t) =>
          `Rename \`${t}\` to \`${t.replace(
            /\.(?:js|ts)/,
            (e) => ".json" + e
          )}\``,
      }),
      (Gn = {
        name: "ExpectedImage",
        title: "Expected src to be an image.",
        message: (
          t,
          e,
          r
        ) => `Expected \`src\` property for \`getImage\` or \`<Image />\` to be either an ESM imported image or a string with the path of a remote image. Received \`${t}\` (type: \`${e}\`).

Full serialized options received: \`${r}\`.`,
        hint: "This error can often happen because of a wrong path. Make sure the path to your image is correct. If you're passing an async function, make sure to call and await it.",
      }),
      (Bl = {
        name: "ExpectedImageOptions",
        title: "Expected image options.",
        message: (t) =>
          `Expected getImage() parameter to be an object. Received \`${t}\`.`,
      }),
      (Ah = {
        name: "IncompatibleDescriptorOptions",
        title: "Cannot set both `densities` and `widths`",
        message:
          "Only one of `densities` or `widths` can be specified. In most cases, you'll probably want to use only `widths` if you require specific widths.",
        hint: "Those attributes are used to construct a `srcset` attribute, which cannot have both `x` and `w` descriptors.",
      }),
      (Ws = {
        name: "ResponseSentError",
        title: "Unable to set response.",
        message:
          "The response has already been sent to the browser and cannot be altered.",
      }),
      (Ch = {
        name: "MiddlewareNoDataOrNextCalled",
        title: "The middleware didn't return a `Response`.",
        message:
          "Make sure your middleware returns a `Response` object, either directly or by returning the `Response` from calling the `next` function.",
      }),
      (Vo = {
        name: "MiddlewareNotAResponse",
        title:
          "The middleware returned something that is not a `Response` object.",
        message:
          "Any data returned from middleware must be a valid `Response` object.",
      }),
      (VS = {
        name: "EndpointDidNotReturnAResponse",
        title: "The endpoint did not return a `Response`.",
        message:
          "An endpoint must return either a `Response`, or a `Promise` that resolves with a `Response`.",
      }),
      (Vl = {
        name: "LocalsNotAnObject",
        title: "Value assigned to `locals` is not accepted.",
        message:
          "`locals` can only be assigned to an object. Other values like numbers, strings, etc. are not accepted.",
        hint: "If you tried to remove some information from the `locals` object, try to use `delete` or set the property to `undefined`.",
      }),
      (Rh = {
        name: "AstroResponseHeadersReassigned",
        title: "`Astro.response.headers` must not be reassigned.",
        message:
          "Individual headers can be added to and removed from `Astro.response.headers`, but it must not be replaced with another instance of `Headers` altogether.",
        hint: "Consider using `Astro.response.headers.add()`, and `Astro.response.headers.delete()`.",
      }),
      (Kl = {
        name: "LocalImageUsedWrongly",
        title: "Local images must be imported.",
        message: (t) =>
          `\`Image\`'s and \`getImage\`'s \`src\` parameter must be an imported image or an URL, it cannot be a string filepath. Received \`${t}\`.`,
        hint: "If you want to use an image from your `src` folder, you need to either import it or if the image is coming from a content collection, use the [image() schema helper](https://docs.astro.build/en/guides/images/#images-in-content-collections). See https://docs.astro.build/en/guides/images/#src-required for more information on the `src` property.",
      }),
      (sh = {
        name: "AstroGlobUsedOutside",
        title: "Astro.glob() used outside of an Astro file.",
        message: (t) =>
          `\`Astro.glob(${t})\` can only be used in \`.astro\` files. \`import.meta.glob(${t})\` can be used instead to achieve a similar result.`,
        hint: "See Vite's documentation on `import.meta.glob` for more information: https://vitejs.dev/guide/features.html#glob-import",
      }),
      (ih = {
        name: "AstroGlobNoMatch",
        title: "Astro.glob() did not match any files.",
        message: (t) =>
          `\`Astro.glob(${t})\` did not return any matching files.`,
        hint: "Check the pattern for typos.",
      });
    (z = class extends Error {
      constructor(e, r) {
        let {
          name: n,
          title: s,
          message: i,
          stack: o,
          location: a,
          hint: u,
          frame: c,
        } = e;
        super(i, r),
          qe(this, "loc"),
          qe(this, "title"),
          qe(this, "hint"),
          qe(this, "frame"),
          qe(this, "type", "AstroError"),
          (this.title = s),
          (this.name = n),
          i && (this.message = i),
          (this.stack = o || this.stack),
          (this.loc = a),
          (this.hint = u),
          (this.frame = c);
      }
      setLocation(e) {
        this.loc = e;
      }
      setName(e) {
        this.name = e;
      }
      setMessage(e) {
        this.message = e;
      }
      setHint(e) {
        this.hint = e;
      }
      setFrame(e, r) {
        this.frame = WS(e, r);
      }
      static is(e) {
        return e.type === "AstroError";
      }
    }),
      (Wl = "4.5.9"),
      (fn = "X-Astro-Reroute"),
      (Yn = "X-Astro-Route-Type"),
      (Ko = "astro-default-404"),
      (Gl = [404, 500]),
      (Wo = Symbol.for("astro.clientAddress")),
      (Yl = Symbol.for("astro.locals")),
      (Go = Symbol.for("astro.responseSent")),
      (Ih = !0);
    typeof process < "u" &&
      (({
        FORCE_COLOR: Nl,
        NODE_DISABLE_COLORS: Nh,
        NO_COLOR: Lh,
        TERM: Ph,
      } = process.env || {}),
      (Ih = process.stdout && process.stdout.isTTY));
    GS = {
      enabled:
        !Nh &&
        Lh == null &&
        Ph !== "dumb" &&
        ((Nl != null && Nl !== "0") || Ih),
    };
    (Xl = Gs(1, 22)),
      (Jl = Gs(2, 22)),
      (kh = Gs(31, 39)),
      (Oh = Gs(33, 39)),
      (Dh = Gs(34, 39));
    ({replace: ZS} = ""),
      (QS = /[&<>'"]/g),
      (e3 = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      }),
      (t3 = (t) => e3[t]),
      (r3 = (t) => ZS.call(t, QS, t3));
    (Bs = r3), (zo = class extends Uint8Array {});
    Object.defineProperty(zo.prototype, Symbol.toStringTag, {
      get() {
        return "HTMLBytes";
      },
    });
    (ln = class extends String {
      get [Symbol.toStringTag]() {
        return "HTMLString";
      }
    }),
      (re = (t) =>
        t instanceof ln ? t : typeof t == "string" ? new ln(t) : t);
    Fh = "astro:jsx";
    Hh = Symbol.for("astro:render");
    lt = {
      Value: 0,
      JSON: 1,
      RegExp: 2,
      Date: 3,
      Map: 4,
      Set: 5,
      BigInt: 6,
      URL: 7,
      Uint8Array: 8,
      Uint16Array: 9,
      Uint32Array: 10,
    };
    Uh = Object.freeze([
      "data-astro-transition-scope",
      "data-astro-transition-persist",
      "data-astro-transition-persist-props",
    ]);
    (Ll = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY"),
      (Cl = Ll.length);
    p3 = Symbol.for("astro.headAndContent");
    (h3 =
      '(()=>{var v=Object.defineProperty;var A=(c,s,a)=>s in c?v(c,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):c[s]=a;var d=(c,s,a)=>(A(c,typeof s!="symbol"?s+"":s,a),a);var u;{let c={0:t=>m(t),1:t=>a(t),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(a(t)),5:t=>new Set(a(t)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(t),9:t=>new Uint16Array(t),10:t=>new Uint32Array(t)},s=t=>{let[e,n]=t;return e in c?c[e](n):void 0},a=t=>t.map(s),m=t=>typeof t!="object"||t===null?t:Object.fromEntries(Object.entries(t).map(([e,n])=>[e,s(n)]));customElements.get("astro-island")||customElements.define("astro-island",(u=class extends HTMLElement{constructor(){super(...arguments);d(this,"Component");d(this,"hydrator");d(this,"hydrate",async()=>{var f;if(!this.hydrator||!this.isConnected)return;let e=(f=this.parentElement)==null?void 0:f.closest("astro-island[ssr]");if(e){e.addEventListener("astro:hydrate",this.hydrate,{once:!0});return}let n=this.querySelectorAll("astro-slot"),r={},l=this.querySelectorAll("template[data-astro-template]");for(let o of l){let i=o.closest(this.tagName);i!=null&&i.isSameNode(this)&&(r[o.getAttribute("data-astro-template")||"default"]=o.innerHTML,o.remove())}for(let o of n){let i=o.closest(this.tagName);i!=null&&i.isSameNode(this)&&(r[o.getAttribute("name")||"default"]=o.innerHTML)}let h;try{h=this.hasAttribute("props")?m(JSON.parse(this.getAttribute("props"))):{}}catch(o){let i=this.getAttribute("component-url")||"<unknown>",b=this.getAttribute("component-export");throw b&&(i+=` (export ${b})`),console.error(`[hydrate] Error parsing props for component ${i}`,this.getAttribute("props"),o),o}let p;await this.hydrator(this)(this.Component,h,r,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),this.dispatchEvent(new CustomEvent("astro:hydrate"))});d(this,"unmount",()=>{this.isConnected||this.dispatchEvent(new CustomEvent("astro:unmount"))})}disconnectedCallback(){document.removeEventListener("astro:after-swap",this.unmount),document.addEventListener("astro:after-swap",this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute("await-children")||document.readyState==="interactive"||document.readyState==="complete")this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener("DOMContentLoaded",e),n.disconnect(),this.childrenConnectedCallback()},n=new MutationObserver(()=>{var r;((r=this.lastChild)==null?void 0:r.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue==="astro:end"&&(this.lastChild.remove(),e())});n.observe(this,{childList:!0}),document.addEventListener("DOMContentLoaded",e)}}async childrenConnectedCallback(){let e=this.getAttribute("before-hydration-url");e&&await import(e),this.start()}async start(){let e=JSON.parse(this.getAttribute("opts")),n=this.getAttribute("client");if(Astro[n]===void 0){window.addEventListener(`astro:${n}`,()=>this.start(),{once:!0});return}try{await Astro[n](async()=>{let r=this.getAttribute("renderer-url"),[l,{default:h}]=await Promise.all([import(this.getAttribute("component-url")),r?import(r):()=>()=>{}]),p=this.getAttribute("component-export")||"default";if(!p.includes("."))this.Component=l[p];else{this.Component=l;for(let y of p.split("."))this.Component=this.Component[y]}return this.hydrator=h,this.hydrate},e,this)}catch(r){console.error(`[astro-island] Error hydrating ${this.getAttribute("component-url")}`,r)}}attributeChangedCallback(){this.hydrate()}},d(u,"observedAttributes",["props"]),u))}})();'),
      (m3 =
        "<style>astro-island,astro-slot,astro-static-slot{display:contents}</style>");
    (ed =
      /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i),
      (x3 =
        /^(?:allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i),
      (v3 = /^(?:contenteditable|draggable|spellcheck|value)$/i),
      (w3 =
        /^(?:autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i),
      (S3 = new Set(["set:html", "set:text"])),
      (E3 = (t) =>
        t
          .trim()
          .replace(/(?!^)\b\w|\s+|\W+/g, (e, r) =>
            /\W/.test(e) ? "" : r === 0 ? e : e.toUpperCase()
          )),
      (cn = (t, e = !0) =>
        e ? String(t).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : t),
      (T3 = (t) =>
        t.toLowerCase() === t
          ? t
          : t.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`)),
      (ch = (t) =>
        Object.entries(t)
          .filter(
            ([e, r]) =>
              (typeof r == "string" && r.trim()) || typeof r == "number"
          )
          .map(([e, r]) =>
            e[0] !== "-" && e[1] !== "-" ? `${T3(e)}:${r}` : `${e}:${r}`
          )
          .join(";"));
    C3 =
      typeof process < "u" &&
      Object.prototype.toString.call(process) === "[object process]";
    Rl = (t, e, r) => {
      let n = JSON.stringify(t.props),
        s = t.children;
      return (
        e ===
        r.findIndex((i) => JSON.stringify(i.props) === n && i.children == s)
      );
    };
    (td = Symbol.for("astro:slot-string")),
      (Vs = class extends ln {
        constructor(e, r) {
          super(e),
            qe(this, "instructions"),
            qe(this, bh),
            (this.instructions = r),
            (this[td] = !0);
        }
      });
    bh = td;
    (rd = Symbol.for("astro:fragment")),
      (ph = Symbol.for("astro:renderer")),
      (Ks = new TextEncoder()),
      (L3 = new TextDecoder());
    (Yh = Symbol.for("astro.componentInstance")),
      (Il = class {
        constructor(e, r, n, s) {
          qe(this, yh, !0),
            qe(this, "result"),
            qe(this, "props"),
            qe(this, "slotValues"),
            qe(this, "factory"),
            qe(this, "returnValue"),
            (this.result = e),
            (this.props = r),
            (this.factory = s),
            (this.slotValues = {});
          for (let i in n) {
            let o = !1,
              a = n[i](e);
            this.slotValues[i] = () => (o ? n[i](e) : ((o = !0), a));
          }
        }
        async init(e) {
          return this.returnValue !== void 0
            ? this.returnValue
            : ((this.returnValue = this.factory(
                e,
                this.props,
                this.slotValues
              )),
              this.returnValue);
        }
        async render(e) {
          this.returnValue === void 0 && (await this.init(this.result));
          let r = this.returnValue;
          Zl(r) && (r = await r),
            Ql(r) ? await r.content.render(e) : await Wn(e, r);
        }
      });
    yh = Yh;
    (Xh = Symbol.for("astro.renderTemplateResult")),
      (kl = class {
        constructor(e, r) {
          qe(this, xh, !0),
            qe(this, "htmlParts"),
            qe(this, "expressions"),
            qe(this, "error"),
            (this.htmlParts = e),
            (this.error = void 0),
            (this.expressions = r.map((n) =>
              Zl(n)
                ? Promise.resolve(n).catch((s) => {
                    if (!this.error) throw ((this.error = s), s);
                  })
                : n
            ));
        }
        async render(e) {
          let r = this.expressions.map((n) =>
            Vh((s) => {
              if (n || n === 0) return Wn(s, n);
            })
          );
          for (let n = 0; n < this.htmlParts.length; n++) {
            let s = this.htmlParts[n],
              i = r[n];
            e.write(re(s)), i && (await i.renderToFinalDestination(e));
          }
        }
      });
    xh = Xh;
    sd = /<!doctype html/i;
    (H3 = Symbol.for("astro.needsHeadRendering")),
      (hh = new Map([["solid", "solid-js"]]));
    (U3 = /<\/?astro-slot\b[^>]*>/g), (B3 = /<\/?astro-static-slot\b[^>]*>/g);
    (mh = "astro-client-only"), (gh = Symbol("hasTriedRenderComponent"));
    (t6 = {}),
      (r6 = t6.hasOwnProperty),
      (n6 = function (e, r) {
        if (!e) return r;
        var n = {};
        for (var s in r) n[s] = r6.call(e, s) ? e[s] : r[s];
        return n;
      }),
      (s6 = /[ -,\.\/:-@\[-\^`\{-~]/),
      (i6 = /[ -,\.\/:-@\[\]\^`\{-~]/),
      (o6 = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g),
      (nm = function t(e, r) {
        (r = n6(r, t.options)),
          r.quotes != "single" && r.quotes != "double" && (r.quotes = "single");
        for (
          var n = r.quotes == "double" ? '"' : "'",
            s = r.isIdentifier,
            i = e.charAt(0),
            o = "",
            a = 0,
            u = e.length;
          a < u;

        ) {
          var c = e.charAt(a++),
            l = c.charCodeAt(),
            d = void 0;
          if (l < 32 || l > 126) {
            if (l >= 55296 && l <= 56319 && a < u) {
              var f = e.charCodeAt(a++);
              (f & 64512) == 56320
                ? (l = ((l & 1023) << 10) + (f & 1023) + 65536)
                : a--;
            }
            d = "\\" + l.toString(16).toUpperCase() + " ";
          } else
            r.escapeEverything
              ? s6.test(c)
                ? (d = "\\" + c)
                : (d = "\\" + l.toString(16).toUpperCase() + " ")
              : /[\t\n\f\r\x0B]/.test(c)
              ? (d = "\\" + l.toString(16).toUpperCase() + " ")
              : c == "\\" ||
                (!s && ((c == '"' && n == c) || (c == "'" && n == c))) ||
                (s && i6.test(c))
              ? (d = "\\" + c)
              : (d = c);
          o += d;
        }
        return (
          s &&
            (/^-[-\d]/.test(o)
              ? (o = "\\-" + o.slice(1))
              : /\d/.test(i) && (o = "\\3" + i + " " + o.slice(1))),
          (o = o.replace(o6, function (h, p, m) {
            return p && p.length % 2 ? h : (p || "") + m;
          })),
          !s && r.wrap ? n + o + n : o
        );
      });
    nm.options = {
      escapeEverything: !1,
      isIdentifier: !1,
      quotes: "single",
      wrap: !1,
    };
    nm.version = "3.0.0";
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
      .split("")
      .reduce((t, e) => ((t[e.charCodeAt(0)] = e), t), []);
    "-0123456789_"
      .split("")
      .reduce((t, e) => ((t[e.charCodeAt(0)] = e), t), []);
  });
var hm = {};
vt(hm, {
  D: () => ra,
  a: () => hr,
  b: () => cd,
  c: () => Zn,
  d: () => sa,
  e: () => Zo,
  f: () => ud,
  g: () => Qo,
  i: () => na,
  j: () => jr,
  n: () => N6,
  p: () => Jn,
  r: () => Js,
  s: () => ta,
  t: () => ea,
});
function Zo(t) {
  return t.endsWith("/") ? t : t + "/";
}
function Jn(t) {
  return t[0] === "/" ? t : "/" + t;
}
function Qo(t) {
  return t.replace(/(?<!:)\/{2,}/g, "/");
}
function Js(t) {
  return t.endsWith("/") ? t.slice(0, t.length - 1) : t;
}
function x6(t) {
  return t.startsWith("/") ? t.substring(1) : t;
}
function ea(t) {
  return t.replace(/^\/|\/$/g, "");
}
function v6(t) {
  return typeof t == "string" || t instanceof String;
}
function jr(...t) {
  return t
    .filter(v6)
    .map((e, r) => (r === 0 ? Js(e) : r === t.length - 1 ? x6(e) : ea(e)))
    .join("/");
}
function Zn(t) {
  return /^(?:http|ftp|https|ws):?\/\//.test(t) || t.startsWith("data:");
}
function ta(t) {
  return t.replace(/\\/g, "/");
}
function ud(t) {
  let e = t.split(".").pop();
  return e !== t ? `.${e}` : "";
}
function hr(t) {
  return typeof t == "object";
}
function na(t) {
  return typeof t == "string";
}
function w6(t, e) {
  return (
    E6(t, e.protocol) &&
    pm(t, e.hostname, !0) &&
    S6(t, e.port) &&
    T6(t, e.pathname, !0)
  );
}
function S6(t, e) {
  return !e || e === t.port;
}
function E6(t, e) {
  return !e || e === t.protocol.slice(0, -1);
}
function pm(t, e, r) {
  if (e) {
    if (!r || !e.startsWith("*")) return e === t.hostname;
    if (e.startsWith("**.")) {
      let n = e.slice(2);
      return n !== t.hostname && t.hostname.endsWith(n);
    } else if (e.startsWith("*.")) {
      let n = e.slice(1);
      return t.hostname.replace(n, "").split(".").filter(Boolean).length === 1;
    }
  } else return !0;
  return !1;
}
function T6(t, e, r) {
  if (e) {
    if (!r || !e.endsWith("*")) return e === t.pathname;
    if (e.endsWith("/**")) {
      let n = e.slice(0, -2);
      return n !== t.pathname && t.pathname.startsWith(n);
    } else if (e.endsWith("/*")) {
      let n = e.slice(0, -1);
      return t.pathname.replace(n, "").split("/").filter(Boolean).length === 1;
    }
  } else return !0;
  return !1;
}
function sa(t, {domains: e = [], remotePatterns: r = []}) {
  if (!Zn(t)) return !1;
  let n = new URL(t);
  return e.some((s) => pm(n, s)) || r.some((s) => w6(n, s));
}
function cd(t) {
  return t ? "transform" in t : !1;
}
function fm(t) {
  let e = t.width,
    r = t.height;
  if (hr(t.src)) {
    let n = t.src.width / t.src.height;
    r && !e
      ? (e = Math.round(r * n))
      : e && !r
      ? (r = Math.round(e / n))
      : !e && !r && ((e = t.src.width), (r = t.src.height));
  }
  return {targetWidth: e, targetHeight: r};
}
var lm,
  dm,
  ra,
  A6,
  C6,
  R6,
  N6,
  ia = b(() => {
    "use strict";
    Xn();
    (lm = ["jpeg", "jpg", "png", "tiff", "webp", "gif", "svg", "avif"]),
      (dm = "webp"),
      (ra = ["src", "width", "height", "format", "quality"]);
    A6 = {
      propertiesToHash: ra,
      validateOptions(t) {
        if (!t.src || (typeof t.src != "string" && typeof t.src != "object"))
          throw new z({
            ...Gn,
            message: Gn.message(
              JSON.stringify(t.src),
              typeof t.src,
              JSON.stringify(t, (e, r) => (r === void 0 ? null : r))
            ),
          });
        if (hr(t.src)) {
          if (!lm.includes(t.src.format))
            throw new z({
              ...Ul,
              message: Ul.message(t.src.format, t.src.src, lm),
            });
          if (t.widths && t.densities) throw new z(Ah);
          if (
            (t.src.format === "svg" && (t.format = "svg"),
            (t.src.format === "svg" && t.format !== "svg") ||
              (t.src.format !== "svg" && t.format === "svg"))
          )
            throw new z(Th);
        } else {
          if (
            t.src.startsWith("/@fs/") ||
            (!Zn(t.src) && !t.src.startsWith("/"))
          )
            throw new z({...Kl, message: Kl.message(t.src)});
          let e;
          if (
            (!t.width && !t.height
              ? (e = "both")
              : !t.width && t.height
              ? (e = "width")
              : t.width && !t.height && (e = "height"),
            e)
          )
            throw new z({...zl, message: zl.message(e, t.src)});
        }
        return (
          t.format || (t.format = dm),
          t.width && (t.width = Math.round(t.width)),
          t.height && (t.height = Math.round(t.height)),
          t
        );
      },
      getHTMLAttributes(t) {
        let {targetWidth: e, targetHeight: r} = fm(t),
          {
            src: n,
            width: s,
            height: i,
            format: o,
            quality: a,
            densities: u,
            widths: c,
            formats: l,
            ...d
          } = t;
        return {
          ...d,
          width: e,
          height: r,
          loading: d.loading ?? "lazy",
          decoding: d.decoding ?? "async",
        };
      },
      getSrcSet(t) {
        let e = [],
          {targetWidth: r} = fm(t),
          {widths: n, densities: s} = t,
          i = t.format ?? dm,
          o = t.width,
          a = 1 / 0;
        hr(t.src) && ((o = t.src.width), (a = o));
        let {width: u, height: c, ...l} = t,
          d = [];
        if (s) {
          let f = s.map((p) => (typeof p == "number" ? p : parseFloat(p))),
            h = f.sort().map((p) => Math.round(r * p));
          d.push(
            ...h.map((p, m) => ({
              maxTargetWidth: Math.min(p, a),
              descriptor: `${f[m]}x`,
            }))
          );
        } else
          n &&
            d.push(
              ...n.map((f) => ({
                maxTargetWidth: Math.min(f, a),
                descriptor: `${f}w`,
              }))
            );
        for (let {maxTargetWidth: f, descriptor: h} of d) {
          let p = {...l};
          f !== o
            ? (p.width = f)
            : t.width &&
              t.height &&
              ((p.width = t.width), (p.height = t.height)),
            e.push({
              transform: p,
              descriptor: h,
              attributes: {type: `image/${i}`},
            });
        }
        return e;
      },
      getURL(t, e) {
        let r = new URLSearchParams();
        if (hr(t.src)) r.append("href", t.src.src);
        else if (sa(t.src, e)) r.append("href", t.src);
        else return t.src;
        return (
          Object.entries({
            w: "width",
            h: "height",
            q: "quality",
            f: "format",
          }).forEach(([i, o]) => {
            t[o] && r.append(i, t[o].toString());
          }),
          `${jr("/", "/_image")}?${r}`
        );
      },
      parseURL(t) {
        let e = t.searchParams;
        return e.has("href")
          ? {
              src: e.get("href"),
              width: e.has("w") ? parseInt(e.get("w")) : void 0,
              height: e.has("h") ? parseInt(e.get("h")) : void 0,
              format: e.get("f"),
              quality: e.get("q"),
            }
          : void 0;
      },
    };
    (C6 = {
      ...A6,
      propertiesToHash: ["src"],
      async transform(t, e) {
        return {data: t, format: e.format};
      },
    }),
      (R6 = C6),
      (N6 = Object.freeze(
        Object.defineProperty(
          {__proto__: null, default: R6},
          Symbol.toStringTag,
          {value: "Module"}
        )
      ));
  });
var Im = {};
vt(Im, {GET: () => QE});
function da() {
  (this._types = Object.create(null)), (this._extensions = Object.create(null));
  for (let t = 0; t < arguments.length; t++) this.define(arguments[t]);
  (this.define = this.define.bind(this)),
    (this.getType = this.getType.bind(this)),
    (this.getExtension = this.getExtension.bind(this));
}
function Mt(t, e, r, n) {
  r = r || 0;
  let s = n ? "BE" : "LE",
    i = "readUInt" + e + s;
  return _6[i](t, r);
}
function $6(t, e) {
  if (t.length - e < 4) return;
  let r = Ie(t, e);
  if (!(t.length - e < r))
    return {name: me(t, 4 + e, 8 + e), offset: e, size: r};
}
function mn(t, e, r) {
  for (; r < t.length; ) {
    let n = $6(t, r);
    if (!n) break;
    if (n.name === e) return n;
    r += n.size;
  }
}
function ym(t, e) {
  let r = t[e];
  return r === 0 ? 256 : r;
}
function xm(t, e) {
  let r = j6 + e * z6;
  return {height: ym(t, r + 1), width: ym(t, r)};
}
function W6(t, e, r) {
  let n = {};
  for (let s = e; s <= r; s += 4) {
    let i = me(t, s, s + 4);
    i in Rm && (n[i] = 1);
  }
  if ("avif" in n) return "avif";
  if ("heic" in n || "heix" in n || "hevc" in n || "hevx" in n) return "heic";
  if ("mif1" in n || "msf1" in n) return "heif";
}
function vm(t, e) {
  let r = e + J6;
  return [me(t, e, r), Ie(t, r)];
}
function wm(t) {
  let e = Z6[t];
  return {width: e, height: e, type: t};
}
function uE(t) {
  return Qn(t, 2, 6) === rE;
}
function cE(t, e) {
  return {height: ua(t, e), width: ua(t, e + 2)};
}
function lE(t, e) {
  let n = dd + 8,
    s = Mt(t, 16, n, e);
  for (let i = 0; i < s; i++) {
    let o = n + aE + i * Sm,
      a = o + Sm;
    if (o > t.length) return;
    let u = t.slice(o, a);
    if (Mt(u, 16, 0, e) === 274)
      return Mt(u, 16, 2, e) !== 3 || Mt(u, 32, 4, e) !== 1
        ? void 0
        : Mt(u, 16, 8, e);
  }
}
function dE(t, e) {
  let r = t.slice(nE, e),
    n = Qn(r, dd, dd + sE),
    s = n === iE;
  if (s || n === oE) return lE(r, s);
}
function fE(t, e) {
  if (e > t.length) throw new TypeError("Corrupt JPG, exceeded buffer limits");
}
function ca(t) {
  let e = vE.exec(t);
  if (e) return Math.round(Number(e[1]) * (Lm[e[2]] || 1));
}
function wE(t) {
  let e = t.split(" ");
  return {height: ca(e[3]), width: ca(e[2])};
}
function SE(t) {
  let e = t.match(oa.width),
    r = t.match(oa.height),
    n = t.match(oa.viewbox);
  return {height: r && ca(r[2]), viewbox: n && wE(n[2]), width: e && ca(e[2])};
}
function EE(t) {
  return {height: t.height, width: t.width};
}
function TE(t, e) {
  let r = e.width / e.height;
  return t.width
    ? {height: Math.floor(t.width / r), width: t.width}
    : t.height
    ? {height: t.height, width: Math.floor(t.height * r)}
    : {height: e.height, width: e.width};
}
function RE(t, e) {
  let r = Mt(t, 32, 4, e);
  return t.slice(r + 2);
}
function NE(t, e) {
  let r = Mt(t, 16, 8, e);
  return (Mt(t, 16, 10, e) << 16) + r;
}
function LE(t) {
  if (t.length > 24) return t.slice(12);
}
function PE(t, e) {
  let r = {},
    n = t;
  for (; n && n.length; ) {
    let s = Mt(n, 16, 0, e),
      i = Mt(n, 16, 2, e),
      o = Mt(n, 32, 4, e);
    if (s === 0) break;
    o === 1 && (i === 3 || i === 4) && (r[s] = NE(n, e)), (n = LE(n));
  }
  return r;
}
function IE(t) {
  let e = me(t, 0, 2);
  if (e === "II") return "LE";
  if (e === "MM") return "BE";
}
function DE(t) {
  return {height: 1 + bm(t, 7), width: 1 + bm(t, 4)};
}
function ME(t) {
  return {
    height: 1 + (((t[4] & 15) << 10) | (t[3] << 2) | ((t[2] & 192) >> 6)),
    width: 1 + (((t[2] & 63) << 8) | t[1]),
  };
}
function _E(t) {
  return {height: gm(t, 8) & 16383, width: gm(t, 6) & 16383};
}
function jE(t) {
  let e = t[0],
    r = HE.get(e);
  return r && la.get(r).validate(t) ? r : FE.find((n) => la.get(n).validate(t));
}
function qE(t) {
  let e = jE(t);
  if (typeof e < "u") {
    if (zE.disabledTypes.indexOf(e) > -1)
      throw new TypeError("disabled file type: " + e);
    let r = la.get(e).calculate(t);
    if (r !== void 0) return (r.type = r.type ?? e), r;
  }
  throw new TypeError("unsupported file type: " + e);
}
async function UE(t) {
  let e = await fetch(t);
  if (!e.body || !e.ok) throw new Error("Failed to fetch image");
  let r = e.body.getReader(),
    n,
    s,
    i = new Uint8Array();
  for (; !n; ) {
    let o = await r.read();
    if (((n = o.done), n)) break;
    if (o.value) {
      s = o.value;
      let a = new Uint8Array(i.length + s.length);
      a.set(i, 0), a.set(s, i.length), (i = a);
      try {
        let u = qE(i);
        if (u) return await r.cancel(), u;
      } catch {}
    }
  }
  throw new Error("Failed to parse the size");
}
async function Pm() {
  if (!globalThis?.astroAsset?.imageService) {
    let {default: t} = await Promise.resolve()
      .then(() => (ia(), hm))
      .then((e) => e.n)
      .catch((e) => {
        let r = new z(Eh);
        throw ((r.cause = e), r);
      });
    return (
      globalThis.astroAsset || (globalThis.astroAsset = {}),
      (globalThis.astroAsset.imageService = t),
      t
    );
  }
  return globalThis.astroAsset.imageService;
}
async function BE(t, e) {
  if (!t || typeof t != "object")
    throw new z({...Bl, message: Bl.message(JSON.stringify(t))});
  if (typeof t.src > "u")
    throw new z({
      ...Gn,
      message: Gn.message(t.src, "undefined", JSON.stringify(t)),
    });
  let r = await Pm(),
    n = {
      ...t,
      src:
        typeof t.src == "object" && "then" in t.src
          ? (await t.src).default ?? (await t.src)
          : t.src,
    };
  if (t.inferSize && na(n.src))
    try {
      let l = await UE(n.src);
      (n.width ??= l.width), (n.height ??= l.height), delete n.inferSize;
    } catch {
      throw new z({...ql, message: ql.message(n.src)});
    }
  let s = hr(n.src) ? n.src.fsPath : n.src,
    i = hr(n.src) ? n.src.clone ?? n.src : n.src;
  n.src = i;
  let o = r.validateOptions ? await r.validateOptions(n, e) : n,
    a = r.getSrcSet ? await r.getSrcSet(o, e) : [],
    u = await r.getURL(o, e),
    c = await Promise.all(
      a.map(async (l) => ({
        transform: l.transform,
        url: await r.getURL(l.transform, e),
        descriptor: l.descriptor,
        attributes: l.attributes,
      }))
    );
  if (
    cd(r) &&
    globalThis.astroAsset.addStaticImage &&
    !(na(o.src) && u === o.src)
  ) {
    let l = r.propertiesToHash ?? ra;
    (u = globalThis.astroAsset.addStaticImage(o, l, s)),
      (c = a.map((d) => ({
        transform: d.transform,
        url: globalThis.astroAsset.addStaticImage(d.transform, l, s),
        descriptor: d.descriptor,
        attributes: d.attributes,
      })));
  }
  return {
    rawOptions: n,
    options: o,
    src: u,
    srcSet: {
      values: c,
      attribute: c.map((l) => `${l.url} ${l.descriptor}`).join(", "),
    },
    attributes:
      r.getHTMLAttributes !== void 0 ? await r.getHTMLAttributes(o, e) : {},
  };
}
async function ZE(t) {
  try {
    let e = await fetch(t);
    return e.ok ? await e.arrayBuffer() : void 0;
  } catch {
    return;
  }
}
var L6,
  P6,
  I6,
  k6,
  O6,
  D6,
  me,
  Qn,
  gm,
  ua,
  rt,
  bm,
  M6,
  Ie,
  gn,
  _6,
  F6,
  H6,
  j6,
  z6,
  Cm,
  q6,
  U6,
  B6,
  V6,
  K6,
  Rm,
  G6,
  Y6,
  X6,
  J6,
  Z6,
  Q6,
  eE,
  tE,
  rE,
  nE,
  dd,
  sE,
  iE,
  oE,
  Sm,
  aE,
  pE,
  hE,
  mE,
  gE,
  Em,
  bE,
  Tm,
  Am,
  yE,
  xE,
  Nm,
  oa,
  ld,
  Lm,
  vE,
  AE,
  CE,
  kE,
  OE,
  $E,
  la,
  FE,
  HE,
  zE,
  VE,
  KE,
  WE,
  GE,
  YE,
  XE,
  aa,
  JE,
  fd,
  QE,
  km = b(() => {
    "use strict";
    ia();
    Xn();
    Kn();
    da.prototype.define = function (t, e) {
      for (let r in t) {
        let n = t[r].map(function (s) {
          return s.toLowerCase();
        });
        r = r.toLowerCase();
        for (let s = 0; s < n.length; s++) {
          let i = n[s];
          if (i[0] !== "*") {
            if (!e && i in this._types)
              throw new Error(
                'Attempt to change mapping for "' +
                  i +
                  '" extension from "' +
                  this._types[i] +
                  '" to "' +
                  r +
                  '". Pass `force=true` to allow this, otherwise remove "' +
                  i +
                  '" from the list of extensions for "' +
                  r +
                  '".'
              );
            this._types[i] = r;
          }
        }
        if (e || !this._extensions[r]) {
          let s = n[0];
          this._extensions[r] = s[0] !== "*" ? s : s.substr(1);
        }
      }
    };
    da.prototype.getType = function (t) {
      t = String(t);
      let e = t.replace(/^.*[/\\]/, "").toLowerCase(),
        r = e.replace(/^.*\./, "").toLowerCase(),
        n = e.length < t.length;
      return ((r.length < e.length - 1 || !n) && this._types[r]) || null;
    };
    da.prototype.getExtension = function (t) {
      return (
        (t = /^\s*([^;\s]*)/.test(t) && RegExp.$1),
        (t && this._extensions[t.toLowerCase()]) || null
      );
    };
    (L6 = da),
      (P6 = {
        "application/andrew-inset": ["ez"],
        "application/applixware": ["aw"],
        "application/atom+xml": ["atom"],
        "application/atomcat+xml": ["atomcat"],
        "application/atomdeleted+xml": ["atomdeleted"],
        "application/atomsvc+xml": ["atomsvc"],
        "application/atsc-dwd+xml": ["dwd"],
        "application/atsc-held+xml": ["held"],
        "application/atsc-rsat+xml": ["rsat"],
        "application/bdoc": ["bdoc"],
        "application/calendar+xml": ["xcs"],
        "application/ccxml+xml": ["ccxml"],
        "application/cdfx+xml": ["cdfx"],
        "application/cdmi-capability": ["cdmia"],
        "application/cdmi-container": ["cdmic"],
        "application/cdmi-domain": ["cdmid"],
        "application/cdmi-object": ["cdmio"],
        "application/cdmi-queue": ["cdmiq"],
        "application/cu-seeme": ["cu"],
        "application/dash+xml": ["mpd"],
        "application/davmount+xml": ["davmount"],
        "application/docbook+xml": ["dbk"],
        "application/dssc+der": ["dssc"],
        "application/dssc+xml": ["xdssc"],
        "application/ecmascript": ["es", "ecma"],
        "application/emma+xml": ["emma"],
        "application/emotionml+xml": ["emotionml"],
        "application/epub+zip": ["epub"],
        "application/exi": ["exi"],
        "application/express": ["exp"],
        "application/fdt+xml": ["fdt"],
        "application/font-tdpfr": ["pfr"],
        "application/geo+json": ["geojson"],
        "application/gml+xml": ["gml"],
        "application/gpx+xml": ["gpx"],
        "application/gxf": ["gxf"],
        "application/gzip": ["gz"],
        "application/hjson": ["hjson"],
        "application/hyperstudio": ["stk"],
        "application/inkml+xml": ["ink", "inkml"],
        "application/ipfix": ["ipfix"],
        "application/its+xml": ["its"],
        "application/java-archive": ["jar", "war", "ear"],
        "application/java-serialized-object": ["ser"],
        "application/java-vm": ["class"],
        "application/javascript": ["js", "mjs"],
        "application/json": ["json", "map"],
        "application/json5": ["json5"],
        "application/jsonml+json": ["jsonml"],
        "application/ld+json": ["jsonld"],
        "application/lgr+xml": ["lgr"],
        "application/lost+xml": ["lostxml"],
        "application/mac-binhex40": ["hqx"],
        "application/mac-compactpro": ["cpt"],
        "application/mads+xml": ["mads"],
        "application/manifest+json": ["webmanifest"],
        "application/marc": ["mrc"],
        "application/marcxml+xml": ["mrcx"],
        "application/mathematica": ["ma", "nb", "mb"],
        "application/mathml+xml": ["mathml"],
        "application/mbox": ["mbox"],
        "application/mediaservercontrol+xml": ["mscml"],
        "application/metalink+xml": ["metalink"],
        "application/metalink4+xml": ["meta4"],
        "application/mets+xml": ["mets"],
        "application/mmt-aei+xml": ["maei"],
        "application/mmt-usd+xml": ["musd"],
        "application/mods+xml": ["mods"],
        "application/mp21": ["m21", "mp21"],
        "application/mp4": ["mp4s", "m4p"],
        "application/msword": ["doc", "dot"],
        "application/mxf": ["mxf"],
        "application/n-quads": ["nq"],
        "application/n-triples": ["nt"],
        "application/node": ["cjs"],
        "application/octet-stream": [
          "bin",
          "dms",
          "lrf",
          "mar",
          "so",
          "dist",
          "distz",
          "pkg",
          "bpk",
          "dump",
          "elc",
          "deploy",
          "exe",
          "dll",
          "deb",
          "dmg",
          "iso",
          "img",
          "msi",
          "msp",
          "msm",
          "buffer",
        ],
        "application/oda": ["oda"],
        "application/oebps-package+xml": ["opf"],
        "application/ogg": ["ogx"],
        "application/omdoc+xml": ["omdoc"],
        "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"],
        "application/oxps": ["oxps"],
        "application/p2p-overlay+xml": ["relo"],
        "application/patch-ops-error+xml": ["xer"],
        "application/pdf": ["pdf"],
        "application/pgp-encrypted": ["pgp"],
        "application/pgp-signature": ["asc", "sig"],
        "application/pics-rules": ["prf"],
        "application/pkcs10": ["p10"],
        "application/pkcs7-mime": ["p7m", "p7c"],
        "application/pkcs7-signature": ["p7s"],
        "application/pkcs8": ["p8"],
        "application/pkix-attr-cert": ["ac"],
        "application/pkix-cert": ["cer"],
        "application/pkix-crl": ["crl"],
        "application/pkix-pkipath": ["pkipath"],
        "application/pkixcmp": ["pki"],
        "application/pls+xml": ["pls"],
        "application/postscript": ["ai", "eps", "ps"],
        "application/provenance+xml": ["provx"],
        "application/pskc+xml": ["pskcxml"],
        "application/raml+yaml": ["raml"],
        "application/rdf+xml": ["rdf", "owl"],
        "application/reginfo+xml": ["rif"],
        "application/relax-ng-compact-syntax": ["rnc"],
        "application/resource-lists+xml": ["rl"],
        "application/resource-lists-diff+xml": ["rld"],
        "application/rls-services+xml": ["rs"],
        "application/route-apd+xml": ["rapd"],
        "application/route-s-tsid+xml": ["sls"],
        "application/route-usd+xml": ["rusd"],
        "application/rpki-ghostbusters": ["gbr"],
        "application/rpki-manifest": ["mft"],
        "application/rpki-roa": ["roa"],
        "application/rsd+xml": ["rsd"],
        "application/rss+xml": ["rss"],
        "application/rtf": ["rtf"],
        "application/sbml+xml": ["sbml"],
        "application/scvp-cv-request": ["scq"],
        "application/scvp-cv-response": ["scs"],
        "application/scvp-vp-request": ["spq"],
        "application/scvp-vp-response": ["spp"],
        "application/sdp": ["sdp"],
        "application/senml+xml": ["senmlx"],
        "application/sensml+xml": ["sensmlx"],
        "application/set-payment-initiation": ["setpay"],
        "application/set-registration-initiation": ["setreg"],
        "application/shf+xml": ["shf"],
        "application/sieve": ["siv", "sieve"],
        "application/smil+xml": ["smi", "smil"],
        "application/sparql-query": ["rq"],
        "application/sparql-results+xml": ["srx"],
        "application/srgs": ["gram"],
        "application/srgs+xml": ["grxml"],
        "application/sru+xml": ["sru"],
        "application/ssdl+xml": ["ssdl"],
        "application/ssml+xml": ["ssml"],
        "application/swid+xml": ["swidtag"],
        "application/tei+xml": ["tei", "teicorpus"],
        "application/thraud+xml": ["tfi"],
        "application/timestamped-data": ["tsd"],
        "application/toml": ["toml"],
        "application/trig": ["trig"],
        "application/ttml+xml": ["ttml"],
        "application/ubjson": ["ubj"],
        "application/urc-ressheet+xml": ["rsheet"],
        "application/urc-targetdesc+xml": ["td"],
        "application/voicexml+xml": ["vxml"],
        "application/wasm": ["wasm"],
        "application/widget": ["wgt"],
        "application/winhlp": ["hlp"],
        "application/wsdl+xml": ["wsdl"],
        "application/wspolicy+xml": ["wspolicy"],
        "application/xaml+xml": ["xaml"],
        "application/xcap-att+xml": ["xav"],
        "application/xcap-caps+xml": ["xca"],
        "application/xcap-diff+xml": ["xdf"],
        "application/xcap-el+xml": ["xel"],
        "application/xcap-ns+xml": ["xns"],
        "application/xenc+xml": ["xenc"],
        "application/xhtml+xml": ["xhtml", "xht"],
        "application/xliff+xml": ["xlf"],
        "application/xml": ["xml", "xsl", "xsd", "rng"],
        "application/xml-dtd": ["dtd"],
        "application/xop+xml": ["xop"],
        "application/xproc+xml": ["xpl"],
        "application/xslt+xml": ["*xsl", "xslt"],
        "application/xspf+xml": ["xspf"],
        "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"],
        "application/yang": ["yang"],
        "application/yin+xml": ["yin"],
        "application/zip": ["zip"],
        "audio/3gpp": ["*3gpp"],
        "audio/adpcm": ["adp"],
        "audio/amr": ["amr"],
        "audio/basic": ["au", "snd"],
        "audio/midi": ["mid", "midi", "kar", "rmi"],
        "audio/mobile-xmf": ["mxmf"],
        "audio/mp3": ["*mp3"],
        "audio/mp4": ["m4a", "mp4a"],
        "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"],
        "audio/ogg": ["oga", "ogg", "spx", "opus"],
        "audio/s3m": ["s3m"],
        "audio/silk": ["sil"],
        "audio/wav": ["wav"],
        "audio/wave": ["*wav"],
        "audio/webm": ["weba"],
        "audio/xm": ["xm"],
        "font/collection": ["ttc"],
        "font/otf": ["otf"],
        "font/ttf": ["ttf"],
        "font/woff": ["woff"],
        "font/woff2": ["woff2"],
        "image/aces": ["exr"],
        "image/apng": ["apng"],
        "image/avif": ["avif"],
        "image/bmp": ["bmp"],
        "image/cgm": ["cgm"],
        "image/dicom-rle": ["drle"],
        "image/emf": ["emf"],
        "image/fits": ["fits"],
        "image/g3fax": ["g3"],
        "image/gif": ["gif"],
        "image/heic": ["heic"],
        "image/heic-sequence": ["heics"],
        "image/heif": ["heif"],
        "image/heif-sequence": ["heifs"],
        "image/hej2k": ["hej2"],
        "image/hsj2": ["hsj2"],
        "image/ief": ["ief"],
        "image/jls": ["jls"],
        "image/jp2": ["jp2", "jpg2"],
        "image/jpeg": ["jpeg", "jpg", "jpe"],
        "image/jph": ["jph"],
        "image/jphc": ["jhc"],
        "image/jpm": ["jpm"],
        "image/jpx": ["jpx", "jpf"],
        "image/jxr": ["jxr"],
        "image/jxra": ["jxra"],
        "image/jxrs": ["jxrs"],
        "image/jxs": ["jxs"],
        "image/jxsc": ["jxsc"],
        "image/jxsi": ["jxsi"],
        "image/jxss": ["jxss"],
        "image/ktx": ["ktx"],
        "image/ktx2": ["ktx2"],
        "image/png": ["png"],
        "image/sgi": ["sgi"],
        "image/svg+xml": ["svg", "svgz"],
        "image/t38": ["t38"],
        "image/tiff": ["tif", "tiff"],
        "image/tiff-fx": ["tfx"],
        "image/webp": ["webp"],
        "image/wmf": ["wmf"],
        "message/disposition-notification": ["disposition-notification"],
        "message/global": ["u8msg"],
        "message/global-delivery-status": ["u8dsn"],
        "message/global-disposition-notification": ["u8mdn"],
        "message/global-headers": ["u8hdr"],
        "message/rfc822": ["eml", "mime"],
        "model/3mf": ["3mf"],
        "model/gltf+json": ["gltf"],
        "model/gltf-binary": ["glb"],
        "model/iges": ["igs", "iges"],
        "model/mesh": ["msh", "mesh", "silo"],
        "model/mtl": ["mtl"],
        "model/obj": ["obj"],
        "model/step+xml": ["stpx"],
        "model/step+zip": ["stpz"],
        "model/step-xml+zip": ["stpxz"],
        "model/stl": ["stl"],
        "model/vrml": ["wrl", "vrml"],
        "model/x3d+binary": ["*x3db", "x3dbz"],
        "model/x3d+fastinfoset": ["x3db"],
        "model/x3d+vrml": ["*x3dv", "x3dvz"],
        "model/x3d+xml": ["x3d", "x3dz"],
        "model/x3d-vrml": ["x3dv"],
        "text/cache-manifest": ["appcache", "manifest"],
        "text/calendar": ["ics", "ifb"],
        "text/coffeescript": ["coffee", "litcoffee"],
        "text/css": ["css"],
        "text/csv": ["csv"],
        "text/html": ["html", "htm", "shtml"],
        "text/jade": ["jade"],
        "text/jsx": ["jsx"],
        "text/less": ["less"],
        "text/markdown": ["markdown", "md"],
        "text/mathml": ["mml"],
        "text/mdx": ["mdx"],
        "text/n3": ["n3"],
        "text/plain": [
          "txt",
          "text",
          "conf",
          "def",
          "list",
          "log",
          "in",
          "ini",
        ],
        "text/richtext": ["rtx"],
        "text/rtf": ["*rtf"],
        "text/sgml": ["sgml", "sgm"],
        "text/shex": ["shex"],
        "text/slim": ["slim", "slm"],
        "text/spdx": ["spdx"],
        "text/stylus": ["stylus", "styl"],
        "text/tab-separated-values": ["tsv"],
        "text/troff": ["t", "tr", "roff", "man", "me", "ms"],
        "text/turtle": ["ttl"],
        "text/uri-list": ["uri", "uris", "urls"],
        "text/vcard": ["vcard"],
        "text/vtt": ["vtt"],
        "text/xml": ["*xml"],
        "text/yaml": ["yaml", "yml"],
        "video/3gpp": ["3gp", "3gpp"],
        "video/3gpp2": ["3g2"],
        "video/h261": ["h261"],
        "video/h263": ["h263"],
        "video/h264": ["h264"],
        "video/iso.segment": ["m4s"],
        "video/jpeg": ["jpgv"],
        "video/jpm": ["*jpm", "jpgm"],
        "video/mj2": ["mj2", "mjp2"],
        "video/mp2t": ["ts"],
        "video/mp4": ["mp4", "mp4v", "mpg4"],
        "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"],
        "video/ogg": ["ogv"],
        "video/quicktime": ["qt", "mov"],
        "video/webm": ["webm"],
      }),
      (I6 = L6),
      (k6 = new I6(P6)),
      (O6 = rm(k6)),
      (D6 = new TextDecoder()),
      (me = (t, e = 0, r = t.length) => D6.decode(t.slice(e, r))),
      (Qn = (t, e = 0, r = t.length) =>
        t
          .slice(e, r)
          .reduce((n, s) => n + ("0" + s.toString(16)).slice(-2), "")),
      (gm = (t, e = 0) => {
        let r = t[e] + t[e + 1] * 256;
        return r | ((r & (2 ** 15)) * 131070);
      }),
      (ua = (t, e = 0) => t[e] * 2 ** 8 + t[e + 1]),
      (rt = (t, e = 0) => t[e] + t[e + 1] * 2 ** 8),
      (bm = (t, e = 0) => t[e] + t[e + 1] * 2 ** 8 + t[e + 2] * 2 ** 16),
      (M6 = (t, e = 0) =>
        t[e] + t[e + 1] * 2 ** 8 + t[e + 2] * 2 ** 16 + (t[e + 3] << 24)),
      (Ie = (t, e = 0) =>
        t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3]),
      (gn = (t, e = 0) =>
        t[e] + t[e + 1] * 2 ** 8 + t[e + 2] * 2 ** 16 + t[e + 3] * 2 ** 24),
      (_6 = {
        readUInt16BE: ua,
        readUInt16LE: rt,
        readUInt32BE: Ie,
        readUInt32LE: gn,
      });
    (F6 = {
      validate: (t) => me(t, 0, 2) === "BM",
      calculate: (t) => ({height: Math.abs(M6(t, 22)), width: gn(t, 18)}),
    }),
      (H6 = 1),
      (j6 = 6),
      (z6 = 16);
    (Cm = {
      validate(t) {
        let e = rt(t, 0),
          r = rt(t, 4);
        return e !== 0 || r === 0 ? !1 : rt(t, 2) === H6;
      },
      calculate(t) {
        let e = rt(t, 4),
          r = xm(t, 0);
        if (e === 1) return r;
        let n = [r];
        for (let s = 1; s < e; s += 1) n.push(xm(t, s));
        return {height: r.height, images: n, width: r.width};
      },
    }),
      (q6 = 2),
      (U6 = {
        validate(t) {
          let e = rt(t, 0),
            r = rt(t, 4);
          return e !== 0 || r === 0 ? !1 : rt(t, 2) === q6;
        },
        calculate: (t) => Cm.calculate(t),
      }),
      (B6 = {
        validate: (t) => gn(t, 0) === 542327876,
        calculate: (t) => ({height: gn(t, 12), width: gn(t, 16)}),
      }),
      (V6 = /^GIF8[79]a/),
      (K6 = {
        validate: (t) => V6.test(me(t, 0, 6)),
        calculate: (t) => ({height: rt(t, 8), width: rt(t, 6)}),
      }),
      (Rm = {
        avif: "avif",
        mif1: "heif",
        msf1: "heif",
        heic: "heic",
        heix: "heic",
        hevc: "heic",
        hevx: "heic",
      });
    (G6 = {
      validate(t) {
        let e = me(t, 4, 8),
          r = me(t, 8, 12);
        return e === "ftyp" && r in Rm;
      },
      calculate(t) {
        let e = mn(t, "meta", 0),
          r = e && mn(t, "iprp", e.offset + 12),
          n = r && mn(t, "ipco", r.offset + 8),
          s = n && mn(t, "ispe", n.offset + 8);
        if (s)
          return {
            height: Ie(t, s.offset + 16),
            width: Ie(t, s.offset + 12),
            type: W6(t, 8, e.offset),
          };
        throw new TypeError("Invalid HEIF, no size found");
      },
    }),
      (Y6 = 8),
      (X6 = 4),
      (J6 = 4),
      (Z6 = {
        ICON: 32,
        "ICN#": 32,
        "icm#": 16,
        icm4: 16,
        icm8: 16,
        "ics#": 16,
        ics4: 16,
        ics8: 16,
        is32: 16,
        s8mk: 16,
        icp4: 16,
        icl4: 32,
        icl8: 32,
        il32: 32,
        l8mk: 32,
        icp5: 32,
        ic11: 32,
        ich4: 48,
        ich8: 48,
        ih32: 48,
        h8mk: 48,
        icp6: 64,
        ic12: 32,
        it32: 128,
        t8mk: 128,
        ic07: 128,
        ic08: 256,
        ic13: 256,
        ic09: 512,
        ic14: 512,
        ic10: 1024,
      });
    (Q6 = {
      validate: (t) => me(t, 0, 4) === "icns",
      calculate(t) {
        let e = t.length,
          r = Ie(t, X6),
          n = Y6,
          s = vm(t, n),
          i = wm(s[0]);
        if (((n += s[1]), n === r)) return i;
        let o = {height: i.height, images: [i], width: i.width};
        for (; n < r && n < e; )
          (s = vm(t, n)), (i = wm(s[0])), (n += s[1]), o.images.push(i);
        return o;
      },
    }),
      (eE = {
        validate: (t) => Qn(t, 0, 4) === "ff4fff51",
        calculate: (t) => ({height: Ie(t, 12), width: Ie(t, 8)}),
      }),
      (tE = {
        validate(t) {
          if (Ie(t, 4) !== 1783636e3 || Ie(t, 0) < 1) return !1;
          let e = mn(t, "ftyp", 0);
          return e ? Ie(t, e.offset + 4) === 1718909296 : !1;
        },
        calculate(t) {
          let e = mn(t, "jp2h", 0),
            r = e && mn(t, "ihdr", e.offset + 8);
          if (r)
            return {height: Ie(t, r.offset + 8), width: Ie(t, r.offset + 12)};
          throw new TypeError("Unsupported JPEG 2000 format");
        },
      }),
      (rE = "45786966"),
      (nE = 2),
      (dd = 6),
      (sE = 2),
      (iE = "4d4d"),
      (oE = "4949"),
      (Sm = 12),
      (aE = 2);
    (pE = {
      validate: (t) => Qn(t, 0, 2) === "ffd8",
      calculate(t) {
        t = t.slice(4);
        let e, r;
        for (; t.length; ) {
          let n = ua(t, 0);
          if (t[n] !== 255) {
            t = t.slice(1);
            continue;
          }
          if (
            (uE(t) && (e = dE(t, n)),
            fE(t, n),
            (r = t[n + 1]),
            r === 192 || r === 193 || r === 194)
          ) {
            let s = cE(t, n + 5);
            return e ? {height: s.height, orientation: e, width: s.width} : s;
          }
          t = t.slice(n + 2);
        }
        throw new TypeError("Invalid JPG, no size found");
      },
    }),
      (hE = {
        validate: (t) => {
          let e = me(t, 1, 7);
          return ["KTX 11", "KTX 20"].includes(e);
        },
        calculate: (t) => {
          let e = t[5] === 49 ? "ktx" : "ktx2",
            r = e === "ktx" ? 36 : 20;
          return {height: gn(t, r + 4), width: gn(t, r), type: e};
        },
      }),
      (mE = `PNG\r

`),
      (gE = "IHDR"),
      (Em = "CgBI"),
      (bE = {
        validate(t) {
          if (mE === me(t, 1, 8)) {
            let e = me(t, 12, 16);
            if ((e === Em && (e = me(t, 28, 32)), e !== gE))
              throw new TypeError("Invalid PNG");
            return !0;
          }
          return !1;
        },
        calculate(t) {
          return me(t, 12, 16) === Em
            ? {height: Ie(t, 36), width: Ie(t, 32)}
            : {height: Ie(t, 20), width: Ie(t, 16)};
        },
      }),
      (Tm = {
        P1: "pbm/ascii",
        P2: "pgm/ascii",
        P3: "ppm/ascii",
        P4: "pbm",
        P5: "pgm",
        P6: "ppm",
        P7: "pam",
        PF: "pfm",
      }),
      (Am = {
        default: (t) => {
          let e = [];
          for (; t.length > 0; ) {
            let r = t.shift();
            if (r[0] !== "#") {
              e = r.split(" ");
              break;
            }
          }
          if (e.length === 2)
            return {height: parseInt(e[1], 10), width: parseInt(e[0], 10)};
          throw new TypeError("Invalid PNM");
        },
        pam: (t) => {
          let e = {};
          for (; t.length > 0; ) {
            let r = t.shift();
            if (r.length > 16 || r.charCodeAt(0) > 128) continue;
            let [n, s] = r.split(" ");
            if (
              (n && s && (e[n.toLowerCase()] = parseInt(s, 10)),
              e.height && e.width)
            )
              break;
          }
          if (e.height && e.width) return {height: e.height, width: e.width};
          throw new TypeError("Invalid PAM");
        },
      }),
      (yE = {
        validate: (t) => me(t, 0, 2) in Tm,
        calculate(t) {
          let e = me(t, 0, 2),
            r = Tm[e],
            n = me(t, 3).split(/[\r\n]+/);
          return (Am[r] || Am.default)(n);
        },
      }),
      (xE = {
        validate: (t) => me(t, 0, 4) === "8BPS",
        calculate: (t) => ({height: Ie(t, 14), width: Ie(t, 18)}),
      }),
      (Nm = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/),
      (oa = {
        height: /\sheight=(['"])([^%]+?)\1/,
        root: Nm,
        viewbox: /\sviewBox=(['"])(.+?)\1/i,
        width: /\swidth=(['"])([^%]+?)\1/,
      }),
      (ld = 2.54),
      (Lm = {
        in: 96,
        cm: 96 / ld,
        em: 16,
        ex: 8,
        m: (96 / ld) * 100,
        mm: 96 / ld / 10,
        pc: 96 / 72 / 12,
        pt: 96 / 72,
        px: 1,
      }),
      (vE = new RegExp(`^([0-9.]+(?:e\\d+)?)(${Object.keys(Lm).join("|")})?$`));
    (AE = {
      validate: (t) => Nm.test(me(t, 0, 1e3)),
      calculate(t) {
        let e = me(t).match(oa.root);
        if (e) {
          let r = SE(e[0]);
          if (r.width && r.height) return EE(r);
          if (r.viewbox) return TE(r, r.viewbox);
        }
        throw new TypeError("Invalid SVG");
      },
    }),
      (CE = {
        validate(t) {
          return rt(t, 0) === 0 && rt(t, 4) === 0;
        },
        calculate(t) {
          return {height: rt(t, 14), width: rt(t, 12)};
        },
      });
    (kE = ["49492a00", "4d4d002a"]),
      (OE = {
        validate: (t) => kE.includes(Qn(t, 0, 4)),
        calculate(t) {
          let e = IE(t) === "BE",
            r = RE(t, e),
            n = PE(r, e),
            s = n[256],
            i = n[257];
          if (!s || !i) throw new TypeError("Invalid Tiff. Missing tags");
          return {height: i, width: s};
        },
      });
    ($E = {
      validate(t) {
        let e = me(t, 0, 4) === "RIFF",
          r = me(t, 8, 12) === "WEBP",
          n = me(t, 12, 15) === "VP8";
        return e && r && n;
      },
      calculate(t) {
        let e = me(t, 12, 16);
        if (((t = t.slice(20, 30)), e === "VP8X")) {
          let n = t[0],
            s = (n & 192) === 0,
            i = (n & 1) === 0;
          if (s && i) return DE(t);
          throw new TypeError("Invalid WebP");
        }
        if (e === "VP8 " && t[0] !== 47) return _E(t);
        let r = Qn(t, 3, 6);
        if (e === "VP8L" && r !== "9d012a") return ME(t);
        throw new TypeError("Invalid WebP");
      },
    }),
      (la = new Map([
        ["bmp", F6],
        ["cur", U6],
        ["dds", B6],
        ["gif", K6],
        ["heif", G6],
        ["icns", Q6],
        ["ico", Cm],
        ["j2c", eE],
        ["jp2", tE],
        ["jpg", pE],
        ["ktx", hE],
        ["png", bE],
        ["pnm", yE],
        ["psd", xE],
        ["svg", AE],
        ["tga", CE],
        ["tiff", OE],
        ["webp", $E],
      ])),
      (FE = Array.from(la.keys())),
      (HE = new Map([
        [56, "psd"],
        [66, "bmp"],
        [68, "dds"],
        [71, "gif"],
        [73, "tiff"],
        [77, "tiff"],
        [82, "webp"],
        [105, "icns"],
        [137, "png"],
        [255, "jpg"],
      ]));
    zE = {disabledTypes: []};
    (VE = (t) => {
      let e = t.length,
        r = 0,
        n = 0,
        s = 8997,
        i = 0,
        o = 33826,
        a = 0,
        u = 40164,
        c = 0,
        l = 52210;
      for (; r < e; )
        (s ^= t.charCodeAt(r++)),
          (n = s * 435),
          (i = o * 435),
          (a = u * 435),
          (c = l * 435),
          (a += s << 8),
          (c += o << 8),
          (i += n >>> 16),
          (s = n & 65535),
          (a += i >>> 16),
          (o = i & 65535),
          (l = (c + (a >>> 16)) & 65535),
          (u = a & 65535);
      return (
        (l & 15) * 281474976710656 + u * 4294967296 + o * 65536 + (s ^ (l >> 4))
      );
    }),
      (KE = (t, e = !1) =>
        (e ? 'W/"' : '"') + VE(t).toString(36) + t.length.toString(36) + '"'),
      (WE = pr("https://localhost:4321")),
      (GE = fr(
        async (t, e, r) => {
          let n = t.createAstro(WE, e, r);
          n.self = GE;
          let s = n.props;
          if (s.alt === void 0 || s.alt === null) throw new z(jl);
          typeof s.width == "string" && (s.width = parseInt(s.width)),
            typeof s.height == "string" && (s.height = parseInt(s.height));
          let i = await fd(s),
            o = {};
          return (
            i.srcSet.values.length > 0 && (o.srcset = i.srcSet.attribute),
            he`${pn()}<img${Xe(i.src, "src")}${Hr(o)}${Hr(i.attributes)}>`
          );
        },
        "/Users/willkelly/Documents/Work/Code/biel-frontend/node_modules/.pnpm/astro@4.5.9_sass@1.72.0_typescript@5.4.3/node_modules/astro/components/Image.astro",
        void 0
      )),
      (YE = pr("https://localhost:4321")),
      (XE = fr(
        async (t, e, r) => {
          let n = t.createAstro(YE, e, r);
          n.self = XE;
          let s = ["webp"],
            i = "png",
            o = ["gif", "svg", "jpg", "jpeg"],
            {
              formats: a = s,
              pictureAttributes: u = {},
              fallbackFormat: c,
              ...l
            } = n.props;
          if (l.alt === void 0 || l.alt === null) throw new z(jl);
          let d = await Promise.all(
              a.map(
                async (g) =>
                  await fd({
                    ...l,
                    format: g,
                    widths: l.widths,
                    densities: l.densities,
                  })
              )
            ),
            f = c ?? i;
          !c && hr(l.src) && o.includes(l.src.format) && (f = l.src.format);
          let h = await fd({
              ...l,
              format: f,
              widths: l.widths,
              densities: l.densities,
            }),
            p = {},
            m = {};
          return (
            l.sizes && (m.sizes = l.sizes),
            h.srcSet.values.length > 0 && (p.srcset = h.srcSet.attribute),
            he`${pn()}<picture${Hr(u)}> ${Object.entries(d).map(([g, x]) => {
              let y =
                l.densities || (!l.densities && !l.widths)
                  ? `${x.src}${
                      x.srcSet.values.length > 0
                        ? ", " + x.srcSet.attribute
                        : ""
                    }`
                  : x.srcSet.attribute;
              return he`<source${Xe(y, "srcset")}${Xe(
                "image/" + x.options.format,
                "type"
              )}${Hr(m)}>`;
            })} <img${Xe(h.src, "src")}${Hr(p)}${Hr(h.attributes)}> </picture>`
          );
        },
        "/Users/willkelly/Documents/Work/Code/biel-frontend/node_modules/.pnpm/astro@4.5.9_sass@1.72.0_typescript@5.4.3/node_modules/astro/components/Picture.astro",
        void 0
      )),
      (aa = {
        service: {entrypoint: "astro/assets/services/noop", config: {}},
        domains: [],
        remotePatterns: [],
      }),
      (JE = new URL(
        "file:///Users/willkelly/Documents/Work/Code/biel-frontend/dist/"
      ));
    new URL("_astro", JE);
    fd = async (t) => await BE(t, aa);
    QE = async ({request: t}) => {
      try {
        let e = await Pm();
        if (!("transform" in e))
          throw new Error("Configured image service is not a local service");
        let r = new URL(t.url),
          n = await e.parseURL(r, aa);
        if (!n?.src)
          throw new Error("Incorrect transform returned by `parseURL`");
        let s,
          i = Zn(n.src) ? new URL(n.src) : new URL(n.src, r.origin);
        if (Zn(n.src) && sa(n.src, aa) === !1)
          return new Response("Forbidden", {status: 403});
        if (((s = await ZE(i)), !s))
          return new Response("Not Found", {status: 404});
        let {data: o, format: a} = await e.transform(new Uint8Array(s), n, aa);
        return new Response(o, {
          status: 200,
          headers: {
            "Content-Type": O6.getType(a) ?? `image/${a}`,
            "Cache-Control": "public, max-age=31536000",
            ETag: KE(o.toString()),
            Date: new Date().toUTCString(),
          },
        });
      } catch (e) {
        return (
          console.error("Could not process image request:", e),
          new Response(`Server Error: ${e}`, {status: 500})
        );
      }
    };
  });
var Om = {};
vt(Om, {page: () => e4, renderers: () => St});
var e4,
  Dm = b(() => {
    "use strict";
    un();
    e4 = () => Promise.resolve().then(() => (km(), Im));
  });
var fa = {};
vt(fa, {_: () => t4, a: () => r4, i: () => n4});
var pd,
  t4,
  r4,
  n4,
  pa = b(() => {
    "use strict";
    (pd = () => {}), (t4 = pd), (r4 = pd), (n4 = pd);
  });
var Mm = {};
vt(Mm, {page: () => s4, renderers: () => St});
var s4,
  _m = b(() => {
    "use strict";
    un();
    s4 = () =>
      Promise.resolve()
        .then(() => (pa(), fa))
        .then((t) => t._);
  });
var es,
  zr,
  Je,
  Zs,
  ha,
  qr,
  Qs,
  _,
  ts,
  rs,
  ft,
  _t,
  Qt,
  I,
  hd,
  ie,
  Re,
  bn,
  Oe,
  ma,
  Ur,
  Y,
  ee = b(() => {
    (es = Symbol("changed")),
      (zr = Symbol("classList")),
      (Je = Symbol("CustomElements")),
      (Zs = Symbol("content")),
      (ha = Symbol("dataset")),
      (qr = Symbol("doctype")),
      (Qs = Symbol("DOMParser")),
      (_ = Symbol("end")),
      (ts = Symbol("EventTarget")),
      (rs = Symbol("globals")),
      (ft = Symbol("image")),
      (_t = Symbol("mime")),
      (Qt = Symbol("MutationObserver")),
      (I = Symbol("next")),
      (hd = Symbol("ownerElement")),
      (ie = Symbol("prev")),
      (Re = Symbol("private")),
      (bn = Symbol("sheet")),
      (Oe = Symbol("start")),
      (ma = Symbol("style")),
      (Ur = Symbol("upgrade")),
      (Y = Symbol("value"));
  });
var ga,
  $m = b(() => {
    ga = new Uint16Array(
      '\u1D41<\xD5\u0131\u028A\u049D\u057B\u05D0\u0675\u06DE\u07A2\u07D6\u080F\u0A4A\u0A91\u0DA1\u0E6D\u0F09\u0F26\u10CA\u1228\u12E1\u1415\u149D\u14C3\u14DF\u1525\0\0\0\0\0\0\u156B\u16CD\u198D\u1C12\u1DDD\u1F7E\u2060\u21B0\u228D\u23C0\u23FB\u2442\u2824\u2912\u2D08\u2E48\u2FCE\u3016\u32BA\u3639\u37AC\u38FE\u3A28\u3A71\u3AE0\u3B2E\u0800EMabcfglmnoprstu\\bfms\x7F\x84\x8B\x90\x95\x98\xA6\xB3\xB9\xC8\xCFlig\u803B\xC6\u40C6P\u803B&\u4026cute\u803B\xC1\u40C1reve;\u4102\u0100iyx}rc\u803B\xC2\u40C2;\u4410r;\uC000\u{1D504}rave\u803B\xC0\u40C0pha;\u4391acr;\u4100d;\u6A53\u0100gp\x9D\xA1on;\u4104f;\uC000\u{1D538}plyFunction;\u6061ing\u803B\xC5\u40C5\u0100cs\xBE\xC3r;\uC000\u{1D49C}ign;\u6254ilde\u803B\xC3\u40C3ml\u803B\xC4\u40C4\u0400aceforsu\xE5\xFB\xFE\u0117\u011C\u0122\u0127\u012A\u0100cr\xEA\xF2kslash;\u6216\u0176\xF6\xF8;\u6AE7ed;\u6306y;\u4411\u0180crt\u0105\u010B\u0114ause;\u6235noullis;\u612Ca;\u4392r;\uC000\u{1D505}pf;\uC000\u{1D539}eve;\u42D8c\xF2\u0113mpeq;\u624E\u0700HOacdefhilorsu\u014D\u0151\u0156\u0180\u019E\u01A2\u01B5\u01B7\u01BA\u01DC\u0215\u0273\u0278\u027Ecy;\u4427PY\u803B\xA9\u40A9\u0180cpy\u015D\u0162\u017Aute;\u4106\u0100;i\u0167\u0168\u62D2talDifferentialD;\u6145leys;\u612D\u0200aeio\u0189\u018E\u0194\u0198ron;\u410Cdil\u803B\xC7\u40C7rc;\u4108nint;\u6230ot;\u410A\u0100dn\u01A7\u01ADilla;\u40B8terDot;\u40B7\xF2\u017Fi;\u43A7rcle\u0200DMPT\u01C7\u01CB\u01D1\u01D6ot;\u6299inus;\u6296lus;\u6295imes;\u6297o\u0100cs\u01E2\u01F8kwiseContourIntegral;\u6232eCurly\u0100DQ\u0203\u020FoubleQuote;\u601Duote;\u6019\u0200lnpu\u021E\u0228\u0247\u0255on\u0100;e\u0225\u0226\u6237;\u6A74\u0180git\u022F\u0236\u023Aruent;\u6261nt;\u622FourIntegral;\u622E\u0100fr\u024C\u024E;\u6102oduct;\u6210nterClockwiseContourIntegral;\u6233oss;\u6A2Fcr;\uC000\u{1D49E}p\u0100;C\u0284\u0285\u62D3ap;\u624D\u0580DJSZacefios\u02A0\u02AC\u02B0\u02B4\u02B8\u02CB\u02D7\u02E1\u02E6\u0333\u048D\u0100;o\u0179\u02A5trahd;\u6911cy;\u4402cy;\u4405cy;\u440F\u0180grs\u02BF\u02C4\u02C7ger;\u6021r;\u61A1hv;\u6AE4\u0100ay\u02D0\u02D5ron;\u410E;\u4414l\u0100;t\u02DD\u02DE\u6207a;\u4394r;\uC000\u{1D507}\u0100af\u02EB\u0327\u0100cm\u02F0\u0322ritical\u0200ADGT\u0300\u0306\u0316\u031Ccute;\u40B4o\u0174\u030B\u030D;\u42D9bleAcute;\u42DDrave;\u4060ilde;\u42DCond;\u62C4ferentialD;\u6146\u0470\u033D\0\0\0\u0342\u0354\0\u0405f;\uC000\u{1D53B}\u0180;DE\u0348\u0349\u034D\u40A8ot;\u60DCqual;\u6250ble\u0300CDLRUV\u0363\u0372\u0382\u03CF\u03E2\u03F8ontourIntegra\xEC\u0239o\u0274\u0379\0\0\u037B\xBB\u0349nArrow;\u61D3\u0100eo\u0387\u03A4ft\u0180ART\u0390\u0396\u03A1rrow;\u61D0ightArrow;\u61D4e\xE5\u02CAng\u0100LR\u03AB\u03C4eft\u0100AR\u03B3\u03B9rrow;\u67F8ightArrow;\u67FAightArrow;\u67F9ight\u0100AT\u03D8\u03DErrow;\u61D2ee;\u62A8p\u0241\u03E9\0\0\u03EFrrow;\u61D1ownArrow;\u61D5erticalBar;\u6225n\u0300ABLRTa\u0412\u042A\u0430\u045E\u047F\u037Crrow\u0180;BU\u041D\u041E\u0422\u6193ar;\u6913pArrow;\u61F5reve;\u4311eft\u02D2\u043A\0\u0446\0\u0450ightVector;\u6950eeVector;\u695Eector\u0100;B\u0459\u045A\u61BDar;\u6956ight\u01D4\u0467\0\u0471eeVector;\u695Fector\u0100;B\u047A\u047B\u61C1ar;\u6957ee\u0100;A\u0486\u0487\u62A4rrow;\u61A7\u0100ct\u0492\u0497r;\uC000\u{1D49F}rok;\u4110\u0800NTacdfglmopqstux\u04BD\u04C0\u04C4\u04CB\u04DE\u04E2\u04E7\u04EE\u04F5\u0521\u052F\u0536\u0552\u055D\u0560\u0565G;\u414AH\u803B\xD0\u40D0cute\u803B\xC9\u40C9\u0180aiy\u04D2\u04D7\u04DCron;\u411Arc\u803B\xCA\u40CA;\u442Dot;\u4116r;\uC000\u{1D508}rave\u803B\xC8\u40C8ement;\u6208\u0100ap\u04FA\u04FEcr;\u4112ty\u0253\u0506\0\0\u0512mallSquare;\u65FBerySmallSquare;\u65AB\u0100gp\u0526\u052Aon;\u4118f;\uC000\u{1D53C}silon;\u4395u\u0100ai\u053C\u0549l\u0100;T\u0542\u0543\u6A75ilde;\u6242librium;\u61CC\u0100ci\u0557\u055Ar;\u6130m;\u6A73a;\u4397ml\u803B\xCB\u40CB\u0100ip\u056A\u056Fsts;\u6203onentialE;\u6147\u0280cfios\u0585\u0588\u058D\u05B2\u05CCy;\u4424r;\uC000\u{1D509}lled\u0253\u0597\0\0\u05A3mallSquare;\u65FCerySmallSquare;\u65AA\u0370\u05BA\0\u05BF\0\0\u05C4f;\uC000\u{1D53D}All;\u6200riertrf;\u6131c\xF2\u05CB\u0600JTabcdfgorst\u05E8\u05EC\u05EF\u05FA\u0600\u0612\u0616\u061B\u061D\u0623\u066C\u0672cy;\u4403\u803B>\u403Emma\u0100;d\u05F7\u05F8\u4393;\u43DCreve;\u411E\u0180eiy\u0607\u060C\u0610dil;\u4122rc;\u411C;\u4413ot;\u4120r;\uC000\u{1D50A};\u62D9pf;\uC000\u{1D53E}eater\u0300EFGLST\u0635\u0644\u064E\u0656\u065B\u0666qual\u0100;L\u063E\u063F\u6265ess;\u62DBullEqual;\u6267reater;\u6AA2ess;\u6277lantEqual;\u6A7Eilde;\u6273cr;\uC000\u{1D4A2};\u626B\u0400Aacfiosu\u0685\u068B\u0696\u069B\u069E\u06AA\u06BE\u06CARDcy;\u442A\u0100ct\u0690\u0694ek;\u42C7;\u405Eirc;\u4124r;\u610ClbertSpace;\u610B\u01F0\u06AF\0\u06B2f;\u610DizontalLine;\u6500\u0100ct\u06C3\u06C5\xF2\u06A9rok;\u4126mp\u0144\u06D0\u06D8ownHum\xF0\u012Fqual;\u624F\u0700EJOacdfgmnostu\u06FA\u06FE\u0703\u0707\u070E\u071A\u071E\u0721\u0728\u0744\u0778\u078B\u078F\u0795cy;\u4415lig;\u4132cy;\u4401cute\u803B\xCD\u40CD\u0100iy\u0713\u0718rc\u803B\xCE\u40CE;\u4418ot;\u4130r;\u6111rave\u803B\xCC\u40CC\u0180;ap\u0720\u072F\u073F\u0100cg\u0734\u0737r;\u412AinaryI;\u6148lie\xF3\u03DD\u01F4\u0749\0\u0762\u0100;e\u074D\u074E\u622C\u0100gr\u0753\u0758ral;\u622Bsection;\u62C2isible\u0100CT\u076C\u0772omma;\u6063imes;\u6062\u0180gpt\u077F\u0783\u0788on;\u412Ef;\uC000\u{1D540}a;\u4399cr;\u6110ilde;\u4128\u01EB\u079A\0\u079Ecy;\u4406l\u803B\xCF\u40CF\u0280cfosu\u07AC\u07B7\u07BC\u07C2\u07D0\u0100iy\u07B1\u07B5rc;\u4134;\u4419r;\uC000\u{1D50D}pf;\uC000\u{1D541}\u01E3\u07C7\0\u07CCr;\uC000\u{1D4A5}rcy;\u4408kcy;\u4404\u0380HJacfos\u07E4\u07E8\u07EC\u07F1\u07FD\u0802\u0808cy;\u4425cy;\u440Cppa;\u439A\u0100ey\u07F6\u07FBdil;\u4136;\u441Ar;\uC000\u{1D50E}pf;\uC000\u{1D542}cr;\uC000\u{1D4A6}\u0580JTaceflmost\u0825\u0829\u082C\u0850\u0863\u09B3\u09B8\u09C7\u09CD\u0A37\u0A47cy;\u4409\u803B<\u403C\u0280cmnpr\u0837\u083C\u0841\u0844\u084Dute;\u4139bda;\u439Bg;\u67EAlacetrf;\u6112r;\u619E\u0180aey\u0857\u085C\u0861ron;\u413Ddil;\u413B;\u441B\u0100fs\u0868\u0970t\u0500ACDFRTUVar\u087E\u08A9\u08B1\u08E0\u08E6\u08FC\u092F\u095B\u0390\u096A\u0100nr\u0883\u088FgleBracket;\u67E8row\u0180;BR\u0899\u089A\u089E\u6190ar;\u61E4ightArrow;\u61C6eiling;\u6308o\u01F5\u08B7\0\u08C3bleBracket;\u67E6n\u01D4\u08C8\0\u08D2eeVector;\u6961ector\u0100;B\u08DB\u08DC\u61C3ar;\u6959loor;\u630Aight\u0100AV\u08EF\u08F5rrow;\u6194ector;\u694E\u0100er\u0901\u0917e\u0180;AV\u0909\u090A\u0910\u62A3rrow;\u61A4ector;\u695Aiangle\u0180;BE\u0924\u0925\u0929\u62B2ar;\u69CFqual;\u62B4p\u0180DTV\u0937\u0942\u094CownVector;\u6951eeVector;\u6960ector\u0100;B\u0956\u0957\u61BFar;\u6958ector\u0100;B\u0965\u0966\u61BCar;\u6952ight\xE1\u039Cs\u0300EFGLST\u097E\u098B\u0995\u099D\u09A2\u09ADqualGreater;\u62DAullEqual;\u6266reater;\u6276ess;\u6AA1lantEqual;\u6A7Dilde;\u6272r;\uC000\u{1D50F}\u0100;e\u09BD\u09BE\u62D8ftarrow;\u61DAidot;\u413F\u0180npw\u09D4\u0A16\u0A1Bg\u0200LRlr\u09DE\u09F7\u0A02\u0A10eft\u0100AR\u09E6\u09ECrrow;\u67F5ightArrow;\u67F7ightArrow;\u67F6eft\u0100ar\u03B3\u0A0Aight\xE1\u03BFight\xE1\u03CAf;\uC000\u{1D543}er\u0100LR\u0A22\u0A2CeftArrow;\u6199ightArrow;\u6198\u0180cht\u0A3E\u0A40\u0A42\xF2\u084C;\u61B0rok;\u4141;\u626A\u0400acefiosu\u0A5A\u0A5D\u0A60\u0A77\u0A7C\u0A85\u0A8B\u0A8Ep;\u6905y;\u441C\u0100dl\u0A65\u0A6FiumSpace;\u605Flintrf;\u6133r;\uC000\u{1D510}nusPlus;\u6213pf;\uC000\u{1D544}c\xF2\u0A76;\u439C\u0480Jacefostu\u0AA3\u0AA7\u0AAD\u0AC0\u0B14\u0B19\u0D91\u0D97\u0D9Ecy;\u440Acute;\u4143\u0180aey\u0AB4\u0AB9\u0ABEron;\u4147dil;\u4145;\u441D\u0180gsw\u0AC7\u0AF0\u0B0Eative\u0180MTV\u0AD3\u0ADF\u0AE8ediumSpace;\u600Bhi\u0100cn\u0AE6\u0AD8\xEB\u0AD9eryThi\xEE\u0AD9ted\u0100GL\u0AF8\u0B06reaterGreate\xF2\u0673essLes\xF3\u0A48Line;\u400Ar;\uC000\u{1D511}\u0200Bnpt\u0B22\u0B28\u0B37\u0B3Areak;\u6060BreakingSpace;\u40A0f;\u6115\u0680;CDEGHLNPRSTV\u0B55\u0B56\u0B6A\u0B7C\u0BA1\u0BEB\u0C04\u0C5E\u0C84\u0CA6\u0CD8\u0D61\u0D85\u6AEC\u0100ou\u0B5B\u0B64ngruent;\u6262pCap;\u626DoubleVerticalBar;\u6226\u0180lqx\u0B83\u0B8A\u0B9Bement;\u6209ual\u0100;T\u0B92\u0B93\u6260ilde;\uC000\u2242\u0338ists;\u6204reater\u0380;EFGLST\u0BB6\u0BB7\u0BBD\u0BC9\u0BD3\u0BD8\u0BE5\u626Fqual;\u6271ullEqual;\uC000\u2267\u0338reater;\uC000\u226B\u0338ess;\u6279lantEqual;\uC000\u2A7E\u0338ilde;\u6275ump\u0144\u0BF2\u0BFDownHump;\uC000\u224E\u0338qual;\uC000\u224F\u0338e\u0100fs\u0C0A\u0C27tTriangle\u0180;BE\u0C1A\u0C1B\u0C21\u62EAar;\uC000\u29CF\u0338qual;\u62ECs\u0300;EGLST\u0C35\u0C36\u0C3C\u0C44\u0C4B\u0C58\u626Equal;\u6270reater;\u6278ess;\uC000\u226A\u0338lantEqual;\uC000\u2A7D\u0338ilde;\u6274ested\u0100GL\u0C68\u0C79reaterGreater;\uC000\u2AA2\u0338essLess;\uC000\u2AA1\u0338recedes\u0180;ES\u0C92\u0C93\u0C9B\u6280qual;\uC000\u2AAF\u0338lantEqual;\u62E0\u0100ei\u0CAB\u0CB9verseElement;\u620CghtTriangle\u0180;BE\u0CCB\u0CCC\u0CD2\u62EBar;\uC000\u29D0\u0338qual;\u62ED\u0100qu\u0CDD\u0D0CuareSu\u0100bp\u0CE8\u0CF9set\u0100;E\u0CF0\u0CF3\uC000\u228F\u0338qual;\u62E2erset\u0100;E\u0D03\u0D06\uC000\u2290\u0338qual;\u62E3\u0180bcp\u0D13\u0D24\u0D4Eset\u0100;E\u0D1B\u0D1E\uC000\u2282\u20D2qual;\u6288ceeds\u0200;EST\u0D32\u0D33\u0D3B\u0D46\u6281qual;\uC000\u2AB0\u0338lantEqual;\u62E1ilde;\uC000\u227F\u0338erset\u0100;E\u0D58\u0D5B\uC000\u2283\u20D2qual;\u6289ilde\u0200;EFT\u0D6E\u0D6F\u0D75\u0D7F\u6241qual;\u6244ullEqual;\u6247ilde;\u6249erticalBar;\u6224cr;\uC000\u{1D4A9}ilde\u803B\xD1\u40D1;\u439D\u0700Eacdfgmoprstuv\u0DBD\u0DC2\u0DC9\u0DD5\u0DDB\u0DE0\u0DE7\u0DFC\u0E02\u0E20\u0E22\u0E32\u0E3F\u0E44lig;\u4152cute\u803B\xD3\u40D3\u0100iy\u0DCE\u0DD3rc\u803B\xD4\u40D4;\u441Eblac;\u4150r;\uC000\u{1D512}rave\u803B\xD2\u40D2\u0180aei\u0DEE\u0DF2\u0DF6cr;\u414Cga;\u43A9cron;\u439Fpf;\uC000\u{1D546}enCurly\u0100DQ\u0E0E\u0E1AoubleQuote;\u601Cuote;\u6018;\u6A54\u0100cl\u0E27\u0E2Cr;\uC000\u{1D4AA}ash\u803B\xD8\u40D8i\u016C\u0E37\u0E3Cde\u803B\xD5\u40D5es;\u6A37ml\u803B\xD6\u40D6er\u0100BP\u0E4B\u0E60\u0100ar\u0E50\u0E53r;\u603Eac\u0100ek\u0E5A\u0E5C;\u63DEet;\u63B4arenthesis;\u63DC\u0480acfhilors\u0E7F\u0E87\u0E8A\u0E8F\u0E92\u0E94\u0E9D\u0EB0\u0EFCrtialD;\u6202y;\u441Fr;\uC000\u{1D513}i;\u43A6;\u43A0usMinus;\u40B1\u0100ip\u0EA2\u0EADncareplan\xE5\u069Df;\u6119\u0200;eio\u0EB9\u0EBA\u0EE0\u0EE4\u6ABBcedes\u0200;EST\u0EC8\u0EC9\u0ECF\u0EDA\u627Aqual;\u6AAFlantEqual;\u627Cilde;\u627Eme;\u6033\u0100dp\u0EE9\u0EEEuct;\u620Fortion\u0100;a\u0225\u0EF9l;\u621D\u0100ci\u0F01\u0F06r;\uC000\u{1D4AB};\u43A8\u0200Ufos\u0F11\u0F16\u0F1B\u0F1FOT\u803B"\u4022r;\uC000\u{1D514}pf;\u611Acr;\uC000\u{1D4AC}\u0600BEacefhiorsu\u0F3E\u0F43\u0F47\u0F60\u0F73\u0FA7\u0FAA\u0FAD\u1096\u10A9\u10B4\u10BEarr;\u6910G\u803B\xAE\u40AE\u0180cnr\u0F4E\u0F53\u0F56ute;\u4154g;\u67EBr\u0100;t\u0F5C\u0F5D\u61A0l;\u6916\u0180aey\u0F67\u0F6C\u0F71ron;\u4158dil;\u4156;\u4420\u0100;v\u0F78\u0F79\u611Cerse\u0100EU\u0F82\u0F99\u0100lq\u0F87\u0F8Eement;\u620Builibrium;\u61CBpEquilibrium;\u696Fr\xBB\u0F79o;\u43A1ght\u0400ACDFTUVa\u0FC1\u0FEB\u0FF3\u1022\u1028\u105B\u1087\u03D8\u0100nr\u0FC6\u0FD2gleBracket;\u67E9row\u0180;BL\u0FDC\u0FDD\u0FE1\u6192ar;\u61E5eftArrow;\u61C4eiling;\u6309o\u01F5\u0FF9\0\u1005bleBracket;\u67E7n\u01D4\u100A\0\u1014eeVector;\u695Dector\u0100;B\u101D\u101E\u61C2ar;\u6955loor;\u630B\u0100er\u102D\u1043e\u0180;AV\u1035\u1036\u103C\u62A2rrow;\u61A6ector;\u695Biangle\u0180;BE\u1050\u1051\u1055\u62B3ar;\u69D0qual;\u62B5p\u0180DTV\u1063\u106E\u1078ownVector;\u694FeeVector;\u695Cector\u0100;B\u1082\u1083\u61BEar;\u6954ector\u0100;B\u1091\u1092\u61C0ar;\u6953\u0100pu\u109B\u109Ef;\u611DndImplies;\u6970ightarrow;\u61DB\u0100ch\u10B9\u10BCr;\u611B;\u61B1leDelayed;\u69F4\u0680HOacfhimoqstu\u10E4\u10F1\u10F7\u10FD\u1119\u111E\u1151\u1156\u1161\u1167\u11B5\u11BB\u11BF\u0100Cc\u10E9\u10EEHcy;\u4429y;\u4428FTcy;\u442Ccute;\u415A\u0280;aeiy\u1108\u1109\u110E\u1113\u1117\u6ABCron;\u4160dil;\u415Erc;\u415C;\u4421r;\uC000\u{1D516}ort\u0200DLRU\u112A\u1134\u113E\u1149ownArrow\xBB\u041EeftArrow\xBB\u089AightArrow\xBB\u0FDDpArrow;\u6191gma;\u43A3allCircle;\u6218pf;\uC000\u{1D54A}\u0272\u116D\0\0\u1170t;\u621Aare\u0200;ISU\u117B\u117C\u1189\u11AF\u65A1ntersection;\u6293u\u0100bp\u118F\u119Eset\u0100;E\u1197\u1198\u628Fqual;\u6291erset\u0100;E\u11A8\u11A9\u6290qual;\u6292nion;\u6294cr;\uC000\u{1D4AE}ar;\u62C6\u0200bcmp\u11C8\u11DB\u1209\u120B\u0100;s\u11CD\u11CE\u62D0et\u0100;E\u11CD\u11D5qual;\u6286\u0100ch\u11E0\u1205eeds\u0200;EST\u11ED\u11EE\u11F4\u11FF\u627Bqual;\u6AB0lantEqual;\u627Dilde;\u627FTh\xE1\u0F8C;\u6211\u0180;es\u1212\u1213\u1223\u62D1rset\u0100;E\u121C\u121D\u6283qual;\u6287et\xBB\u1213\u0580HRSacfhiors\u123E\u1244\u1249\u1255\u125E\u1271\u1276\u129F\u12C2\u12C8\u12D1ORN\u803B\xDE\u40DEADE;\u6122\u0100Hc\u124E\u1252cy;\u440By;\u4426\u0100bu\u125A\u125C;\u4009;\u43A4\u0180aey\u1265\u126A\u126Fron;\u4164dil;\u4162;\u4422r;\uC000\u{1D517}\u0100ei\u127B\u1289\u01F2\u1280\0\u1287efore;\u6234a;\u4398\u0100cn\u128E\u1298kSpace;\uC000\u205F\u200ASpace;\u6009lde\u0200;EFT\u12AB\u12AC\u12B2\u12BC\u623Cqual;\u6243ullEqual;\u6245ilde;\u6248pf;\uC000\u{1D54B}ipleDot;\u60DB\u0100ct\u12D6\u12DBr;\uC000\u{1D4AF}rok;\u4166\u0AE1\u12F7\u130E\u131A\u1326\0\u132C\u1331\0\0\0\0\0\u1338\u133D\u1377\u1385\0\u13FF\u1404\u140A\u1410\u0100cr\u12FB\u1301ute\u803B\xDA\u40DAr\u0100;o\u1307\u1308\u619Fcir;\u6949r\u01E3\u1313\0\u1316y;\u440Eve;\u416C\u0100iy\u131E\u1323rc\u803B\xDB\u40DB;\u4423blac;\u4170r;\uC000\u{1D518}rave\u803B\xD9\u40D9acr;\u416A\u0100di\u1341\u1369er\u0100BP\u1348\u135D\u0100ar\u134D\u1350r;\u405Fac\u0100ek\u1357\u1359;\u63DFet;\u63B5arenthesis;\u63DDon\u0100;P\u1370\u1371\u62C3lus;\u628E\u0100gp\u137B\u137Fon;\u4172f;\uC000\u{1D54C}\u0400ADETadps\u1395\u13AE\u13B8\u13C4\u03E8\u13D2\u13D7\u13F3rrow\u0180;BD\u1150\u13A0\u13A4ar;\u6912ownArrow;\u61C5ownArrow;\u6195quilibrium;\u696Eee\u0100;A\u13CB\u13CC\u62A5rrow;\u61A5own\xE1\u03F3er\u0100LR\u13DE\u13E8eftArrow;\u6196ightArrow;\u6197i\u0100;l\u13F9\u13FA\u43D2on;\u43A5ing;\u416Ecr;\uC000\u{1D4B0}ilde;\u4168ml\u803B\xDC\u40DC\u0480Dbcdefosv\u1427\u142C\u1430\u1433\u143E\u1485\u148A\u1490\u1496ash;\u62ABar;\u6AEBy;\u4412ash\u0100;l\u143B\u143C\u62A9;\u6AE6\u0100er\u1443\u1445;\u62C1\u0180bty\u144C\u1450\u147Aar;\u6016\u0100;i\u144F\u1455cal\u0200BLST\u1461\u1465\u146A\u1474ar;\u6223ine;\u407Ceparator;\u6758ilde;\u6240ThinSpace;\u600Ar;\uC000\u{1D519}pf;\uC000\u{1D54D}cr;\uC000\u{1D4B1}dash;\u62AA\u0280cefos\u14A7\u14AC\u14B1\u14B6\u14BCirc;\u4174dge;\u62C0r;\uC000\u{1D51A}pf;\uC000\u{1D54E}cr;\uC000\u{1D4B2}\u0200fios\u14CB\u14D0\u14D2\u14D8r;\uC000\u{1D51B};\u439Epf;\uC000\u{1D54F}cr;\uC000\u{1D4B3}\u0480AIUacfosu\u14F1\u14F5\u14F9\u14FD\u1504\u150F\u1514\u151A\u1520cy;\u442Fcy;\u4407cy;\u442Ecute\u803B\xDD\u40DD\u0100iy\u1509\u150Drc;\u4176;\u442Br;\uC000\u{1D51C}pf;\uC000\u{1D550}cr;\uC000\u{1D4B4}ml;\u4178\u0400Hacdefos\u1535\u1539\u153F\u154B\u154F\u155D\u1560\u1564cy;\u4416cute;\u4179\u0100ay\u1544\u1549ron;\u417D;\u4417ot;\u417B\u01F2\u1554\0\u155BoWidt\xE8\u0AD9a;\u4396r;\u6128pf;\u6124cr;\uC000\u{1D4B5}\u0BE1\u1583\u158A\u1590\0\u15B0\u15B6\u15BF\0\0\0\0\u15C6\u15DB\u15EB\u165F\u166D\0\u1695\u169B\u16B2\u16B9\0\u16BEcute\u803B\xE1\u40E1reve;\u4103\u0300;Ediuy\u159C\u159D\u15A1\u15A3\u15A8\u15AD\u623E;\uC000\u223E\u0333;\u623Frc\u803B\xE2\u40E2te\u80BB\xB4\u0306;\u4430lig\u803B\xE6\u40E6\u0100;r\xB2\u15BA;\uC000\u{1D51E}rave\u803B\xE0\u40E0\u0100ep\u15CA\u15D6\u0100fp\u15CF\u15D4sym;\u6135\xE8\u15D3ha;\u43B1\u0100ap\u15DFc\u0100cl\u15E4\u15E7r;\u4101g;\u6A3F\u0264\u15F0\0\0\u160A\u0280;adsv\u15FA\u15FB\u15FF\u1601\u1607\u6227nd;\u6A55;\u6A5Clope;\u6A58;\u6A5A\u0380;elmrsz\u1618\u1619\u161B\u161E\u163F\u164F\u1659\u6220;\u69A4e\xBB\u1619sd\u0100;a\u1625\u1626\u6221\u0461\u1630\u1632\u1634\u1636\u1638\u163A\u163C\u163E;\u69A8;\u69A9;\u69AA;\u69AB;\u69AC;\u69AD;\u69AE;\u69AFt\u0100;v\u1645\u1646\u621Fb\u0100;d\u164C\u164D\u62BE;\u699D\u0100pt\u1654\u1657h;\u6222\xBB\xB9arr;\u637C\u0100gp\u1663\u1667on;\u4105f;\uC000\u{1D552}\u0380;Eaeiop\u12C1\u167B\u167D\u1682\u1684\u1687\u168A;\u6A70cir;\u6A6F;\u624Ad;\u624Bs;\u4027rox\u0100;e\u12C1\u1692\xF1\u1683ing\u803B\xE5\u40E5\u0180cty\u16A1\u16A6\u16A8r;\uC000\u{1D4B6};\u402Amp\u0100;e\u12C1\u16AF\xF1\u0288ilde\u803B\xE3\u40E3ml\u803B\xE4\u40E4\u0100ci\u16C2\u16C8onin\xF4\u0272nt;\u6A11\u0800Nabcdefiklnoprsu\u16ED\u16F1\u1730\u173C\u1743\u1748\u1778\u177D\u17E0\u17E6\u1839\u1850\u170D\u193D\u1948\u1970ot;\u6AED\u0100cr\u16F6\u171Ek\u0200ceps\u1700\u1705\u170D\u1713ong;\u624Cpsilon;\u43F6rime;\u6035im\u0100;e\u171A\u171B\u623Dq;\u62CD\u0176\u1722\u1726ee;\u62BDed\u0100;g\u172C\u172D\u6305e\xBB\u172Drk\u0100;t\u135C\u1737brk;\u63B6\u0100oy\u1701\u1741;\u4431quo;\u601E\u0280cmprt\u1753\u175B\u1761\u1764\u1768aus\u0100;e\u010A\u0109ptyv;\u69B0s\xE9\u170Cno\xF5\u0113\u0180ahw\u176F\u1771\u1773;\u43B2;\u6136een;\u626Cr;\uC000\u{1D51F}g\u0380costuvw\u178D\u179D\u17B3\u17C1\u17D5\u17DB\u17DE\u0180aiu\u1794\u1796\u179A\xF0\u0760rc;\u65EFp\xBB\u1371\u0180dpt\u17A4\u17A8\u17ADot;\u6A00lus;\u6A01imes;\u6A02\u0271\u17B9\0\0\u17BEcup;\u6A06ar;\u6605riangle\u0100du\u17CD\u17D2own;\u65BDp;\u65B3plus;\u6A04e\xE5\u1444\xE5\u14ADarow;\u690D\u0180ako\u17ED\u1826\u1835\u0100cn\u17F2\u1823k\u0180lst\u17FA\u05AB\u1802ozenge;\u69EBriangle\u0200;dlr\u1812\u1813\u1818\u181D\u65B4own;\u65BEeft;\u65C2ight;\u65B8k;\u6423\u01B1\u182B\0\u1833\u01B2\u182F\0\u1831;\u6592;\u65914;\u6593ck;\u6588\u0100eo\u183E\u184D\u0100;q\u1843\u1846\uC000=\u20E5uiv;\uC000\u2261\u20E5t;\u6310\u0200ptwx\u1859\u185E\u1867\u186Cf;\uC000\u{1D553}\u0100;t\u13CB\u1863om\xBB\u13CCtie;\u62C8\u0600DHUVbdhmptuv\u1885\u1896\u18AA\u18BB\u18D7\u18DB\u18EC\u18FF\u1905\u190A\u1910\u1921\u0200LRlr\u188E\u1890\u1892\u1894;\u6557;\u6554;\u6556;\u6553\u0280;DUdu\u18A1\u18A2\u18A4\u18A6\u18A8\u6550;\u6566;\u6569;\u6564;\u6567\u0200LRlr\u18B3\u18B5\u18B7\u18B9;\u655D;\u655A;\u655C;\u6559\u0380;HLRhlr\u18CA\u18CB\u18CD\u18CF\u18D1\u18D3\u18D5\u6551;\u656C;\u6563;\u6560;\u656B;\u6562;\u655Fox;\u69C9\u0200LRlr\u18E4\u18E6\u18E8\u18EA;\u6555;\u6552;\u6510;\u650C\u0280;DUdu\u06BD\u18F7\u18F9\u18FB\u18FD;\u6565;\u6568;\u652C;\u6534inus;\u629Flus;\u629Eimes;\u62A0\u0200LRlr\u1919\u191B\u191D\u191F;\u655B;\u6558;\u6518;\u6514\u0380;HLRhlr\u1930\u1931\u1933\u1935\u1937\u1939\u193B\u6502;\u656A;\u6561;\u655E;\u653C;\u6524;\u651C\u0100ev\u0123\u1942bar\u803B\xA6\u40A6\u0200ceio\u1951\u1956\u195A\u1960r;\uC000\u{1D4B7}mi;\u604Fm\u0100;e\u171A\u171Cl\u0180;bh\u1968\u1969\u196B\u405C;\u69C5sub;\u67C8\u016C\u1974\u197El\u0100;e\u1979\u197A\u6022t\xBB\u197Ap\u0180;Ee\u012F\u1985\u1987;\u6AAE\u0100;q\u06DC\u06DB\u0CE1\u19A7\0\u19E8\u1A11\u1A15\u1A32\0\u1A37\u1A50\0\0\u1AB4\0\0\u1AC1\0\0\u1B21\u1B2E\u1B4D\u1B52\0\u1BFD\0\u1C0C\u0180cpr\u19AD\u19B2\u19DDute;\u4107\u0300;abcds\u19BF\u19C0\u19C4\u19CA\u19D5\u19D9\u6229nd;\u6A44rcup;\u6A49\u0100au\u19CF\u19D2p;\u6A4Bp;\u6A47ot;\u6A40;\uC000\u2229\uFE00\u0100eo\u19E2\u19E5t;\u6041\xEE\u0693\u0200aeiu\u19F0\u19FB\u1A01\u1A05\u01F0\u19F5\0\u19F8s;\u6A4Don;\u410Ddil\u803B\xE7\u40E7rc;\u4109ps\u0100;s\u1A0C\u1A0D\u6A4Cm;\u6A50ot;\u410B\u0180dmn\u1A1B\u1A20\u1A26il\u80BB\xB8\u01ADptyv;\u69B2t\u8100\xA2;e\u1A2D\u1A2E\u40A2r\xE4\u01B2r;\uC000\u{1D520}\u0180cei\u1A3D\u1A40\u1A4Dy;\u4447ck\u0100;m\u1A47\u1A48\u6713ark\xBB\u1A48;\u43C7r\u0380;Ecefms\u1A5F\u1A60\u1A62\u1A6B\u1AA4\u1AAA\u1AAE\u65CB;\u69C3\u0180;el\u1A69\u1A6A\u1A6D\u42C6q;\u6257e\u0261\u1A74\0\0\u1A88rrow\u0100lr\u1A7C\u1A81eft;\u61BAight;\u61BB\u0280RSacd\u1A92\u1A94\u1A96\u1A9A\u1A9F\xBB\u0F47;\u64C8st;\u629Birc;\u629Aash;\u629Dnint;\u6A10id;\u6AEFcir;\u69C2ubs\u0100;u\u1ABB\u1ABC\u6663it\xBB\u1ABC\u02EC\u1AC7\u1AD4\u1AFA\0\u1B0Aon\u0100;e\u1ACD\u1ACE\u403A\u0100;q\xC7\xC6\u026D\u1AD9\0\0\u1AE2a\u0100;t\u1ADE\u1ADF\u402C;\u4040\u0180;fl\u1AE8\u1AE9\u1AEB\u6201\xEE\u1160e\u0100mx\u1AF1\u1AF6ent\xBB\u1AE9e\xF3\u024D\u01E7\u1AFE\0\u1B07\u0100;d\u12BB\u1B02ot;\u6A6Dn\xF4\u0246\u0180fry\u1B10\u1B14\u1B17;\uC000\u{1D554}o\xE4\u0254\u8100\xA9;s\u0155\u1B1Dr;\u6117\u0100ao\u1B25\u1B29rr;\u61B5ss;\u6717\u0100cu\u1B32\u1B37r;\uC000\u{1D4B8}\u0100bp\u1B3C\u1B44\u0100;e\u1B41\u1B42\u6ACF;\u6AD1\u0100;e\u1B49\u1B4A\u6AD0;\u6AD2dot;\u62EF\u0380delprvw\u1B60\u1B6C\u1B77\u1B82\u1BAC\u1BD4\u1BF9arr\u0100lr\u1B68\u1B6A;\u6938;\u6935\u0270\u1B72\0\0\u1B75r;\u62DEc;\u62DFarr\u0100;p\u1B7F\u1B80\u61B6;\u693D\u0300;bcdos\u1B8F\u1B90\u1B96\u1BA1\u1BA5\u1BA8\u622Arcap;\u6A48\u0100au\u1B9B\u1B9Ep;\u6A46p;\u6A4Aot;\u628Dr;\u6A45;\uC000\u222A\uFE00\u0200alrv\u1BB5\u1BBF\u1BDE\u1BE3rr\u0100;m\u1BBC\u1BBD\u61B7;\u693Cy\u0180evw\u1BC7\u1BD4\u1BD8q\u0270\u1BCE\0\0\u1BD2re\xE3\u1B73u\xE3\u1B75ee;\u62CEedge;\u62CFen\u803B\xA4\u40A4earrow\u0100lr\u1BEE\u1BF3eft\xBB\u1B80ight\xBB\u1BBDe\xE4\u1BDD\u0100ci\u1C01\u1C07onin\xF4\u01F7nt;\u6231lcty;\u632D\u0980AHabcdefhijlorstuwz\u1C38\u1C3B\u1C3F\u1C5D\u1C69\u1C75\u1C8A\u1C9E\u1CAC\u1CB7\u1CFB\u1CFF\u1D0D\u1D7B\u1D91\u1DAB\u1DBB\u1DC6\u1DCDr\xF2\u0381ar;\u6965\u0200glrs\u1C48\u1C4D\u1C52\u1C54ger;\u6020eth;\u6138\xF2\u1133h\u0100;v\u1C5A\u1C5B\u6010\xBB\u090A\u016B\u1C61\u1C67arow;\u690Fa\xE3\u0315\u0100ay\u1C6E\u1C73ron;\u410F;\u4434\u0180;ao\u0332\u1C7C\u1C84\u0100gr\u02BF\u1C81r;\u61CAtseq;\u6A77\u0180glm\u1C91\u1C94\u1C98\u803B\xB0\u40B0ta;\u43B4ptyv;\u69B1\u0100ir\u1CA3\u1CA8sht;\u697F;\uC000\u{1D521}ar\u0100lr\u1CB3\u1CB5\xBB\u08DC\xBB\u101E\u0280aegsv\u1CC2\u0378\u1CD6\u1CDC\u1CE0m\u0180;os\u0326\u1CCA\u1CD4nd\u0100;s\u0326\u1CD1uit;\u6666amma;\u43DDin;\u62F2\u0180;io\u1CE7\u1CE8\u1CF8\u40F7de\u8100\xF7;o\u1CE7\u1CF0ntimes;\u62C7n\xF8\u1CF7cy;\u4452c\u026F\u1D06\0\0\u1D0Arn;\u631Eop;\u630D\u0280lptuw\u1D18\u1D1D\u1D22\u1D49\u1D55lar;\u4024f;\uC000\u{1D555}\u0280;emps\u030B\u1D2D\u1D37\u1D3D\u1D42q\u0100;d\u0352\u1D33ot;\u6251inus;\u6238lus;\u6214quare;\u62A1blebarwedg\xE5\xFAn\u0180adh\u112E\u1D5D\u1D67ownarrow\xF3\u1C83arpoon\u0100lr\u1D72\u1D76ef\xF4\u1CB4igh\xF4\u1CB6\u0162\u1D7F\u1D85karo\xF7\u0F42\u026F\u1D8A\0\0\u1D8Ern;\u631Fop;\u630C\u0180cot\u1D98\u1DA3\u1DA6\u0100ry\u1D9D\u1DA1;\uC000\u{1D4B9};\u4455l;\u69F6rok;\u4111\u0100dr\u1DB0\u1DB4ot;\u62F1i\u0100;f\u1DBA\u1816\u65BF\u0100ah\u1DC0\u1DC3r\xF2\u0429a\xF2\u0FA6angle;\u69A6\u0100ci\u1DD2\u1DD5y;\u445Fgrarr;\u67FF\u0900Dacdefglmnopqrstux\u1E01\u1E09\u1E19\u1E38\u0578\u1E3C\u1E49\u1E61\u1E7E\u1EA5\u1EAF\u1EBD\u1EE1\u1F2A\u1F37\u1F44\u1F4E\u1F5A\u0100Do\u1E06\u1D34o\xF4\u1C89\u0100cs\u1E0E\u1E14ute\u803B\xE9\u40E9ter;\u6A6E\u0200aioy\u1E22\u1E27\u1E31\u1E36ron;\u411Br\u0100;c\u1E2D\u1E2E\u6256\u803B\xEA\u40EAlon;\u6255;\u444Dot;\u4117\u0100Dr\u1E41\u1E45ot;\u6252;\uC000\u{1D522}\u0180;rs\u1E50\u1E51\u1E57\u6A9Aave\u803B\xE8\u40E8\u0100;d\u1E5C\u1E5D\u6A96ot;\u6A98\u0200;ils\u1E6A\u1E6B\u1E72\u1E74\u6A99nters;\u63E7;\u6113\u0100;d\u1E79\u1E7A\u6A95ot;\u6A97\u0180aps\u1E85\u1E89\u1E97cr;\u4113ty\u0180;sv\u1E92\u1E93\u1E95\u6205et\xBB\u1E93p\u01001;\u1E9D\u1EA4\u0133\u1EA1\u1EA3;\u6004;\u6005\u6003\u0100gs\u1EAA\u1EAC;\u414Bp;\u6002\u0100gp\u1EB4\u1EB8on;\u4119f;\uC000\u{1D556}\u0180als\u1EC4\u1ECE\u1ED2r\u0100;s\u1ECA\u1ECB\u62D5l;\u69E3us;\u6A71i\u0180;lv\u1EDA\u1EDB\u1EDF\u43B5on\xBB\u1EDB;\u43F5\u0200csuv\u1EEA\u1EF3\u1F0B\u1F23\u0100io\u1EEF\u1E31rc\xBB\u1E2E\u0269\u1EF9\0\0\u1EFB\xED\u0548ant\u0100gl\u1F02\u1F06tr\xBB\u1E5Dess\xBB\u1E7A\u0180aei\u1F12\u1F16\u1F1Als;\u403Dst;\u625Fv\u0100;D\u0235\u1F20D;\u6A78parsl;\u69E5\u0100Da\u1F2F\u1F33ot;\u6253rr;\u6971\u0180cdi\u1F3E\u1F41\u1EF8r;\u612Fo\xF4\u0352\u0100ah\u1F49\u1F4B;\u43B7\u803B\xF0\u40F0\u0100mr\u1F53\u1F57l\u803B\xEB\u40EBo;\u60AC\u0180cip\u1F61\u1F64\u1F67l;\u4021s\xF4\u056E\u0100eo\u1F6C\u1F74ctatio\xEE\u0559nential\xE5\u0579\u09E1\u1F92\0\u1F9E\0\u1FA1\u1FA7\0\0\u1FC6\u1FCC\0\u1FD3\0\u1FE6\u1FEA\u2000\0\u2008\u205Allingdotse\xF1\u1E44y;\u4444male;\u6640\u0180ilr\u1FAD\u1FB3\u1FC1lig;\u8000\uFB03\u0269\u1FB9\0\0\u1FBDg;\u8000\uFB00ig;\u8000\uFB04;\uC000\u{1D523}lig;\u8000\uFB01lig;\uC000fj\u0180alt\u1FD9\u1FDC\u1FE1t;\u666Dig;\u8000\uFB02ns;\u65B1of;\u4192\u01F0\u1FEE\0\u1FF3f;\uC000\u{1D557}\u0100ak\u05BF\u1FF7\u0100;v\u1FFC\u1FFD\u62D4;\u6AD9artint;\u6A0D\u0100ao\u200C\u2055\u0100cs\u2011\u2052\u03B1\u201A\u2030\u2038\u2045\u2048\0\u2050\u03B2\u2022\u2025\u2027\u202A\u202C\0\u202E\u803B\xBD\u40BD;\u6153\u803B\xBC\u40BC;\u6155;\u6159;\u615B\u01B3\u2034\0\u2036;\u6154;\u6156\u02B4\u203E\u2041\0\0\u2043\u803B\xBE\u40BE;\u6157;\u615C5;\u6158\u01B6\u204C\0\u204E;\u615A;\u615D8;\u615El;\u6044wn;\u6322cr;\uC000\u{1D4BB}\u0880Eabcdefgijlnorstv\u2082\u2089\u209F\u20A5\u20B0\u20B4\u20F0\u20F5\u20FA\u20FF\u2103\u2112\u2138\u0317\u213E\u2152\u219E\u0100;l\u064D\u2087;\u6A8C\u0180cmp\u2090\u2095\u209Dute;\u41F5ma\u0100;d\u209C\u1CDA\u43B3;\u6A86reve;\u411F\u0100iy\u20AA\u20AErc;\u411D;\u4433ot;\u4121\u0200;lqs\u063E\u0642\u20BD\u20C9\u0180;qs\u063E\u064C\u20C4lan\xF4\u0665\u0200;cdl\u0665\u20D2\u20D5\u20E5c;\u6AA9ot\u0100;o\u20DC\u20DD\u6A80\u0100;l\u20E2\u20E3\u6A82;\u6A84\u0100;e\u20EA\u20ED\uC000\u22DB\uFE00s;\u6A94r;\uC000\u{1D524}\u0100;g\u0673\u061Bmel;\u6137cy;\u4453\u0200;Eaj\u065A\u210C\u210E\u2110;\u6A92;\u6AA5;\u6AA4\u0200Eaes\u211B\u211D\u2129\u2134;\u6269p\u0100;p\u2123\u2124\u6A8Arox\xBB\u2124\u0100;q\u212E\u212F\u6A88\u0100;q\u212E\u211Bim;\u62E7pf;\uC000\u{1D558}\u0100ci\u2143\u2146r;\u610Am\u0180;el\u066B\u214E\u2150;\u6A8E;\u6A90\u8300>;cdlqr\u05EE\u2160\u216A\u216E\u2173\u2179\u0100ci\u2165\u2167;\u6AA7r;\u6A7Aot;\u62D7Par;\u6995uest;\u6A7C\u0280adels\u2184\u216A\u2190\u0656\u219B\u01F0\u2189\0\u218Epro\xF8\u209Er;\u6978q\u0100lq\u063F\u2196les\xF3\u2088i\xED\u066B\u0100en\u21A3\u21ADrtneqq;\uC000\u2269\uFE00\xC5\u21AA\u0500Aabcefkosy\u21C4\u21C7\u21F1\u21F5\u21FA\u2218\u221D\u222F\u2268\u227Dr\xF2\u03A0\u0200ilmr\u21D0\u21D4\u21D7\u21DBrs\xF0\u1484f\xBB\u2024il\xF4\u06A9\u0100dr\u21E0\u21E4cy;\u444A\u0180;cw\u08F4\u21EB\u21EFir;\u6948;\u61ADar;\u610Firc;\u4125\u0180alr\u2201\u220E\u2213rts\u0100;u\u2209\u220A\u6665it\xBB\u220Alip;\u6026con;\u62B9r;\uC000\u{1D525}s\u0100ew\u2223\u2229arow;\u6925arow;\u6926\u0280amopr\u223A\u223E\u2243\u225E\u2263rr;\u61FFtht;\u623Bk\u0100lr\u2249\u2253eftarrow;\u61A9ightarrow;\u61AAf;\uC000\u{1D559}bar;\u6015\u0180clt\u226F\u2274\u2278r;\uC000\u{1D4BD}as\xE8\u21F4rok;\u4127\u0100bp\u2282\u2287ull;\u6043hen\xBB\u1C5B\u0AE1\u22A3\0\u22AA\0\u22B8\u22C5\u22CE\0\u22D5\u22F3\0\0\u22F8\u2322\u2367\u2362\u237F\0\u2386\u23AA\u23B4cute\u803B\xED\u40ED\u0180;iy\u0771\u22B0\u22B5rc\u803B\xEE\u40EE;\u4438\u0100cx\u22BC\u22BFy;\u4435cl\u803B\xA1\u40A1\u0100fr\u039F\u22C9;\uC000\u{1D526}rave\u803B\xEC\u40EC\u0200;ino\u073E\u22DD\u22E9\u22EE\u0100in\u22E2\u22E6nt;\u6A0Ct;\u622Dfin;\u69DCta;\u6129lig;\u4133\u0180aop\u22FE\u231A\u231D\u0180cgt\u2305\u2308\u2317r;\u412B\u0180elp\u071F\u230F\u2313in\xE5\u078Ear\xF4\u0720h;\u4131f;\u62B7ed;\u41B5\u0280;cfot\u04F4\u232C\u2331\u233D\u2341are;\u6105in\u0100;t\u2338\u2339\u621Eie;\u69DDdo\xF4\u2319\u0280;celp\u0757\u234C\u2350\u235B\u2361al;\u62BA\u0100gr\u2355\u2359er\xF3\u1563\xE3\u234Darhk;\u6A17rod;\u6A3C\u0200cgpt\u236F\u2372\u2376\u237By;\u4451on;\u412Ff;\uC000\u{1D55A}a;\u43B9uest\u803B\xBF\u40BF\u0100ci\u238A\u238Fr;\uC000\u{1D4BE}n\u0280;Edsv\u04F4\u239B\u239D\u23A1\u04F3;\u62F9ot;\u62F5\u0100;v\u23A6\u23A7\u62F4;\u62F3\u0100;i\u0777\u23AElde;\u4129\u01EB\u23B8\0\u23BCcy;\u4456l\u803B\xEF\u40EF\u0300cfmosu\u23CC\u23D7\u23DC\u23E1\u23E7\u23F5\u0100iy\u23D1\u23D5rc;\u4135;\u4439r;\uC000\u{1D527}ath;\u4237pf;\uC000\u{1D55B}\u01E3\u23EC\0\u23F1r;\uC000\u{1D4BF}rcy;\u4458kcy;\u4454\u0400acfghjos\u240B\u2416\u2422\u2427\u242D\u2431\u2435\u243Bppa\u0100;v\u2413\u2414\u43BA;\u43F0\u0100ey\u241B\u2420dil;\u4137;\u443Ar;\uC000\u{1D528}reen;\u4138cy;\u4445cy;\u445Cpf;\uC000\u{1D55C}cr;\uC000\u{1D4C0}\u0B80ABEHabcdefghjlmnoprstuv\u2470\u2481\u2486\u248D\u2491\u250E\u253D\u255A\u2580\u264E\u265E\u2665\u2679\u267D\u269A\u26B2\u26D8\u275D\u2768\u278B\u27C0\u2801\u2812\u0180art\u2477\u247A\u247Cr\xF2\u09C6\xF2\u0395ail;\u691Barr;\u690E\u0100;g\u0994\u248B;\u6A8Bar;\u6962\u0963\u24A5\0\u24AA\0\u24B1\0\0\0\0\0\u24B5\u24BA\0\u24C6\u24C8\u24CD\0\u24F9ute;\u413Amptyv;\u69B4ra\xEE\u084Cbda;\u43BBg\u0180;dl\u088E\u24C1\u24C3;\u6991\xE5\u088E;\u6A85uo\u803B\xAB\u40ABr\u0400;bfhlpst\u0899\u24DE\u24E6\u24E9\u24EB\u24EE\u24F1\u24F5\u0100;f\u089D\u24E3s;\u691Fs;\u691D\xEB\u2252p;\u61ABl;\u6939im;\u6973l;\u61A2\u0180;ae\u24FF\u2500\u2504\u6AABil;\u6919\u0100;s\u2509\u250A\u6AAD;\uC000\u2AAD\uFE00\u0180abr\u2515\u2519\u251Drr;\u690Crk;\u6772\u0100ak\u2522\u252Cc\u0100ek\u2528\u252A;\u407B;\u405B\u0100es\u2531\u2533;\u698Bl\u0100du\u2539\u253B;\u698F;\u698D\u0200aeuy\u2546\u254B\u2556\u2558ron;\u413E\u0100di\u2550\u2554il;\u413C\xEC\u08B0\xE2\u2529;\u443B\u0200cqrs\u2563\u2566\u256D\u257Da;\u6936uo\u0100;r\u0E19\u1746\u0100du\u2572\u2577har;\u6967shar;\u694Bh;\u61B2\u0280;fgqs\u258B\u258C\u0989\u25F3\u25FF\u6264t\u0280ahlrt\u2598\u25A4\u25B7\u25C2\u25E8rrow\u0100;t\u0899\u25A1a\xE9\u24F6arpoon\u0100du\u25AF\u25B4own\xBB\u045Ap\xBB\u0966eftarrows;\u61C7ight\u0180ahs\u25CD\u25D6\u25DErrow\u0100;s\u08F4\u08A7arpoon\xF3\u0F98quigarro\xF7\u21F0hreetimes;\u62CB\u0180;qs\u258B\u0993\u25FAlan\xF4\u09AC\u0280;cdgs\u09AC\u260A\u260D\u261D\u2628c;\u6AA8ot\u0100;o\u2614\u2615\u6A7F\u0100;r\u261A\u261B\u6A81;\u6A83\u0100;e\u2622\u2625\uC000\u22DA\uFE00s;\u6A93\u0280adegs\u2633\u2639\u263D\u2649\u264Bppro\xF8\u24C6ot;\u62D6q\u0100gq\u2643\u2645\xF4\u0989gt\xF2\u248C\xF4\u099Bi\xED\u09B2\u0180ilr\u2655\u08E1\u265Asht;\u697C;\uC000\u{1D529}\u0100;E\u099C\u2663;\u6A91\u0161\u2669\u2676r\u0100du\u25B2\u266E\u0100;l\u0965\u2673;\u696Alk;\u6584cy;\u4459\u0280;acht\u0A48\u2688\u268B\u2691\u2696r\xF2\u25C1orne\xF2\u1D08ard;\u696Bri;\u65FA\u0100io\u269F\u26A4dot;\u4140ust\u0100;a\u26AC\u26AD\u63B0che\xBB\u26AD\u0200Eaes\u26BB\u26BD\u26C9\u26D4;\u6268p\u0100;p\u26C3\u26C4\u6A89rox\xBB\u26C4\u0100;q\u26CE\u26CF\u6A87\u0100;q\u26CE\u26BBim;\u62E6\u0400abnoptwz\u26E9\u26F4\u26F7\u271A\u272F\u2741\u2747\u2750\u0100nr\u26EE\u26F1g;\u67ECr;\u61FDr\xEB\u08C1g\u0180lmr\u26FF\u270D\u2714eft\u0100ar\u09E6\u2707ight\xE1\u09F2apsto;\u67FCight\xE1\u09FDparrow\u0100lr\u2725\u2729ef\xF4\u24EDight;\u61AC\u0180afl\u2736\u2739\u273Dr;\u6985;\uC000\u{1D55D}us;\u6A2Dimes;\u6A34\u0161\u274B\u274Fst;\u6217\xE1\u134E\u0180;ef\u2757\u2758\u1800\u65CAnge\xBB\u2758ar\u0100;l\u2764\u2765\u4028t;\u6993\u0280achmt\u2773\u2776\u277C\u2785\u2787r\xF2\u08A8orne\xF2\u1D8Car\u0100;d\u0F98\u2783;\u696D;\u600Eri;\u62BF\u0300achiqt\u2798\u279D\u0A40\u27A2\u27AE\u27BBquo;\u6039r;\uC000\u{1D4C1}m\u0180;eg\u09B2\u27AA\u27AC;\u6A8D;\u6A8F\u0100bu\u252A\u27B3o\u0100;r\u0E1F\u27B9;\u601Arok;\u4142\u8400<;cdhilqr\u082B\u27D2\u2639\u27DC\u27E0\u27E5\u27EA\u27F0\u0100ci\u27D7\u27D9;\u6AA6r;\u6A79re\xE5\u25F2mes;\u62C9arr;\u6976uest;\u6A7B\u0100Pi\u27F5\u27F9ar;\u6996\u0180;ef\u2800\u092D\u181B\u65C3r\u0100du\u2807\u280Dshar;\u694Ahar;\u6966\u0100en\u2817\u2821rtneqq;\uC000\u2268\uFE00\xC5\u281E\u0700Dacdefhilnopsu\u2840\u2845\u2882\u288E\u2893\u28A0\u28A5\u28A8\u28DA\u28E2\u28E4\u0A83\u28F3\u2902Dot;\u623A\u0200clpr\u284E\u2852\u2863\u287Dr\u803B\xAF\u40AF\u0100et\u2857\u2859;\u6642\u0100;e\u285E\u285F\u6720se\xBB\u285F\u0100;s\u103B\u2868to\u0200;dlu\u103B\u2873\u2877\u287Bow\xEE\u048Cef\xF4\u090F\xF0\u13D1ker;\u65AE\u0100oy\u2887\u288Cmma;\u6A29;\u443Cash;\u6014asuredangle\xBB\u1626r;\uC000\u{1D52A}o;\u6127\u0180cdn\u28AF\u28B4\u28C9ro\u803B\xB5\u40B5\u0200;acd\u1464\u28BD\u28C0\u28C4s\xF4\u16A7ir;\u6AF0ot\u80BB\xB7\u01B5us\u0180;bd\u28D2\u1903\u28D3\u6212\u0100;u\u1D3C\u28D8;\u6A2A\u0163\u28DE\u28E1p;\u6ADB\xF2\u2212\xF0\u0A81\u0100dp\u28E9\u28EEels;\u62A7f;\uC000\u{1D55E}\u0100ct\u28F8\u28FDr;\uC000\u{1D4C2}pos\xBB\u159D\u0180;lm\u2909\u290A\u290D\u43BCtimap;\u62B8\u0C00GLRVabcdefghijlmoprstuvw\u2942\u2953\u297E\u2989\u2998\u29DA\u29E9\u2A15\u2A1A\u2A58\u2A5D\u2A83\u2A95\u2AA4\u2AA8\u2B04\u2B07\u2B44\u2B7F\u2BAE\u2C34\u2C67\u2C7C\u2CE9\u0100gt\u2947\u294B;\uC000\u22D9\u0338\u0100;v\u2950\u0BCF\uC000\u226B\u20D2\u0180elt\u295A\u2972\u2976ft\u0100ar\u2961\u2967rrow;\u61CDightarrow;\u61CE;\uC000\u22D8\u0338\u0100;v\u297B\u0C47\uC000\u226A\u20D2ightarrow;\u61CF\u0100Dd\u298E\u2993ash;\u62AFash;\u62AE\u0280bcnpt\u29A3\u29A7\u29AC\u29B1\u29CCla\xBB\u02DEute;\u4144g;\uC000\u2220\u20D2\u0280;Eiop\u0D84\u29BC\u29C0\u29C5\u29C8;\uC000\u2A70\u0338d;\uC000\u224B\u0338s;\u4149ro\xF8\u0D84ur\u0100;a\u29D3\u29D4\u666El\u0100;s\u29D3\u0B38\u01F3\u29DF\0\u29E3p\u80BB\xA0\u0B37mp\u0100;e\u0BF9\u0C00\u0280aeouy\u29F4\u29FE\u2A03\u2A10\u2A13\u01F0\u29F9\0\u29FB;\u6A43on;\u4148dil;\u4146ng\u0100;d\u0D7E\u2A0Aot;\uC000\u2A6D\u0338p;\u6A42;\u443Dash;\u6013\u0380;Aadqsx\u0B92\u2A29\u2A2D\u2A3B\u2A41\u2A45\u2A50rr;\u61D7r\u0100hr\u2A33\u2A36k;\u6924\u0100;o\u13F2\u13F0ot;\uC000\u2250\u0338ui\xF6\u0B63\u0100ei\u2A4A\u2A4Ear;\u6928\xED\u0B98ist\u0100;s\u0BA0\u0B9Fr;\uC000\u{1D52B}\u0200Eest\u0BC5\u2A66\u2A79\u2A7C\u0180;qs\u0BBC\u2A6D\u0BE1\u0180;qs\u0BBC\u0BC5\u2A74lan\xF4\u0BE2i\xED\u0BEA\u0100;r\u0BB6\u2A81\xBB\u0BB7\u0180Aap\u2A8A\u2A8D\u2A91r\xF2\u2971rr;\u61AEar;\u6AF2\u0180;sv\u0F8D\u2A9C\u0F8C\u0100;d\u2AA1\u2AA2\u62FC;\u62FAcy;\u445A\u0380AEadest\u2AB7\u2ABA\u2ABE\u2AC2\u2AC5\u2AF6\u2AF9r\xF2\u2966;\uC000\u2266\u0338rr;\u619Ar;\u6025\u0200;fqs\u0C3B\u2ACE\u2AE3\u2AEFt\u0100ar\u2AD4\u2AD9rro\xF7\u2AC1ightarro\xF7\u2A90\u0180;qs\u0C3B\u2ABA\u2AEAlan\xF4\u0C55\u0100;s\u0C55\u2AF4\xBB\u0C36i\xED\u0C5D\u0100;r\u0C35\u2AFEi\u0100;e\u0C1A\u0C25i\xE4\u0D90\u0100pt\u2B0C\u2B11f;\uC000\u{1D55F}\u8180\xAC;in\u2B19\u2B1A\u2B36\u40ACn\u0200;Edv\u0B89\u2B24\u2B28\u2B2E;\uC000\u22F9\u0338ot;\uC000\u22F5\u0338\u01E1\u0B89\u2B33\u2B35;\u62F7;\u62F6i\u0100;v\u0CB8\u2B3C\u01E1\u0CB8\u2B41\u2B43;\u62FE;\u62FD\u0180aor\u2B4B\u2B63\u2B69r\u0200;ast\u0B7B\u2B55\u2B5A\u2B5Flle\xEC\u0B7Bl;\uC000\u2AFD\u20E5;\uC000\u2202\u0338lint;\u6A14\u0180;ce\u0C92\u2B70\u2B73u\xE5\u0CA5\u0100;c\u0C98\u2B78\u0100;e\u0C92\u2B7D\xF1\u0C98\u0200Aait\u2B88\u2B8B\u2B9D\u2BA7r\xF2\u2988rr\u0180;cw\u2B94\u2B95\u2B99\u619B;\uC000\u2933\u0338;\uC000\u219D\u0338ghtarrow\xBB\u2B95ri\u0100;e\u0CCB\u0CD6\u0380chimpqu\u2BBD\u2BCD\u2BD9\u2B04\u0B78\u2BE4\u2BEF\u0200;cer\u0D32\u2BC6\u0D37\u2BC9u\xE5\u0D45;\uC000\u{1D4C3}ort\u026D\u2B05\0\0\u2BD6ar\xE1\u2B56m\u0100;e\u0D6E\u2BDF\u0100;q\u0D74\u0D73su\u0100bp\u2BEB\u2BED\xE5\u0CF8\xE5\u0D0B\u0180bcp\u2BF6\u2C11\u2C19\u0200;Ees\u2BFF\u2C00\u0D22\u2C04\u6284;\uC000\u2AC5\u0338et\u0100;e\u0D1B\u2C0Bq\u0100;q\u0D23\u2C00c\u0100;e\u0D32\u2C17\xF1\u0D38\u0200;Ees\u2C22\u2C23\u0D5F\u2C27\u6285;\uC000\u2AC6\u0338et\u0100;e\u0D58\u2C2Eq\u0100;q\u0D60\u2C23\u0200gilr\u2C3D\u2C3F\u2C45\u2C47\xEC\u0BD7lde\u803B\xF1\u40F1\xE7\u0C43iangle\u0100lr\u2C52\u2C5Ceft\u0100;e\u0C1A\u2C5A\xF1\u0C26ight\u0100;e\u0CCB\u2C65\xF1\u0CD7\u0100;m\u2C6C\u2C6D\u43BD\u0180;es\u2C74\u2C75\u2C79\u4023ro;\u6116p;\u6007\u0480DHadgilrs\u2C8F\u2C94\u2C99\u2C9E\u2CA3\u2CB0\u2CB6\u2CD3\u2CE3ash;\u62ADarr;\u6904p;\uC000\u224D\u20D2ash;\u62AC\u0100et\u2CA8\u2CAC;\uC000\u2265\u20D2;\uC000>\u20D2nfin;\u69DE\u0180Aet\u2CBD\u2CC1\u2CC5rr;\u6902;\uC000\u2264\u20D2\u0100;r\u2CCA\u2CCD\uC000<\u20D2ie;\uC000\u22B4\u20D2\u0100At\u2CD8\u2CDCrr;\u6903rie;\uC000\u22B5\u20D2im;\uC000\u223C\u20D2\u0180Aan\u2CF0\u2CF4\u2D02rr;\u61D6r\u0100hr\u2CFA\u2CFDk;\u6923\u0100;o\u13E7\u13E5ear;\u6927\u1253\u1A95\0\0\0\0\0\0\0\0\0\0\0\0\0\u2D2D\0\u2D38\u2D48\u2D60\u2D65\u2D72\u2D84\u1B07\0\0\u2D8D\u2DAB\0\u2DC8\u2DCE\0\u2DDC\u2E19\u2E2B\u2E3E\u2E43\u0100cs\u2D31\u1A97ute\u803B\xF3\u40F3\u0100iy\u2D3C\u2D45r\u0100;c\u1A9E\u2D42\u803B\xF4\u40F4;\u443E\u0280abios\u1AA0\u2D52\u2D57\u01C8\u2D5Alac;\u4151v;\u6A38old;\u69BClig;\u4153\u0100cr\u2D69\u2D6Dir;\u69BF;\uC000\u{1D52C}\u036F\u2D79\0\0\u2D7C\0\u2D82n;\u42DBave\u803B\xF2\u40F2;\u69C1\u0100bm\u2D88\u0DF4ar;\u69B5\u0200acit\u2D95\u2D98\u2DA5\u2DA8r\xF2\u1A80\u0100ir\u2D9D\u2DA0r;\u69BEoss;\u69BBn\xE5\u0E52;\u69C0\u0180aei\u2DB1\u2DB5\u2DB9cr;\u414Dga;\u43C9\u0180cdn\u2DC0\u2DC5\u01CDron;\u43BF;\u69B6pf;\uC000\u{1D560}\u0180ael\u2DD4\u2DD7\u01D2r;\u69B7rp;\u69B9\u0380;adiosv\u2DEA\u2DEB\u2DEE\u2E08\u2E0D\u2E10\u2E16\u6228r\xF2\u1A86\u0200;efm\u2DF7\u2DF8\u2E02\u2E05\u6A5Dr\u0100;o\u2DFE\u2DFF\u6134f\xBB\u2DFF\u803B\xAA\u40AA\u803B\xBA\u40BAgof;\u62B6r;\u6A56lope;\u6A57;\u6A5B\u0180clo\u2E1F\u2E21\u2E27\xF2\u2E01ash\u803B\xF8\u40F8l;\u6298i\u016C\u2E2F\u2E34de\u803B\xF5\u40F5es\u0100;a\u01DB\u2E3As;\u6A36ml\u803B\xF6\u40F6bar;\u633D\u0AE1\u2E5E\0\u2E7D\0\u2E80\u2E9D\0\u2EA2\u2EB9\0\0\u2ECB\u0E9C\0\u2F13\0\0\u2F2B\u2FBC\0\u2FC8r\u0200;ast\u0403\u2E67\u2E72\u0E85\u8100\xB6;l\u2E6D\u2E6E\u40B6le\xEC\u0403\u0269\u2E78\0\0\u2E7Bm;\u6AF3;\u6AFDy;\u443Fr\u0280cimpt\u2E8B\u2E8F\u2E93\u1865\u2E97nt;\u4025od;\u402Eil;\u6030enk;\u6031r;\uC000\u{1D52D}\u0180imo\u2EA8\u2EB0\u2EB4\u0100;v\u2EAD\u2EAE\u43C6;\u43D5ma\xF4\u0A76ne;\u660E\u0180;tv\u2EBF\u2EC0\u2EC8\u43C0chfork\xBB\u1FFD;\u43D6\u0100au\u2ECF\u2EDFn\u0100ck\u2ED5\u2EDDk\u0100;h\u21F4\u2EDB;\u610E\xF6\u21F4s\u0480;abcdemst\u2EF3\u2EF4\u1908\u2EF9\u2EFD\u2F04\u2F06\u2F0A\u2F0E\u402Bcir;\u6A23ir;\u6A22\u0100ou\u1D40\u2F02;\u6A25;\u6A72n\u80BB\xB1\u0E9Dim;\u6A26wo;\u6A27\u0180ipu\u2F19\u2F20\u2F25ntint;\u6A15f;\uC000\u{1D561}nd\u803B\xA3\u40A3\u0500;Eaceinosu\u0EC8\u2F3F\u2F41\u2F44\u2F47\u2F81\u2F89\u2F92\u2F7E\u2FB6;\u6AB3p;\u6AB7u\xE5\u0ED9\u0100;c\u0ECE\u2F4C\u0300;acens\u0EC8\u2F59\u2F5F\u2F66\u2F68\u2F7Eppro\xF8\u2F43urlye\xF1\u0ED9\xF1\u0ECE\u0180aes\u2F6F\u2F76\u2F7Approx;\u6AB9qq;\u6AB5im;\u62E8i\xED\u0EDFme\u0100;s\u2F88\u0EAE\u6032\u0180Eas\u2F78\u2F90\u2F7A\xF0\u2F75\u0180dfp\u0EEC\u2F99\u2FAF\u0180als\u2FA0\u2FA5\u2FAAlar;\u632Eine;\u6312urf;\u6313\u0100;t\u0EFB\u2FB4\xEF\u0EFBrel;\u62B0\u0100ci\u2FC0\u2FC5r;\uC000\u{1D4C5};\u43C8ncsp;\u6008\u0300fiopsu\u2FDA\u22E2\u2FDF\u2FE5\u2FEB\u2FF1r;\uC000\u{1D52E}pf;\uC000\u{1D562}rime;\u6057cr;\uC000\u{1D4C6}\u0180aeo\u2FF8\u3009\u3013t\u0100ei\u2FFE\u3005rnion\xF3\u06B0nt;\u6A16st\u0100;e\u3010\u3011\u403F\xF1\u1F19\xF4\u0F14\u0A80ABHabcdefhilmnoprstux\u3040\u3051\u3055\u3059\u30E0\u310E\u312B\u3147\u3162\u3172\u318E\u3206\u3215\u3224\u3229\u3258\u326E\u3272\u3290\u32B0\u32B7\u0180art\u3047\u304A\u304Cr\xF2\u10B3\xF2\u03DDail;\u691Car\xF2\u1C65ar;\u6964\u0380cdenqrt\u3068\u3075\u3078\u307F\u308F\u3094\u30CC\u0100eu\u306D\u3071;\uC000\u223D\u0331te;\u4155i\xE3\u116Emptyv;\u69B3g\u0200;del\u0FD1\u3089\u308B\u308D;\u6992;\u69A5\xE5\u0FD1uo\u803B\xBB\u40BBr\u0580;abcfhlpstw\u0FDC\u30AC\u30AF\u30B7\u30B9\u30BC\u30BE\u30C0\u30C3\u30C7\u30CAp;\u6975\u0100;f\u0FE0\u30B4s;\u6920;\u6933s;\u691E\xEB\u225D\xF0\u272El;\u6945im;\u6974l;\u61A3;\u619D\u0100ai\u30D1\u30D5il;\u691Ao\u0100;n\u30DB\u30DC\u6236al\xF3\u0F1E\u0180abr\u30E7\u30EA\u30EEr\xF2\u17E5rk;\u6773\u0100ak\u30F3\u30FDc\u0100ek\u30F9\u30FB;\u407D;\u405D\u0100es\u3102\u3104;\u698Cl\u0100du\u310A\u310C;\u698E;\u6990\u0200aeuy\u3117\u311C\u3127\u3129ron;\u4159\u0100di\u3121\u3125il;\u4157\xEC\u0FF2\xE2\u30FA;\u4440\u0200clqs\u3134\u3137\u313D\u3144a;\u6937dhar;\u6969uo\u0100;r\u020E\u020Dh;\u61B3\u0180acg\u314E\u315F\u0F44l\u0200;ips\u0F78\u3158\u315B\u109Cn\xE5\u10BBar\xF4\u0FA9t;\u65AD\u0180ilr\u3169\u1023\u316Esht;\u697D;\uC000\u{1D52F}\u0100ao\u3177\u3186r\u0100du\u317D\u317F\xBB\u047B\u0100;l\u1091\u3184;\u696C\u0100;v\u318B\u318C\u43C1;\u43F1\u0180gns\u3195\u31F9\u31FCht\u0300ahlrst\u31A4\u31B0\u31C2\u31D8\u31E4\u31EErrow\u0100;t\u0FDC\u31ADa\xE9\u30C8arpoon\u0100du\u31BB\u31BFow\xEE\u317Ep\xBB\u1092eft\u0100ah\u31CA\u31D0rrow\xF3\u0FEAarpoon\xF3\u0551ightarrows;\u61C9quigarro\xF7\u30CBhreetimes;\u62CCg;\u42DAingdotse\xF1\u1F32\u0180ahm\u320D\u3210\u3213r\xF2\u0FEAa\xF2\u0551;\u600Foust\u0100;a\u321E\u321F\u63B1che\xBB\u321Fmid;\u6AEE\u0200abpt\u3232\u323D\u3240\u3252\u0100nr\u3237\u323Ag;\u67EDr;\u61FEr\xEB\u1003\u0180afl\u3247\u324A\u324Er;\u6986;\uC000\u{1D563}us;\u6A2Eimes;\u6A35\u0100ap\u325D\u3267r\u0100;g\u3263\u3264\u4029t;\u6994olint;\u6A12ar\xF2\u31E3\u0200achq\u327B\u3280\u10BC\u3285quo;\u603Ar;\uC000\u{1D4C7}\u0100bu\u30FB\u328Ao\u0100;r\u0214\u0213\u0180hir\u3297\u329B\u32A0re\xE5\u31F8mes;\u62CAi\u0200;efl\u32AA\u1059\u1821\u32AB\u65B9tri;\u69CEluhar;\u6968;\u611E\u0D61\u32D5\u32DB\u32DF\u332C\u3338\u3371\0\u337A\u33A4\0\0\u33EC\u33F0\0\u3428\u3448\u345A\u34AD\u34B1\u34CA\u34F1\0\u3616\0\0\u3633cute;\u415Bqu\xEF\u27BA\u0500;Eaceinpsy\u11ED\u32F3\u32F5\u32FF\u3302\u330B\u330F\u331F\u3326\u3329;\u6AB4\u01F0\u32FA\0\u32FC;\u6AB8on;\u4161u\xE5\u11FE\u0100;d\u11F3\u3307il;\u415Frc;\u415D\u0180Eas\u3316\u3318\u331B;\u6AB6p;\u6ABAim;\u62E9olint;\u6A13i\xED\u1204;\u4441ot\u0180;be\u3334\u1D47\u3335\u62C5;\u6A66\u0380Aacmstx\u3346\u334A\u3357\u335B\u335E\u3363\u336Drr;\u61D8r\u0100hr\u3350\u3352\xEB\u2228\u0100;o\u0A36\u0A34t\u803B\xA7\u40A7i;\u403Bwar;\u6929m\u0100in\u3369\xF0nu\xF3\xF1t;\u6736r\u0100;o\u3376\u2055\uC000\u{1D530}\u0200acoy\u3382\u3386\u3391\u33A0rp;\u666F\u0100hy\u338B\u338Fcy;\u4449;\u4448rt\u026D\u3399\0\0\u339Ci\xE4\u1464ara\xEC\u2E6F\u803B\xAD\u40AD\u0100gm\u33A8\u33B4ma\u0180;fv\u33B1\u33B2\u33B2\u43C3;\u43C2\u0400;deglnpr\u12AB\u33C5\u33C9\u33CE\u33D6\u33DE\u33E1\u33E6ot;\u6A6A\u0100;q\u12B1\u12B0\u0100;E\u33D3\u33D4\u6A9E;\u6AA0\u0100;E\u33DB\u33DC\u6A9D;\u6A9Fe;\u6246lus;\u6A24arr;\u6972ar\xF2\u113D\u0200aeit\u33F8\u3408\u340F\u3417\u0100ls\u33FD\u3404lsetm\xE9\u336Ahp;\u6A33parsl;\u69E4\u0100dl\u1463\u3414e;\u6323\u0100;e\u341C\u341D\u6AAA\u0100;s\u3422\u3423\u6AAC;\uC000\u2AAC\uFE00\u0180flp\u342E\u3433\u3442tcy;\u444C\u0100;b\u3438\u3439\u402F\u0100;a\u343E\u343F\u69C4r;\u633Ff;\uC000\u{1D564}a\u0100dr\u344D\u0402es\u0100;u\u3454\u3455\u6660it\xBB\u3455\u0180csu\u3460\u3479\u349F\u0100au\u3465\u346Fp\u0100;s\u1188\u346B;\uC000\u2293\uFE00p\u0100;s\u11B4\u3475;\uC000\u2294\uFE00u\u0100bp\u347F\u348F\u0180;es\u1197\u119C\u3486et\u0100;e\u1197\u348D\xF1\u119D\u0180;es\u11A8\u11AD\u3496et\u0100;e\u11A8\u349D\xF1\u11AE\u0180;af\u117B\u34A6\u05B0r\u0165\u34AB\u05B1\xBB\u117Car\xF2\u1148\u0200cemt\u34B9\u34BE\u34C2\u34C5r;\uC000\u{1D4C8}tm\xEE\xF1i\xEC\u3415ar\xE6\u11BE\u0100ar\u34CE\u34D5r\u0100;f\u34D4\u17BF\u6606\u0100an\u34DA\u34EDight\u0100ep\u34E3\u34EApsilo\xEE\u1EE0h\xE9\u2EAFs\xBB\u2852\u0280bcmnp\u34FB\u355E\u1209\u358B\u358E\u0480;Edemnprs\u350E\u350F\u3511\u3515\u351E\u3523\u352C\u3531\u3536\u6282;\u6AC5ot;\u6ABD\u0100;d\u11DA\u351Aot;\u6AC3ult;\u6AC1\u0100Ee\u3528\u352A;\u6ACB;\u628Alus;\u6ABFarr;\u6979\u0180eiu\u353D\u3552\u3555t\u0180;en\u350E\u3545\u354Bq\u0100;q\u11DA\u350Feq\u0100;q\u352B\u3528m;\u6AC7\u0100bp\u355A\u355C;\u6AD5;\u6AD3c\u0300;acens\u11ED\u356C\u3572\u3579\u357B\u3326ppro\xF8\u32FAurlye\xF1\u11FE\xF1\u11F3\u0180aes\u3582\u3588\u331Bppro\xF8\u331Aq\xF1\u3317g;\u666A\u0680123;Edehlmnps\u35A9\u35AC\u35AF\u121C\u35B2\u35B4\u35C0\u35C9\u35D5\u35DA\u35DF\u35E8\u35ED\u803B\xB9\u40B9\u803B\xB2\u40B2\u803B\xB3\u40B3;\u6AC6\u0100os\u35B9\u35BCt;\u6ABEub;\u6AD8\u0100;d\u1222\u35C5ot;\u6AC4s\u0100ou\u35CF\u35D2l;\u67C9b;\u6AD7arr;\u697Bult;\u6AC2\u0100Ee\u35E4\u35E6;\u6ACC;\u628Blus;\u6AC0\u0180eiu\u35F4\u3609\u360Ct\u0180;en\u121C\u35FC\u3602q\u0100;q\u1222\u35B2eq\u0100;q\u35E7\u35E4m;\u6AC8\u0100bp\u3611\u3613;\u6AD4;\u6AD6\u0180Aan\u361C\u3620\u362Drr;\u61D9r\u0100hr\u3626\u3628\xEB\u222E\u0100;o\u0A2B\u0A29war;\u692Alig\u803B\xDF\u40DF\u0BE1\u3651\u365D\u3660\u12CE\u3673\u3679\0\u367E\u36C2\0\0\0\0\0\u36DB\u3703\0\u3709\u376C\0\0\0\u3787\u0272\u3656\0\0\u365Bget;\u6316;\u43C4r\xEB\u0E5F\u0180aey\u3666\u366B\u3670ron;\u4165dil;\u4163;\u4442lrec;\u6315r;\uC000\u{1D531}\u0200eiko\u3686\u369D\u36B5\u36BC\u01F2\u368B\0\u3691e\u01004f\u1284\u1281a\u0180;sv\u3698\u3699\u369B\u43B8ym;\u43D1\u0100cn\u36A2\u36B2k\u0100as\u36A8\u36AEppro\xF8\u12C1im\xBB\u12ACs\xF0\u129E\u0100as\u36BA\u36AE\xF0\u12C1rn\u803B\xFE\u40FE\u01EC\u031F\u36C6\u22E7es\u8180\xD7;bd\u36CF\u36D0\u36D8\u40D7\u0100;a\u190F\u36D5r;\u6A31;\u6A30\u0180eps\u36E1\u36E3\u3700\xE1\u2A4D\u0200;bcf\u0486\u36EC\u36F0\u36F4ot;\u6336ir;\u6AF1\u0100;o\u36F9\u36FC\uC000\u{1D565}rk;\u6ADA\xE1\u3362rime;\u6034\u0180aip\u370F\u3712\u3764d\xE5\u1248\u0380adempst\u3721\u374D\u3740\u3751\u3757\u375C\u375Fngle\u0280;dlqr\u3730\u3731\u3736\u3740\u3742\u65B5own\xBB\u1DBBeft\u0100;e\u2800\u373E\xF1\u092E;\u625Cight\u0100;e\u32AA\u374B\xF1\u105Aot;\u65ECinus;\u6A3Alus;\u6A39b;\u69CDime;\u6A3Bezium;\u63E2\u0180cht\u3772\u377D\u3781\u0100ry\u3777\u377B;\uC000\u{1D4C9};\u4446cy;\u445Brok;\u4167\u0100io\u378B\u378Ex\xF4\u1777head\u0100lr\u3797\u37A0eftarro\xF7\u084Fightarrow\xBB\u0F5D\u0900AHabcdfghlmoprstuw\u37D0\u37D3\u37D7\u37E4\u37F0\u37FC\u380E\u381C\u3823\u3834\u3851\u385D\u386B\u38A9\u38CC\u38D2\u38EA\u38F6r\xF2\u03EDar;\u6963\u0100cr\u37DC\u37E2ute\u803B\xFA\u40FA\xF2\u1150r\u01E3\u37EA\0\u37EDy;\u445Eve;\u416D\u0100iy\u37F5\u37FArc\u803B\xFB\u40FB;\u4443\u0180abh\u3803\u3806\u380Br\xF2\u13ADlac;\u4171a\xF2\u13C3\u0100ir\u3813\u3818sht;\u697E;\uC000\u{1D532}rave\u803B\xF9\u40F9\u0161\u3827\u3831r\u0100lr\u382C\u382E\xBB\u0957\xBB\u1083lk;\u6580\u0100ct\u3839\u384D\u026F\u383F\0\0\u384Arn\u0100;e\u3845\u3846\u631Cr\xBB\u3846op;\u630Fri;\u65F8\u0100al\u3856\u385Acr;\u416B\u80BB\xA8\u0349\u0100gp\u3862\u3866on;\u4173f;\uC000\u{1D566}\u0300adhlsu\u114B\u3878\u387D\u1372\u3891\u38A0own\xE1\u13B3arpoon\u0100lr\u3888\u388Cef\xF4\u382Digh\xF4\u382Fi\u0180;hl\u3899\u389A\u389C\u43C5\xBB\u13FAon\xBB\u389Aparrows;\u61C8\u0180cit\u38B0\u38C4\u38C8\u026F\u38B6\0\0\u38C1rn\u0100;e\u38BC\u38BD\u631Dr\xBB\u38BDop;\u630Eng;\u416Fri;\u65F9cr;\uC000\u{1D4CA}\u0180dir\u38D9\u38DD\u38E2ot;\u62F0lde;\u4169i\u0100;f\u3730\u38E8\xBB\u1813\u0100am\u38EF\u38F2r\xF2\u38A8l\u803B\xFC\u40FCangle;\u69A7\u0780ABDacdeflnoprsz\u391C\u391F\u3929\u392D\u39B5\u39B8\u39BD\u39DF\u39E4\u39E8\u39F3\u39F9\u39FD\u3A01\u3A20r\xF2\u03F7ar\u0100;v\u3926\u3927\u6AE8;\u6AE9as\xE8\u03E1\u0100nr\u3932\u3937grt;\u699C\u0380eknprst\u34E3\u3946\u394B\u3952\u395D\u3964\u3996app\xE1\u2415othin\xE7\u1E96\u0180hir\u34EB\u2EC8\u3959op\xF4\u2FB5\u0100;h\u13B7\u3962\xEF\u318D\u0100iu\u3969\u396Dgm\xE1\u33B3\u0100bp\u3972\u3984setneq\u0100;q\u397D\u3980\uC000\u228A\uFE00;\uC000\u2ACB\uFE00setneq\u0100;q\u398F\u3992\uC000\u228B\uFE00;\uC000\u2ACC\uFE00\u0100hr\u399B\u399Fet\xE1\u369Ciangle\u0100lr\u39AA\u39AFeft\xBB\u0925ight\xBB\u1051y;\u4432ash\xBB\u1036\u0180elr\u39C4\u39D2\u39D7\u0180;be\u2DEA\u39CB\u39CFar;\u62BBq;\u625Alip;\u62EE\u0100bt\u39DC\u1468a\xF2\u1469r;\uC000\u{1D533}tr\xE9\u39AEsu\u0100bp\u39EF\u39F1\xBB\u0D1C\xBB\u0D59pf;\uC000\u{1D567}ro\xF0\u0EFBtr\xE9\u39B4\u0100cu\u3A06\u3A0Br;\uC000\u{1D4CB}\u0100bp\u3A10\u3A18n\u0100Ee\u3980\u3A16\xBB\u397En\u0100Ee\u3992\u3A1E\xBB\u3990igzag;\u699A\u0380cefoprs\u3A36\u3A3B\u3A56\u3A5B\u3A54\u3A61\u3A6Airc;\u4175\u0100di\u3A40\u3A51\u0100bg\u3A45\u3A49ar;\u6A5Fe\u0100;q\u15FA\u3A4F;\u6259erp;\u6118r;\uC000\u{1D534}pf;\uC000\u{1D568}\u0100;e\u1479\u3A66at\xE8\u1479cr;\uC000\u{1D4CC}\u0AE3\u178E\u3A87\0\u3A8B\0\u3A90\u3A9B\0\0\u3A9D\u3AA8\u3AAB\u3AAF\0\0\u3AC3\u3ACE\0\u3AD8\u17DC\u17DFtr\xE9\u17D1r;\uC000\u{1D535}\u0100Aa\u3A94\u3A97r\xF2\u03C3r\xF2\u09F6;\u43BE\u0100Aa\u3AA1\u3AA4r\xF2\u03B8r\xF2\u09EBa\xF0\u2713is;\u62FB\u0180dpt\u17A4\u3AB5\u3ABE\u0100fl\u3ABA\u17A9;\uC000\u{1D569}im\xE5\u17B2\u0100Aa\u3AC7\u3ACAr\xF2\u03CEr\xF2\u0A01\u0100cq\u3AD2\u17B8r;\uC000\u{1D4CD}\u0100pt\u17D6\u3ADCr\xE9\u17D4\u0400acefiosu\u3AF0\u3AFD\u3B08\u3B0C\u3B11\u3B15\u3B1B\u3B21c\u0100uy\u3AF6\u3AFBte\u803B\xFD\u40FD;\u444F\u0100iy\u3B02\u3B06rc;\u4177;\u444Bn\u803B\xA5\u40A5r;\uC000\u{1D536}cy;\u4457pf;\uC000\u{1D56A}cr;\uC000\u{1D4CE}\u0100cm\u3B26\u3B29y;\u444El\u803B\xFF\u40FF\u0500acdefhiosw\u3B42\u3B48\u3B54\u3B58\u3B64\u3B69\u3B6D\u3B74\u3B7A\u3B80cute;\u417A\u0100ay\u3B4D\u3B52ron;\u417E;\u4437ot;\u417C\u0100et\u3B5D\u3B61tr\xE6\u155Fa;\u43B6r;\uC000\u{1D537}cy;\u4436grarr;\u61DDpf;\uC000\u{1D56B}cr;\uC000\u{1D4CF}\u0100jn\u3B85\u3B87;\u600Dj;\u600C'
        .split("")
        .map((t) => t.charCodeAt(0))
    );
  });
var ba,
  Fm = b(() => {
    ba = new Uint16Array(
      "\u0200aglq	\x1B\u026D\0\0p;\u4026os;\u4027t;\u403Et;\u403Cuot;\u4022"
        .split("")
        .map((t) => t.charCodeAt(0))
    );
  });
function gd(t) {
  var e;
  return (t >= 55296 && t <= 57343) || t > 1114111
    ? 65533
    : (e = i4.get(t)) !== null && e !== void 0
    ? e
    : t;
}
var md,
  i4,
  ns,
  bd = b(() => {
    (i4 = new Map([
      [0, 65533],
      [128, 8364],
      [130, 8218],
      [131, 402],
      [132, 8222],
      [133, 8230],
      [134, 8224],
      [135, 8225],
      [136, 710],
      [137, 8240],
      [138, 352],
      [139, 8249],
      [140, 338],
      [142, 381],
      [145, 8216],
      [146, 8217],
      [147, 8220],
      [148, 8221],
      [149, 8226],
      [150, 8211],
      [151, 8212],
      [152, 732],
      [153, 8482],
      [154, 353],
      [155, 8250],
      [156, 339],
      [158, 382],
      [159, 376],
    ])),
      (ns =
        (md = String.fromCodePoint) !== null && md !== void 0
          ? md
          : function (t) {
              let e = "";
              return (
                t > 65535 &&
                  ((t -= 65536),
                  (e += String.fromCharCode(((t >>> 10) & 1023) | 55296)),
                  (t = 56320 | (t & 1023))),
                (e += String.fromCharCode(t)),
                e
              );
            });
  });
function yd(t) {
  return t >= Me.ZERO && t <= Me.NINE;
}
function a4(t) {
  return (
    (t >= Me.UPPER_A && t <= Me.UPPER_F) || (t >= Me.LOWER_A && t <= Me.LOWER_F)
  );
}
function u4(t) {
  return (
    (t >= Me.UPPER_A && t <= Me.UPPER_Z) ||
    (t >= Me.LOWER_A && t <= Me.LOWER_Z) ||
    yd(t)
  );
}
function c4(t) {
  return t === Me.EQUALS || u4(t);
}
function Hm(t) {
  let e = "",
    r = new ss(t, (n) => (e += ns(n)));
  return function (s, i) {
    let o = 0,
      a = 0;
    for (; (a = s.indexOf("&", a)) >= 0; ) {
      (e += s.slice(o, a)), r.startEntity(i);
      let c = r.write(s, a + 1);
      if (c < 0) {
        o = a + r.end();
        break;
      }
      (o = a + c), (a = c === 0 ? o + 1 : o);
    }
    let u = e + s.slice(o);
    return (e = ""), u;
  };
}
function l4(t, e, r, n) {
  let s = (e & Br.BRANCH_LENGTH) >> 7,
    i = e & Br.JUMP_TABLE;
  if (s === 0) return i !== 0 && n === i ? r : -1;
  if (i) {
    let u = n - i;
    return u < 0 || u >= s ? -1 : t[r + u] - 1;
  }
  let o = r,
    a = o + s - 1;
  for (; o <= a; ) {
    let u = (o + a) >>> 1,
      c = t[u];
    if (c < n) o = u + 1;
    else if (c > n) a = u - 1;
    else return t[u + s];
  }
  return -1;
}
var Me,
  o4,
  Br,
  De,
  pt,
  ss,
  H9,
  j9,
  ei = b(() => {
    $m();
    Fm();
    bd();
    bd();
    (function (t) {
      (t[(t.NUM = 35)] = "NUM"),
        (t[(t.SEMI = 59)] = "SEMI"),
        (t[(t.EQUALS = 61)] = "EQUALS"),
        (t[(t.ZERO = 48)] = "ZERO"),
        (t[(t.NINE = 57)] = "NINE"),
        (t[(t.LOWER_A = 97)] = "LOWER_A"),
        (t[(t.LOWER_F = 102)] = "LOWER_F"),
        (t[(t.LOWER_X = 120)] = "LOWER_X"),
        (t[(t.LOWER_Z = 122)] = "LOWER_Z"),
        (t[(t.UPPER_A = 65)] = "UPPER_A"),
        (t[(t.UPPER_F = 70)] = "UPPER_F"),
        (t[(t.UPPER_Z = 90)] = "UPPER_Z");
    })(Me || (Me = {}));
    o4 = 32;
    (function (t) {
      (t[(t.VALUE_LENGTH = 49152)] = "VALUE_LENGTH"),
        (t[(t.BRANCH_LENGTH = 16256)] = "BRANCH_LENGTH"),
        (t[(t.JUMP_TABLE = 127)] = "JUMP_TABLE");
    })(Br || (Br = {}));
    (function (t) {
      (t[(t.EntityStart = 0)] = "EntityStart"),
        (t[(t.NumericStart = 1)] = "NumericStart"),
        (t[(t.NumericDecimal = 2)] = "NumericDecimal"),
        (t[(t.NumericHex = 3)] = "NumericHex"),
        (t[(t.NamedEntity = 4)] = "NamedEntity");
    })(De || (De = {}));
    (function (t) {
      (t[(t.Legacy = 0)] = "Legacy"),
        (t[(t.Strict = 1)] = "Strict"),
        (t[(t.Attribute = 2)] = "Attribute");
    })(pt || (pt = {}));
    ss = class {
      constructor(e, r, n) {
        (this.decodeTree = e),
          (this.emitCodePoint = r),
          (this.errors = n),
          (this.state = De.EntityStart),
          (this.consumed = 1),
          (this.result = 0),
          (this.treeIndex = 0),
          (this.excess = 1),
          (this.decodeMode = pt.Strict);
      }
      startEntity(e) {
        (this.decodeMode = e),
          (this.state = De.EntityStart),
          (this.result = 0),
          (this.treeIndex = 0),
          (this.excess = 1),
          (this.consumed = 1);
      }
      write(e, r) {
        switch (this.state) {
          case De.EntityStart:
            return e.charCodeAt(r) === Me.NUM
              ? ((this.state = De.NumericStart),
                (this.consumed += 1),
                this.stateNumericStart(e, r + 1))
              : ((this.state = De.NamedEntity), this.stateNamedEntity(e, r));
          case De.NumericStart:
            return this.stateNumericStart(e, r);
          case De.NumericDecimal:
            return this.stateNumericDecimal(e, r);
          case De.NumericHex:
            return this.stateNumericHex(e, r);
          case De.NamedEntity:
            return this.stateNamedEntity(e, r);
        }
      }
      stateNumericStart(e, r) {
        return r >= e.length
          ? -1
          : (e.charCodeAt(r) | o4) === Me.LOWER_X
          ? ((this.state = De.NumericHex),
            (this.consumed += 1),
            this.stateNumericHex(e, r + 1))
          : ((this.state = De.NumericDecimal), this.stateNumericDecimal(e, r));
      }
      addToNumericResult(e, r, n, s) {
        if (r !== n) {
          let i = n - r;
          (this.result =
            this.result * Math.pow(s, i) + parseInt(e.substr(r, i), s)),
            (this.consumed += i);
        }
      }
      stateNumericHex(e, r) {
        let n = r;
        for (; r < e.length; ) {
          let s = e.charCodeAt(r);
          if (yd(s) || a4(s)) r += 1;
          else
            return (
              this.addToNumericResult(e, n, r, 16), this.emitNumericEntity(s, 3)
            );
        }
        return this.addToNumericResult(e, n, r, 16), -1;
      }
      stateNumericDecimal(e, r) {
        let n = r;
        for (; r < e.length; ) {
          let s = e.charCodeAt(r);
          if (yd(s)) r += 1;
          else
            return (
              this.addToNumericResult(e, n, r, 10), this.emitNumericEntity(s, 2)
            );
        }
        return this.addToNumericResult(e, n, r, 10), -1;
      }
      emitNumericEntity(e, r) {
        var n;
        if (this.consumed <= r)
          return (
            (n = this.errors) === null ||
              n === void 0 ||
              n.absenceOfDigitsInNumericCharacterReference(this.consumed),
            0
          );
        if (e === Me.SEMI) this.consumed += 1;
        else if (this.decodeMode === pt.Strict) return 0;
        return (
          this.emitCodePoint(gd(this.result), this.consumed),
          this.errors &&
            (e !== Me.SEMI &&
              this.errors.missingSemicolonAfterCharacterReference(),
            this.errors.validateNumericCharacterReference(this.result)),
          this.consumed
        );
      }
      stateNamedEntity(e, r) {
        let {decodeTree: n} = this,
          s = n[this.treeIndex],
          i = (s & Br.VALUE_LENGTH) >> 14;
        for (; r < e.length; r++, this.excess++) {
          let o = e.charCodeAt(r);
          if (
            ((this.treeIndex = l4(n, s, this.treeIndex + Math.max(1, i), o)),
            this.treeIndex < 0)
          )
            return this.result === 0 ||
              (this.decodeMode === pt.Attribute && (i === 0 || c4(o)))
              ? 0
              : this.emitNotTerminatedNamedEntity();
          if (
            ((s = n[this.treeIndex]),
            (i = (s & Br.VALUE_LENGTH) >> 14),
            i !== 0)
          ) {
            if (o === Me.SEMI)
              return this.emitNamedEntityData(
                this.treeIndex,
                i,
                this.consumed + this.excess
              );
            this.decodeMode !== pt.Strict &&
              ((this.result = this.treeIndex),
              (this.consumed += this.excess),
              (this.excess = 0));
          }
        }
        return -1;
      }
      emitNotTerminatedNamedEntity() {
        var e;
        let {result: r, decodeTree: n} = this,
          s = (n[r] & Br.VALUE_LENGTH) >> 14;
        return (
          this.emitNamedEntityData(r, s, this.consumed),
          (e = this.errors) === null ||
            e === void 0 ||
            e.missingSemicolonAfterCharacterReference(),
          this.consumed
        );
      }
      emitNamedEntityData(e, r, n) {
        let {decodeTree: s} = this;
        return (
          this.emitCodePoint(r === 1 ? s[e] & ~Br.VALUE_LENGTH : s[e + 1], n),
          r === 3 && this.emitCodePoint(s[e + 2], n),
          n
        );
      }
      end() {
        var e;
        switch (this.state) {
          case De.NamedEntity:
            return this.result !== 0 &&
              (this.decodeMode !== pt.Attribute ||
                this.result === this.treeIndex)
              ? this.emitNotTerminatedNamedEntity()
              : 0;
          case De.NumericDecimal:
            return this.emitNumericEntity(0, 2);
          case De.NumericHex:
            return this.emitNumericEntity(0, 3);
          case De.NumericStart:
            return (
              (e = this.errors) === null ||
                e === void 0 ||
                e.absenceOfDigitsInNumericCharacterReference(this.consumed),
              0
            );
          case De.EntityStart:
            return 0;
        }
      }
    };
    (H9 = Hm(ga)), (j9 = Hm(ba));
  });
function mr(t) {
  return (
    t === q.Space ||
    t === q.NewLine ||
    t === q.Tab ||
    t === q.FormFeed ||
    t === q.CarriageReturn
  );
}
function ya(t) {
  return t === q.Slash || t === q.Gt || mr(t);
}
function d4(t) {
  return (t >= q.LowerA && t <= q.LowerZ) || (t >= q.UpperA && t <= q.UpperZ);
}
var q,
  N,
  ht,
  Ue,
  yn,
  xd = b(() => {
    ei();
    (function (t) {
      (t[(t.Tab = 9)] = "Tab"),
        (t[(t.NewLine = 10)] = "NewLine"),
        (t[(t.FormFeed = 12)] = "FormFeed"),
        (t[(t.CarriageReturn = 13)] = "CarriageReturn"),
        (t[(t.Space = 32)] = "Space"),
        (t[(t.ExclamationMark = 33)] = "ExclamationMark"),
        (t[(t.Number = 35)] = "Number"),
        (t[(t.Amp = 38)] = "Amp"),
        (t[(t.SingleQuote = 39)] = "SingleQuote"),
        (t[(t.DoubleQuote = 34)] = "DoubleQuote"),
        (t[(t.Dash = 45)] = "Dash"),
        (t[(t.Slash = 47)] = "Slash"),
        (t[(t.Zero = 48)] = "Zero"),
        (t[(t.Nine = 57)] = "Nine"),
        (t[(t.Semi = 59)] = "Semi"),
        (t[(t.Lt = 60)] = "Lt"),
        (t[(t.Eq = 61)] = "Eq"),
        (t[(t.Gt = 62)] = "Gt"),
        (t[(t.Questionmark = 63)] = "Questionmark"),
        (t[(t.UpperA = 65)] = "UpperA"),
        (t[(t.LowerA = 97)] = "LowerA"),
        (t[(t.UpperF = 70)] = "UpperF"),
        (t[(t.LowerF = 102)] = "LowerF"),
        (t[(t.UpperZ = 90)] = "UpperZ"),
        (t[(t.LowerZ = 122)] = "LowerZ"),
        (t[(t.LowerX = 120)] = "LowerX"),
        (t[(t.OpeningSquareBracket = 91)] = "OpeningSquareBracket");
    })(q || (q = {}));
    (function (t) {
      (t[(t.Text = 1)] = "Text"),
        (t[(t.BeforeTagName = 2)] = "BeforeTagName"),
        (t[(t.InTagName = 3)] = "InTagName"),
        (t[(t.InSelfClosingTag = 4)] = "InSelfClosingTag"),
        (t[(t.BeforeClosingTagName = 5)] = "BeforeClosingTagName"),
        (t[(t.InClosingTagName = 6)] = "InClosingTagName"),
        (t[(t.AfterClosingTagName = 7)] = "AfterClosingTagName"),
        (t[(t.BeforeAttributeName = 8)] = "BeforeAttributeName"),
        (t[(t.InAttributeName = 9)] = "InAttributeName"),
        (t[(t.AfterAttributeName = 10)] = "AfterAttributeName"),
        (t[(t.BeforeAttributeValue = 11)] = "BeforeAttributeValue"),
        (t[(t.InAttributeValueDq = 12)] = "InAttributeValueDq"),
        (t[(t.InAttributeValueSq = 13)] = "InAttributeValueSq"),
        (t[(t.InAttributeValueNq = 14)] = "InAttributeValueNq"),
        (t[(t.BeforeDeclaration = 15)] = "BeforeDeclaration"),
        (t[(t.InDeclaration = 16)] = "InDeclaration"),
        (t[(t.InProcessingInstruction = 17)] = "InProcessingInstruction"),
        (t[(t.BeforeComment = 18)] = "BeforeComment"),
        (t[(t.CDATASequence = 19)] = "CDATASequence"),
        (t[(t.InSpecialComment = 20)] = "InSpecialComment"),
        (t[(t.InCommentLike = 21)] = "InCommentLike"),
        (t[(t.BeforeSpecialS = 22)] = "BeforeSpecialS"),
        (t[(t.BeforeSpecialT = 23)] = "BeforeSpecialT"),
        (t[(t.SpecialStartSequence = 24)] = "SpecialStartSequence"),
        (t[(t.InSpecialTag = 25)] = "InSpecialTag"),
        (t[(t.InEntity = 26)] = "InEntity");
    })(N || (N = {}));
    (function (t) {
      (t[(t.NoValue = 0)] = "NoValue"),
        (t[(t.Unquoted = 1)] = "Unquoted"),
        (t[(t.Single = 2)] = "Single"),
        (t[(t.Double = 3)] = "Double");
    })(ht || (ht = {}));
    (Ue = {
      Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
      CdataEnd: new Uint8Array([93, 93, 62]),
      CommentEnd: new Uint8Array([45, 45, 62]),
      ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
      StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
      TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
      TextareaEnd: new Uint8Array([
        60, 47, 116, 101, 120, 116, 97, 114, 101, 97,
      ]),
    }),
      (yn = class {
        constructor({xmlMode: e = !1, decodeEntities: r = !0}, n) {
          (this.cbs = n),
            (this.state = N.Text),
            (this.buffer = ""),
            (this.sectionStart = 0),
            (this.index = 0),
            (this.entityStart = 0),
            (this.baseState = N.Text),
            (this.isSpecial = !1),
            (this.running = !0),
            (this.offset = 0),
            (this.currentSequence = void 0),
            (this.sequenceIndex = 0),
            (this.xmlMode = e),
            (this.decodeEntities = r),
            (this.entityDecoder = new ss(e ? ba : ga, (s, i) =>
              this.emitCodePoint(s, i)
            ));
        }
        reset() {
          (this.state = N.Text),
            (this.buffer = ""),
            (this.sectionStart = 0),
            (this.index = 0),
            (this.baseState = N.Text),
            (this.currentSequence = void 0),
            (this.running = !0),
            (this.offset = 0);
        }
        write(e) {
          (this.offset += this.buffer.length), (this.buffer = e), this.parse();
        }
        end() {
          this.running && this.finish();
        }
        pause() {
          this.running = !1;
        }
        resume() {
          (this.running = !0),
            this.index < this.buffer.length + this.offset && this.parse();
        }
        stateText(e) {
          e === q.Lt || (!this.decodeEntities && this.fastForwardTo(q.Lt))
            ? (this.index > this.sectionStart &&
                this.cbs.ontext(this.sectionStart, this.index),
              (this.state = N.BeforeTagName),
              (this.sectionStart = this.index))
            : this.decodeEntities && e === q.Amp && this.startEntity();
        }
        stateSpecialStartSequence(e) {
          let r = this.sequenceIndex === this.currentSequence.length;
          if (
            !(r ? ya(e) : (e | 32) === this.currentSequence[this.sequenceIndex])
          )
            this.isSpecial = !1;
          else if (!r) {
            this.sequenceIndex++;
            return;
          }
          (this.sequenceIndex = 0),
            (this.state = N.InTagName),
            this.stateInTagName(e);
        }
        stateInSpecialTag(e) {
          if (this.sequenceIndex === this.currentSequence.length) {
            if (e === q.Gt || mr(e)) {
              let r = this.index - this.currentSequence.length;
              if (this.sectionStart < r) {
                let n = this.index;
                (this.index = r),
                  this.cbs.ontext(this.sectionStart, r),
                  (this.index = n);
              }
              (this.isSpecial = !1),
                (this.sectionStart = r + 2),
                this.stateInClosingTagName(e);
              return;
            }
            this.sequenceIndex = 0;
          }
          (e | 32) === this.currentSequence[this.sequenceIndex]
            ? (this.sequenceIndex += 1)
            : this.sequenceIndex === 0
            ? this.currentSequence === Ue.TitleEnd
              ? this.decodeEntities && e === q.Amp && this.startEntity()
              : this.fastForwardTo(q.Lt) && (this.sequenceIndex = 1)
            : (this.sequenceIndex = +(e === q.Lt));
        }
        stateCDATASequence(e) {
          e === Ue.Cdata[this.sequenceIndex]
            ? ++this.sequenceIndex === Ue.Cdata.length &&
              ((this.state = N.InCommentLike),
              (this.currentSequence = Ue.CdataEnd),
              (this.sequenceIndex = 0),
              (this.sectionStart = this.index + 1))
            : ((this.sequenceIndex = 0),
              (this.state = N.InDeclaration),
              this.stateInDeclaration(e));
        }
        fastForwardTo(e) {
          for (; ++this.index < this.buffer.length + this.offset; )
            if (this.buffer.charCodeAt(this.index - this.offset) === e)
              return !0;
          return (this.index = this.buffer.length + this.offset - 1), !1;
        }
        stateInCommentLike(e) {
          e === this.currentSequence[this.sequenceIndex]
            ? ++this.sequenceIndex === this.currentSequence.length &&
              (this.currentSequence === Ue.CdataEnd
                ? this.cbs.oncdata(this.sectionStart, this.index, 2)
                : this.cbs.oncomment(this.sectionStart, this.index, 2),
              (this.sequenceIndex = 0),
              (this.sectionStart = this.index + 1),
              (this.state = N.Text))
            : this.sequenceIndex === 0
            ? this.fastForwardTo(this.currentSequence[0]) &&
              (this.sequenceIndex = 1)
            : e !== this.currentSequence[this.sequenceIndex - 1] &&
              (this.sequenceIndex = 0);
        }
        isTagStartChar(e) {
          return this.xmlMode ? !ya(e) : d4(e);
        }
        startSpecial(e, r) {
          (this.isSpecial = !0),
            (this.currentSequence = e),
            (this.sequenceIndex = r),
            (this.state = N.SpecialStartSequence);
        }
        stateBeforeTagName(e) {
          if (e === q.ExclamationMark)
            (this.state = N.BeforeDeclaration),
              (this.sectionStart = this.index + 1);
          else if (e === q.Questionmark)
            (this.state = N.InProcessingInstruction),
              (this.sectionStart = this.index + 1);
          else if (this.isTagStartChar(e)) {
            let r = e | 32;
            (this.sectionStart = this.index),
              this.xmlMode
                ? (this.state = N.InTagName)
                : r === Ue.ScriptEnd[2]
                ? (this.state = N.BeforeSpecialS)
                : r === Ue.TitleEnd[2]
                ? (this.state = N.BeforeSpecialT)
                : (this.state = N.InTagName);
          } else
            e === q.Slash
              ? (this.state = N.BeforeClosingTagName)
              : ((this.state = N.Text), this.stateText(e));
        }
        stateInTagName(e) {
          ya(e) &&
            (this.cbs.onopentagname(this.sectionStart, this.index),
            (this.sectionStart = -1),
            (this.state = N.BeforeAttributeName),
            this.stateBeforeAttributeName(e));
        }
        stateBeforeClosingTagName(e) {
          mr(e) ||
            (e === q.Gt
              ? (this.state = N.Text)
              : ((this.state = this.isTagStartChar(e)
                  ? N.InClosingTagName
                  : N.InSpecialComment),
                (this.sectionStart = this.index)));
        }
        stateInClosingTagName(e) {
          (e === q.Gt || mr(e)) &&
            (this.cbs.onclosetag(this.sectionStart, this.index),
            (this.sectionStart = -1),
            (this.state = N.AfterClosingTagName),
            this.stateAfterClosingTagName(e));
        }
        stateAfterClosingTagName(e) {
          (e === q.Gt || this.fastForwardTo(q.Gt)) &&
            ((this.state = N.Text), (this.sectionStart = this.index + 1));
        }
        stateBeforeAttributeName(e) {
          e === q.Gt
            ? (this.cbs.onopentagend(this.index),
              this.isSpecial
                ? ((this.state = N.InSpecialTag), (this.sequenceIndex = 0))
                : (this.state = N.Text),
              (this.sectionStart = this.index + 1))
            : e === q.Slash
            ? (this.state = N.InSelfClosingTag)
            : mr(e) ||
              ((this.state = N.InAttributeName),
              (this.sectionStart = this.index));
        }
        stateInSelfClosingTag(e) {
          e === q.Gt
            ? (this.cbs.onselfclosingtag(this.index),
              (this.state = N.Text),
              (this.sectionStart = this.index + 1),
              (this.isSpecial = !1))
            : mr(e) ||
              ((this.state = N.BeforeAttributeName),
              this.stateBeforeAttributeName(e));
        }
        stateInAttributeName(e) {
          (e === q.Eq || ya(e)) &&
            (this.cbs.onattribname(this.sectionStart, this.index),
            (this.sectionStart = this.index),
            (this.state = N.AfterAttributeName),
            this.stateAfterAttributeName(e));
        }
        stateAfterAttributeName(e) {
          e === q.Eq
            ? (this.state = N.BeforeAttributeValue)
            : e === q.Slash || e === q.Gt
            ? (this.cbs.onattribend(ht.NoValue, this.sectionStart),
              (this.sectionStart = -1),
              (this.state = N.BeforeAttributeName),
              this.stateBeforeAttributeName(e))
            : mr(e) ||
              (this.cbs.onattribend(ht.NoValue, this.sectionStart),
              (this.state = N.InAttributeName),
              (this.sectionStart = this.index));
        }
        stateBeforeAttributeValue(e) {
          e === q.DoubleQuote
            ? ((this.state = N.InAttributeValueDq),
              (this.sectionStart = this.index + 1))
            : e === q.SingleQuote
            ? ((this.state = N.InAttributeValueSq),
              (this.sectionStart = this.index + 1))
            : mr(e) ||
              ((this.sectionStart = this.index),
              (this.state = N.InAttributeValueNq),
              this.stateInAttributeValueNoQuotes(e));
        }
        handleInAttributeValue(e, r) {
          e === r || (!this.decodeEntities && this.fastForwardTo(r))
            ? (this.cbs.onattribdata(this.sectionStart, this.index),
              (this.sectionStart = -1),
              this.cbs.onattribend(
                r === q.DoubleQuote ? ht.Double : ht.Single,
                this.index + 1
              ),
              (this.state = N.BeforeAttributeName))
            : this.decodeEntities && e === q.Amp && this.startEntity();
        }
        stateInAttributeValueDoubleQuotes(e) {
          this.handleInAttributeValue(e, q.DoubleQuote);
        }
        stateInAttributeValueSingleQuotes(e) {
          this.handleInAttributeValue(e, q.SingleQuote);
        }
        stateInAttributeValueNoQuotes(e) {
          mr(e) || e === q.Gt
            ? (this.cbs.onattribdata(this.sectionStart, this.index),
              (this.sectionStart = -1),
              this.cbs.onattribend(ht.Unquoted, this.index),
              (this.state = N.BeforeAttributeName),
              this.stateBeforeAttributeName(e))
            : this.decodeEntities && e === q.Amp && this.startEntity();
        }
        stateBeforeDeclaration(e) {
          e === q.OpeningSquareBracket
            ? ((this.state = N.CDATASequence), (this.sequenceIndex = 0))
            : (this.state = e === q.Dash ? N.BeforeComment : N.InDeclaration);
        }
        stateInDeclaration(e) {
          (e === q.Gt || this.fastForwardTo(q.Gt)) &&
            (this.cbs.ondeclaration(this.sectionStart, this.index),
            (this.state = N.Text),
            (this.sectionStart = this.index + 1));
        }
        stateInProcessingInstruction(e) {
          (e === q.Gt || this.fastForwardTo(q.Gt)) &&
            (this.cbs.onprocessinginstruction(this.sectionStart, this.index),
            (this.state = N.Text),
            (this.sectionStart = this.index + 1));
        }
        stateBeforeComment(e) {
          e === q.Dash
            ? ((this.state = N.InCommentLike),
              (this.currentSequence = Ue.CommentEnd),
              (this.sequenceIndex = 2),
              (this.sectionStart = this.index + 1))
            : (this.state = N.InDeclaration);
        }
        stateInSpecialComment(e) {
          (e === q.Gt || this.fastForwardTo(q.Gt)) &&
            (this.cbs.oncomment(this.sectionStart, this.index, 0),
            (this.state = N.Text),
            (this.sectionStart = this.index + 1));
        }
        stateBeforeSpecialS(e) {
          let r = e | 32;
          r === Ue.ScriptEnd[3]
            ? this.startSpecial(Ue.ScriptEnd, 4)
            : r === Ue.StyleEnd[3]
            ? this.startSpecial(Ue.StyleEnd, 4)
            : ((this.state = N.InTagName), this.stateInTagName(e));
        }
        stateBeforeSpecialT(e) {
          let r = e | 32;
          r === Ue.TitleEnd[3]
            ? this.startSpecial(Ue.TitleEnd, 4)
            : r === Ue.TextareaEnd[3]
            ? this.startSpecial(Ue.TextareaEnd, 4)
            : ((this.state = N.InTagName), this.stateInTagName(e));
        }
        startEntity() {
          (this.baseState = this.state),
            (this.state = N.InEntity),
            (this.entityStart = this.index),
            this.entityDecoder.startEntity(
              this.xmlMode
                ? pt.Strict
                : this.baseState === N.Text || this.baseState === N.InSpecialTag
                ? pt.Legacy
                : pt.Attribute
            );
        }
        stateInEntity() {
          let e = this.entityDecoder.write(
            this.buffer,
            this.index - this.offset
          );
          e >= 0
            ? ((this.state = this.baseState),
              e === 0 && (this.index = this.entityStart))
            : (this.index = this.offset + this.buffer.length - 1);
        }
        cleanup() {
          this.running &&
            this.sectionStart !== this.index &&
            (this.state === N.Text ||
            (this.state === N.InSpecialTag && this.sequenceIndex === 0)
              ? (this.cbs.ontext(this.sectionStart, this.index),
                (this.sectionStart = this.index))
              : (this.state === N.InAttributeValueDq ||
                  this.state === N.InAttributeValueSq ||
                  this.state === N.InAttributeValueNq) &&
                (this.cbs.onattribdata(this.sectionStart, this.index),
                (this.sectionStart = this.index)));
        }
        shouldContinue() {
          return this.index < this.buffer.length + this.offset && this.running;
        }
        parse() {
          for (; this.shouldContinue(); ) {
            let e = this.buffer.charCodeAt(this.index - this.offset);
            switch (this.state) {
              case N.Text: {
                this.stateText(e);
                break;
              }
              case N.SpecialStartSequence: {
                this.stateSpecialStartSequence(e);
                break;
              }
              case N.InSpecialTag: {
                this.stateInSpecialTag(e);
                break;
              }
              case N.CDATASequence: {
                this.stateCDATASequence(e);
                break;
              }
              case N.InAttributeValueDq: {
                this.stateInAttributeValueDoubleQuotes(e);
                break;
              }
              case N.InAttributeName: {
                this.stateInAttributeName(e);
                break;
              }
              case N.InCommentLike: {
                this.stateInCommentLike(e);
                break;
              }
              case N.InSpecialComment: {
                this.stateInSpecialComment(e);
                break;
              }
              case N.BeforeAttributeName: {
                this.stateBeforeAttributeName(e);
                break;
              }
              case N.InTagName: {
                this.stateInTagName(e);
                break;
              }
              case N.InClosingTagName: {
                this.stateInClosingTagName(e);
                break;
              }
              case N.BeforeTagName: {
                this.stateBeforeTagName(e);
                break;
              }
              case N.AfterAttributeName: {
                this.stateAfterAttributeName(e);
                break;
              }
              case N.InAttributeValueSq: {
                this.stateInAttributeValueSingleQuotes(e);
                break;
              }
              case N.BeforeAttributeValue: {
                this.stateBeforeAttributeValue(e);
                break;
              }
              case N.BeforeClosingTagName: {
                this.stateBeforeClosingTagName(e);
                break;
              }
              case N.AfterClosingTagName: {
                this.stateAfterClosingTagName(e);
                break;
              }
              case N.BeforeSpecialS: {
                this.stateBeforeSpecialS(e);
                break;
              }
              case N.BeforeSpecialT: {
                this.stateBeforeSpecialT(e);
                break;
              }
              case N.InAttributeValueNq: {
                this.stateInAttributeValueNoQuotes(e);
                break;
              }
              case N.InSelfClosingTag: {
                this.stateInSelfClosingTag(e);
                break;
              }
              case N.InDeclaration: {
                this.stateInDeclaration(e);
                break;
              }
              case N.BeforeDeclaration: {
                this.stateBeforeDeclaration(e);
                break;
              }
              case N.BeforeComment: {
                this.stateBeforeComment(e);
                break;
              }
              case N.InProcessingInstruction: {
                this.stateInProcessingInstruction(e);
                break;
              }
              case N.InEntity: {
                this.stateInEntity();
                break;
              }
            }
            this.index++;
          }
          this.cleanup();
        }
        finish() {
          this.state === N.InEntity &&
            (this.entityDecoder.end(), (this.state = this.baseState)),
            this.handleTrailingData(),
            this.cbs.onend();
        }
        handleTrailingData() {
          let e = this.buffer.length + this.offset;
          this.sectionStart >= e ||
            (this.state === N.InCommentLike
              ? this.currentSequence === Ue.CdataEnd
                ? this.cbs.oncdata(this.sectionStart, e, 0)
                : this.cbs.oncomment(this.sectionStart, e, 0)
              : this.state === N.InTagName ||
                this.state === N.BeforeAttributeName ||
                this.state === N.BeforeAttributeValue ||
                this.state === N.AfterAttributeName ||
                this.state === N.InAttributeName ||
                this.state === N.InAttributeValueSq ||
                this.state === N.InAttributeValueDq ||
                this.state === N.InAttributeValueNq ||
                this.state === N.InClosingTagName ||
                this.cbs.ontext(this.sectionStart, e));
        }
        emitCodePoint(e, r) {
          this.baseState !== N.Text && this.baseState !== N.InSpecialTag
            ? (this.sectionStart < this.entityStart &&
                this.cbs.onattribdata(this.sectionStart, this.entityStart),
              (this.sectionStart = this.entityStart + r),
              (this.index = this.sectionStart - 1),
              this.cbs.onattribentity(e))
            : (this.sectionStart < this.entityStart &&
                this.cbs.ontext(this.sectionStart, this.entityStart),
              (this.sectionStart = this.entityStart + r),
              (this.index = this.sectionStart - 1),
              this.cbs.ontextentity(e, this.sectionStart));
        }
      });
  });
var is,
  ae,
  jm,
  zm,
  qm,
  f4,
  p4,
  Um,
  Bm,
  h4,
  Vr,
  vd = b(() => {
    xd();
    ei();
    (is = new Set([
      "input",
      "option",
      "optgroup",
      "select",
      "button",
      "datalist",
      "textarea",
    ])),
      (ae = new Set(["p"])),
      (jm = new Set(["thead", "tbody"])),
      (zm = new Set(["dd", "dt"])),
      (qm = new Set(["rt", "rp"])),
      (f4 = new Map([
        ["tr", new Set(["tr", "th", "td"])],
        ["th", new Set(["th"])],
        ["td", new Set(["thead", "th", "td"])],
        ["body", new Set(["head", "link", "script"])],
        ["li", new Set(["li"])],
        ["p", ae],
        ["h1", ae],
        ["h2", ae],
        ["h3", ae],
        ["h4", ae],
        ["h5", ae],
        ["h6", ae],
        ["select", is],
        ["input", is],
        ["output", is],
        ["button", is],
        ["datalist", is],
        ["textarea", is],
        ["option", new Set(["option"])],
        ["optgroup", new Set(["optgroup", "option"])],
        ["dd", zm],
        ["dt", zm],
        ["address", ae],
        ["article", ae],
        ["aside", ae],
        ["blockquote", ae],
        ["details", ae],
        ["div", ae],
        ["dl", ae],
        ["fieldset", ae],
        ["figcaption", ae],
        ["figure", ae],
        ["footer", ae],
        ["form", ae],
        ["header", ae],
        ["hr", ae],
        ["main", ae],
        ["nav", ae],
        ["ol", ae],
        ["pre", ae],
        ["section", ae],
        ["table", ae],
        ["ul", ae],
        ["rt", qm],
        ["rp", qm],
        ["tbody", jm],
        ["tfoot", jm],
      ])),
      (p4 = new Set([
        "area",
        "base",
        "basefont",
        "br",
        "col",
        "command",
        "embed",
        "frame",
        "hr",
        "img",
        "input",
        "isindex",
        "keygen",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
      ])),
      (Um = new Set(["math", "svg"])),
      (Bm = new Set([
        "mi",
        "mo",
        "mn",
        "ms",
        "mtext",
        "annotation-xml",
        "foreignobject",
        "desc",
        "title",
      ])),
      (h4 = /\s|\//),
      (Vr = class {
        constructor(e, r = {}) {
          var n, s, i, o, a, u;
          (this.options = r),
            (this.startIndex = 0),
            (this.endIndex = 0),
            (this.openTagStart = 0),
            (this.tagname = ""),
            (this.attribname = ""),
            (this.attribvalue = ""),
            (this.attribs = null),
            (this.stack = []),
            (this.buffers = []),
            (this.bufferOffset = 0),
            (this.writeIndex = 0),
            (this.ended = !1),
            (this.cbs = e ?? {}),
            (this.htmlMode = !this.options.xmlMode),
            (this.lowerCaseTagNames =
              (n = r.lowerCaseTags) !== null && n !== void 0
                ? n
                : this.htmlMode),
            (this.lowerCaseAttributeNames =
              (s = r.lowerCaseAttributeNames) !== null && s !== void 0
                ? s
                : this.htmlMode),
            (this.recognizeSelfClosing =
              (i = r.recognizeSelfClosing) !== null && i !== void 0
                ? i
                : !this.htmlMode),
            (this.tokenizer = new (
              (o = r.Tokenizer) !== null && o !== void 0 ? o : yn
            )(this.options, this)),
            (this.foreignContext = [!this.htmlMode]),
            (u = (a = this.cbs).onparserinit) === null ||
              u === void 0 ||
              u.call(a, this);
        }
        ontext(e, r) {
          var n, s;
          let i = this.getSlice(e, r);
          (this.endIndex = r - 1),
            (s = (n = this.cbs).ontext) === null ||
              s === void 0 ||
              s.call(n, i),
            (this.startIndex = r);
        }
        ontextentity(e, r) {
          var n, s;
          (this.endIndex = r - 1),
            (s = (n = this.cbs).ontext) === null ||
              s === void 0 ||
              s.call(n, ns(e)),
            (this.startIndex = r);
        }
        isVoidElement(e) {
          return this.htmlMode && p4.has(e);
        }
        onopentagname(e, r) {
          this.endIndex = r;
          let n = this.getSlice(e, r);
          this.lowerCaseTagNames && (n = n.toLowerCase()), this.emitOpenTag(n);
        }
        emitOpenTag(e) {
          var r, n, s, i;
          (this.openTagStart = this.startIndex), (this.tagname = e);
          let o = this.htmlMode && f4.get(e);
          if (o)
            for (; this.stack.length > 0 && o.has(this.stack[0]); ) {
              let a = this.stack.shift();
              (n = (r = this.cbs).onclosetag) === null ||
                n === void 0 ||
                n.call(r, a, !0);
            }
          this.isVoidElement(e) ||
            (this.stack.unshift(e),
            this.htmlMode &&
              (Um.has(e)
                ? this.foreignContext.unshift(!0)
                : Bm.has(e) && this.foreignContext.unshift(!1))),
            (i = (s = this.cbs).onopentagname) === null ||
              i === void 0 ||
              i.call(s, e),
            this.cbs.onopentag && (this.attribs = {});
        }
        endOpenTag(e) {
          var r, n;
          (this.startIndex = this.openTagStart),
            this.attribs &&
              ((n = (r = this.cbs).onopentag) === null ||
                n === void 0 ||
                n.call(r, this.tagname, this.attribs, e),
              (this.attribs = null)),
            this.cbs.onclosetag &&
              this.isVoidElement(this.tagname) &&
              this.cbs.onclosetag(this.tagname, !0),
            (this.tagname = "");
        }
        onopentagend(e) {
          (this.endIndex = e), this.endOpenTag(!1), (this.startIndex = e + 1);
        }
        onclosetag(e, r) {
          var n, s, i, o, a, u, c, l;
          this.endIndex = r;
          let d = this.getSlice(e, r);
          if (
            (this.lowerCaseTagNames && (d = d.toLowerCase()),
            this.htmlMode &&
              (Um.has(d) || Bm.has(d)) &&
              this.foreignContext.shift(),
            this.isVoidElement(d))
          )
            this.htmlMode &&
              d === "br" &&
              ((o = (i = this.cbs).onopentagname) === null ||
                o === void 0 ||
                o.call(i, "br"),
              (u = (a = this.cbs).onopentag) === null ||
                u === void 0 ||
                u.call(a, "br", {}, !0),
              (l = (c = this.cbs).onclosetag) === null ||
                l === void 0 ||
                l.call(c, "br", !1));
          else {
            let f = this.stack.indexOf(d);
            if (f !== -1)
              for (let h = 0; h <= f; h++) {
                let p = this.stack.shift();
                (s = (n = this.cbs).onclosetag) === null ||
                  s === void 0 ||
                  s.call(n, p, h !== f);
              }
            else
              this.htmlMode &&
                d === "p" &&
                (this.emitOpenTag("p"), this.closeCurrentTag(!0));
          }
          this.startIndex = r + 1;
        }
        onselfclosingtag(e) {
          (this.endIndex = e),
            this.recognizeSelfClosing || this.foreignContext[0]
              ? (this.closeCurrentTag(!1), (this.startIndex = e + 1))
              : this.onopentagend(e);
        }
        closeCurrentTag(e) {
          var r, n;
          let s = this.tagname;
          this.endOpenTag(e),
            this.stack[0] === s &&
              ((n = (r = this.cbs).onclosetag) === null ||
                n === void 0 ||
                n.call(r, s, !e),
              this.stack.shift());
        }
        onattribname(e, r) {
          this.startIndex = e;
          let n = this.getSlice(e, r);
          this.attribname = this.lowerCaseAttributeNames ? n.toLowerCase() : n;
        }
        onattribdata(e, r) {
          this.attribvalue += this.getSlice(e, r);
        }
        onattribentity(e) {
          this.attribvalue += ns(e);
        }
        onattribend(e, r) {
          var n, s;
          (this.endIndex = r),
            (s = (n = this.cbs).onattribute) === null ||
              s === void 0 ||
              s.call(
                n,
                this.attribname,
                this.attribvalue,
                e === ht.Double
                  ? '"'
                  : e === ht.Single
                  ? "'"
                  : e === ht.NoValue
                  ? void 0
                  : null
              ),
            this.attribs &&
              !Object.prototype.hasOwnProperty.call(
                this.attribs,
                this.attribname
              ) &&
              (this.attribs[this.attribname] = this.attribvalue),
            (this.attribvalue = "");
        }
        getInstructionName(e) {
          let r = e.search(h4),
            n = r < 0 ? e : e.substr(0, r);
          return this.lowerCaseTagNames && (n = n.toLowerCase()), n;
        }
        ondeclaration(e, r) {
          this.endIndex = r;
          let n = this.getSlice(e, r);
          if (this.cbs.onprocessinginstruction) {
            let s = this.getInstructionName(n);
            this.cbs.onprocessinginstruction(`!${s}`, `!${n}`);
          }
          this.startIndex = r + 1;
        }
        onprocessinginstruction(e, r) {
          this.endIndex = r;
          let n = this.getSlice(e, r);
          if (this.cbs.onprocessinginstruction) {
            let s = this.getInstructionName(n);
            this.cbs.onprocessinginstruction(`?${s}`, `?${n}`);
          }
          this.startIndex = r + 1;
        }
        oncomment(e, r, n) {
          var s, i, o, a;
          (this.endIndex = r),
            (i = (s = this.cbs).oncomment) === null ||
              i === void 0 ||
              i.call(s, this.getSlice(e, r - n)),
            (a = (o = this.cbs).oncommentend) === null ||
              a === void 0 ||
              a.call(o),
            (this.startIndex = r + 1);
        }
        oncdata(e, r, n) {
          var s, i, o, a, u, c, l, d, f, h;
          this.endIndex = r;
          let p = this.getSlice(e, r - n);
          !this.htmlMode || this.options.recognizeCDATA
            ? ((i = (s = this.cbs).oncdatastart) === null ||
                i === void 0 ||
                i.call(s),
              (a = (o = this.cbs).ontext) === null ||
                a === void 0 ||
                a.call(o, p),
              (c = (u = this.cbs).oncdataend) === null ||
                c === void 0 ||
                c.call(u))
            : ((d = (l = this.cbs).oncomment) === null ||
                d === void 0 ||
                d.call(l, `[CDATA[${p}]]`),
              (h = (f = this.cbs).oncommentend) === null ||
                h === void 0 ||
                h.call(f)),
            (this.startIndex = r + 1);
        }
        onend() {
          var e, r;
          if (this.cbs.onclosetag) {
            this.endIndex = this.startIndex;
            for (let n = 0; n < this.stack.length; n++)
              this.cbs.onclosetag(this.stack[n], !0);
          }
          (r = (e = this.cbs).onend) === null || r === void 0 || r.call(e);
        }
        reset() {
          var e, r, n, s;
          (r = (e = this.cbs).onreset) === null || r === void 0 || r.call(e),
            this.tokenizer.reset(),
            (this.tagname = ""),
            (this.attribname = ""),
            (this.attribs = null),
            (this.stack.length = 0),
            (this.startIndex = 0),
            (this.endIndex = 0),
            (s = (n = this.cbs).onparserinit) === null ||
              s === void 0 ||
              s.call(n, this),
            (this.buffers.length = 0),
            (this.foreignContext.length = 0),
            this.foreignContext.unshift(!this.htmlMode),
            (this.bufferOffset = 0),
            (this.writeIndex = 0),
            (this.ended = !1);
        }
        parseComplete(e) {
          this.reset(), this.end(e);
        }
        getSlice(e, r) {
          for (; e - this.bufferOffset >= this.buffers[0].length; )
            this.shiftBuffer();
          let n = this.buffers[0].slice(
            e - this.bufferOffset,
            r - this.bufferOffset
          );
          for (; r - this.bufferOffset > this.buffers[0].length; )
            this.shiftBuffer(),
              (n += this.buffers[0].slice(0, r - this.bufferOffset));
          return n;
        }
        shiftBuffer() {
          (this.bufferOffset += this.buffers[0].length),
            this.writeIndex--,
            this.buffers.shift();
        }
        write(e) {
          var r, n;
          if (this.ended) {
            (n = (r = this.cbs).onerror) === null ||
              n === void 0 ||
              n.call(r, new Error(".write() after done!"));
            return;
          }
          this.buffers.push(e),
            this.tokenizer.running &&
              (this.tokenizer.write(e), this.writeIndex++);
        }
        end(e) {
          var r, n;
          if (this.ended) {
            (n = (r = this.cbs).onerror) === null ||
              n === void 0 ||
              n.call(r, new Error(".end() after done!"));
            return;
          }
          e && this.write(e), (this.ended = !0), this.tokenizer.end();
        }
        pause() {
          this.tokenizer.pause();
        }
        resume() {
          for (
            this.tokenizer.resume();
            this.tokenizer.running && this.writeIndex < this.buffers.length;

          )
            this.tokenizer.write(this.buffers[this.writeIndex++]);
          this.ended && this.tokenizer.end();
        }
        parseChunk(e) {
          this.write(e);
        }
        done(e) {
          this.end(e);
        }
      });
  });
var xa = {};
vt(xa, {
  CDATA: () => Ld,
  Comment: () => Ad,
  Directive: () => Td,
  Doctype: () => Pd,
  ElementType: () => J,
  Root: () => Sd,
  Script: () => Cd,
  Style: () => Rd,
  Tag: () => Nd,
  Text: () => Ed,
  isTag: () => wd,
});
function wd(t) {
  return t.type === J.Tag || t.type === J.Script || t.type === J.Style;
}
var J,
  Sd,
  Ed,
  Td,
  Ad,
  Cd,
  Rd,
  Nd,
  Ld,
  Pd,
  os = b(() => {
    (function (t) {
      (t.Root = "root"),
        (t.Text = "text"),
        (t.Directive = "directive"),
        (t.Comment = "comment"),
        (t.Script = "script"),
        (t.Style = "style"),
        (t.Tag = "tag"),
        (t.CDATA = "cdata"),
        (t.Doctype = "doctype");
    })(J || (J = {}));
    (Sd = J.Root),
      (Ed = J.Text),
      (Td = J.Directive),
      (Ad = J.Comment),
      (Cd = J.Script),
      (Rd = J.Style),
      (Nd = J.Tag),
      (Ld = J.CDATA),
      (Pd = J.Doctype);
  });
function _e(t) {
  return wd(t);
}
function cs(t) {
  return t.type === J.CDATA;
}
function er(t) {
  return t.type === J.Text;
}
function ai(t) {
  return t.type === J.Comment;
}
function m4(t) {
  return t.type === J.Directive;
}
function kd(t) {
  return t.type === J.Root;
}
function mt(t) {
  return Object.prototype.hasOwnProperty.call(t, "children");
}
function Vm(t, e = !1) {
  let r;
  if (er(t)) r = new as(t.data);
  else if (ai(t)) r = new ri(t.data);
  else if (_e(t)) {
    let n = e ? Id(t.children) : [],
      s = new oi(t.name, {...t.attribs}, n);
    n.forEach((i) => (i.parent = s)),
      t.namespace != null && (s.namespace = t.namespace),
      t["x-attribsNamespace"] &&
        (s["x-attribsNamespace"] = {...t["x-attribsNamespace"]}),
      t["x-attribsPrefix"] &&
        (s["x-attribsPrefix"] = {...t["x-attribsPrefix"]}),
      (r = s);
  } else if (cs(t)) {
    let n = e ? Id(t.children) : [],
      s = new ii(n);
    n.forEach((i) => (i.parent = s)), (r = s);
  } else if (kd(t)) {
    let n = e ? Id(t.children) : [],
      s = new us(n);
    n.forEach((i) => (i.parent = s)),
      t["x-mode"] && (s["x-mode"] = t["x-mode"]),
      (r = s);
  } else if (m4(t)) {
    let n = new ni(t.name, t.data);
    t["x-name"] != null &&
      ((n["x-name"] = t["x-name"]),
      (n["x-publicId"] = t["x-publicId"]),
      (n["x-systemId"] = t["x-systemId"])),
      (r = n);
  } else throw new Error(`Not implemented yet: ${t.type}`);
  return (
    (r.startIndex = t.startIndex),
    (r.endIndex = t.endIndex),
    t.sourceCodeLocation != null &&
      (r.sourceCodeLocation = t.sourceCodeLocation),
    r
  );
}
function Id(t) {
  let e = t.map((r) => Vm(r, !0));
  for (let r = 1; r < e.length; r++)
    (e[r].prev = e[r - 1]), (e[r - 1].next = e[r]);
  return e;
}
var va,
  ti,
  as,
  ri,
  ni,
  si,
  ii,
  us,
  oi,
  Od = b(() => {
    os();
    (va = class {
      constructor() {
        (this.parent = null),
          (this.prev = null),
          (this.next = null),
          (this.startIndex = null),
          (this.endIndex = null);
      }
      get parentNode() {
        return this.parent;
      }
      set parentNode(e) {
        this.parent = e;
      }
      get previousSibling() {
        return this.prev;
      }
      set previousSibling(e) {
        this.prev = e;
      }
      get nextSibling() {
        return this.next;
      }
      set nextSibling(e) {
        this.next = e;
      }
      cloneNode(e = !1) {
        return Vm(this, e);
      }
    }),
      (ti = class extends va {
        constructor(e) {
          super(), (this.data = e);
        }
        get nodeValue() {
          return this.data;
        }
        set nodeValue(e) {
          this.data = e;
        }
      }),
      (as = class extends ti {
        constructor() {
          super(...arguments), (this.type = J.Text);
        }
        get nodeType() {
          return 3;
        }
      }),
      (ri = class extends ti {
        constructor() {
          super(...arguments), (this.type = J.Comment);
        }
        get nodeType() {
          return 8;
        }
      }),
      (ni = class extends ti {
        constructor(e, r) {
          super(r), (this.name = e), (this.type = J.Directive);
        }
        get nodeType() {
          return 1;
        }
      }),
      (si = class extends va {
        constructor(e) {
          super(), (this.children = e);
        }
        get firstChild() {
          var e;
          return (e = this.children[0]) !== null && e !== void 0 ? e : null;
        }
        get lastChild() {
          return this.children.length > 0
            ? this.children[this.children.length - 1]
            : null;
        }
        get childNodes() {
          return this.children;
        }
        set childNodes(e) {
          this.children = e;
        }
      }),
      (ii = class extends si {
        constructor() {
          super(...arguments), (this.type = J.CDATA);
        }
        get nodeType() {
          return 4;
        }
      }),
      (us = class extends si {
        constructor() {
          super(...arguments), (this.type = J.Root);
        }
        get nodeType() {
          return 9;
        }
      }),
      (oi = class extends si {
        constructor(
          e,
          r,
          n = [],
          s = e === "script" ? J.Script : e === "style" ? J.Style : J.Tag
        ) {
          super(n), (this.name = e), (this.attribs = r), (this.type = s);
        }
        get nodeType() {
          return 1;
        }
        get tagName() {
          return this.name;
        }
        set tagName(e) {
          this.name = e;
        }
        get attributes() {
          return Object.keys(this.attribs).map((e) => {
            var r, n;
            return {
              name: e,
              value: this.attribs[e],
              namespace:
                (r = this["x-attribsNamespace"]) === null || r === void 0
                  ? void 0
                  : r[e],
              prefix:
                (n = this["x-attribsPrefix"]) === null || n === void 0
                  ? void 0
                  : n[e],
            };
          });
        }
      });
  });
var Km,
  gr,
  br = b(() => {
    os();
    Od();
    Od();
    (Km = {withStartIndices: !1, withEndIndices: !1, xmlMode: !1}),
      (gr = class {
        constructor(e, r, n) {
          (this.dom = []),
            (this.root = new us(this.dom)),
            (this.done = !1),
            (this.tagStack = [this.root]),
            (this.lastNode = null),
            (this.parser = null),
            typeof r == "function" && ((n = r), (r = Km)),
            typeof e == "object" && ((r = e), (e = void 0)),
            (this.callback = e ?? null),
            (this.options = r ?? Km),
            (this.elementCB = n ?? null);
        }
        onparserinit(e) {
          this.parser = e;
        }
        onreset() {
          (this.dom = []),
            (this.root = new us(this.dom)),
            (this.done = !1),
            (this.tagStack = [this.root]),
            (this.lastNode = null),
            (this.parser = null);
        }
        onend() {
          this.done ||
            ((this.done = !0), (this.parser = null), this.handleCallback(null));
        }
        onerror(e) {
          this.handleCallback(e);
        }
        onclosetag() {
          this.lastNode = null;
          let e = this.tagStack.pop();
          this.options.withEndIndices && (e.endIndex = this.parser.endIndex),
            this.elementCB && this.elementCB(e);
        }
        onopentag(e, r) {
          let n = this.options.xmlMode ? J.Tag : void 0,
            s = new oi(e, r, void 0, n);
          this.addNode(s), this.tagStack.push(s);
        }
        ontext(e) {
          let {lastNode: r} = this;
          if (r && r.type === J.Text)
            (r.data += e),
              this.options.withEndIndices &&
                (r.endIndex = this.parser.endIndex);
          else {
            let n = new as(e);
            this.addNode(n), (this.lastNode = n);
          }
        }
        oncomment(e) {
          if (this.lastNode && this.lastNode.type === J.Comment) {
            this.lastNode.data += e;
            return;
          }
          let r = new ri(e);
          this.addNode(r), (this.lastNode = r);
        }
        oncommentend() {
          this.lastNode = null;
        }
        oncdatastart() {
          let e = new as(""),
            r = new ii([e]);
          this.addNode(r), (e.parent = r), (this.lastNode = e);
        }
        oncdataend() {
          this.lastNode = null;
        }
        onprocessinginstruction(e, r) {
          let n = new ni(e, r);
          this.addNode(n);
        }
        handleCallback(e) {
          if (typeof this.callback == "function") this.callback(e, this.dom);
          else if (e) throw e;
        }
        addNode(e) {
          let r = this.tagStack[this.tagStack.length - 1],
            n = r.children[r.children.length - 1];
          this.options.withStartIndices &&
            (e.startIndex = this.parser.startIndex),
            this.options.withEndIndices && (e.endIndex = this.parser.endIndex),
            r.children.push(e),
            n && ((e.prev = n), (n.next = e)),
            (e.parent = r),
            (this.lastNode = null);
        }
      });
  });
function wa(t) {
  for (let e = 1; e < t.length; e++) t[e][0] += t[e - 1][0] + 1;
  return t;
}
var g4,
  Wm = b(() => {
    g4 = new Map(
      wa([
        [9, "&Tab;"],
        [0, "&NewLine;"],
        [22, "&excl;"],
        [0, "&quot;"],
        [0, "&num;"],
        [0, "&dollar;"],
        [0, "&percnt;"],
        [0, "&amp;"],
        [0, "&apos;"],
        [0, "&lpar;"],
        [0, "&rpar;"],
        [0, "&ast;"],
        [0, "&plus;"],
        [0, "&comma;"],
        [1, "&period;"],
        [0, "&sol;"],
        [10, "&colon;"],
        [0, "&semi;"],
        [0, {v: "&lt;", n: 8402, o: "&nvlt;"}],
        [0, {v: "&equals;", n: 8421, o: "&bne;"}],
        [0, {v: "&gt;", n: 8402, o: "&nvgt;"}],
        [0, "&quest;"],
        [0, "&commat;"],
        [26, "&lbrack;"],
        [0, "&bsol;"],
        [0, "&rbrack;"],
        [0, "&Hat;"],
        [0, "&lowbar;"],
        [0, "&DiacriticalGrave;"],
        [5, {n: 106, o: "&fjlig;"}],
        [20, "&lbrace;"],
        [0, "&verbar;"],
        [0, "&rbrace;"],
        [34, "&nbsp;"],
        [0, "&iexcl;"],
        [0, "&cent;"],
        [0, "&pound;"],
        [0, "&curren;"],
        [0, "&yen;"],
        [0, "&brvbar;"],
        [0, "&sect;"],
        [0, "&die;"],
        [0, "&copy;"],
        [0, "&ordf;"],
        [0, "&laquo;"],
        [0, "&not;"],
        [0, "&shy;"],
        [0, "&circledR;"],
        [0, "&macr;"],
        [0, "&deg;"],
        [0, "&PlusMinus;"],
        [0, "&sup2;"],
        [0, "&sup3;"],
        [0, "&acute;"],
        [0, "&micro;"],
        [0, "&para;"],
        [0, "&centerdot;"],
        [0, "&cedil;"],
        [0, "&sup1;"],
        [0, "&ordm;"],
        [0, "&raquo;"],
        [0, "&frac14;"],
        [0, "&frac12;"],
        [0, "&frac34;"],
        [0, "&iquest;"],
        [0, "&Agrave;"],
        [0, "&Aacute;"],
        [0, "&Acirc;"],
        [0, "&Atilde;"],
        [0, "&Auml;"],
        [0, "&angst;"],
        [0, "&AElig;"],
        [0, "&Ccedil;"],
        [0, "&Egrave;"],
        [0, "&Eacute;"],
        [0, "&Ecirc;"],
        [0, "&Euml;"],
        [0, "&Igrave;"],
        [0, "&Iacute;"],
        [0, "&Icirc;"],
        [0, "&Iuml;"],
        [0, "&ETH;"],
        [0, "&Ntilde;"],
        [0, "&Ograve;"],
        [0, "&Oacute;"],
        [0, "&Ocirc;"],
        [0, "&Otilde;"],
        [0, "&Ouml;"],
        [0, "&times;"],
        [0, "&Oslash;"],
        [0, "&Ugrave;"],
        [0, "&Uacute;"],
        [0, "&Ucirc;"],
        [0, "&Uuml;"],
        [0, "&Yacute;"],
        [0, "&THORN;"],
        [0, "&szlig;"],
        [0, "&agrave;"],
        [0, "&aacute;"],
        [0, "&acirc;"],
        [0, "&atilde;"],
        [0, "&auml;"],
        [0, "&aring;"],
        [0, "&aelig;"],
        [0, "&ccedil;"],
        [0, "&egrave;"],
        [0, "&eacute;"],
        [0, "&ecirc;"],
        [0, "&euml;"],
        [0, "&igrave;"],
        [0, "&iacute;"],
        [0, "&icirc;"],
        [0, "&iuml;"],
        [0, "&eth;"],
        [0, "&ntilde;"],
        [0, "&ograve;"],
        [0, "&oacute;"],
        [0, "&ocirc;"],
        [0, "&otilde;"],
        [0, "&ouml;"],
        [0, "&div;"],
        [0, "&oslash;"],
        [0, "&ugrave;"],
        [0, "&uacute;"],
        [0, "&ucirc;"],
        [0, "&uuml;"],
        [0, "&yacute;"],
        [0, "&thorn;"],
        [0, "&yuml;"],
        [0, "&Amacr;"],
        [0, "&amacr;"],
        [0, "&Abreve;"],
        [0, "&abreve;"],
        [0, "&Aogon;"],
        [0, "&aogon;"],
        [0, "&Cacute;"],
        [0, "&cacute;"],
        [0, "&Ccirc;"],
        [0, "&ccirc;"],
        [0, "&Cdot;"],
        [0, "&cdot;"],
        [0, "&Ccaron;"],
        [0, "&ccaron;"],
        [0, "&Dcaron;"],
        [0, "&dcaron;"],
        [0, "&Dstrok;"],
        [0, "&dstrok;"],
        [0, "&Emacr;"],
        [0, "&emacr;"],
        [2, "&Edot;"],
        [0, "&edot;"],
        [0, "&Eogon;"],
        [0, "&eogon;"],
        [0, "&Ecaron;"],
        [0, "&ecaron;"],
        [0, "&Gcirc;"],
        [0, "&gcirc;"],
        [0, "&Gbreve;"],
        [0, "&gbreve;"],
        [0, "&Gdot;"],
        [0, "&gdot;"],
        [0, "&Gcedil;"],
        [1, "&Hcirc;"],
        [0, "&hcirc;"],
        [0, "&Hstrok;"],
        [0, "&hstrok;"],
        [0, "&Itilde;"],
        [0, "&itilde;"],
        [0, "&Imacr;"],
        [0, "&imacr;"],
        [2, "&Iogon;"],
        [0, "&iogon;"],
        [0, "&Idot;"],
        [0, "&imath;"],
        [0, "&IJlig;"],
        [0, "&ijlig;"],
        [0, "&Jcirc;"],
        [0, "&jcirc;"],
        [0, "&Kcedil;"],
        [0, "&kcedil;"],
        [0, "&kgreen;"],
        [0, "&Lacute;"],
        [0, "&lacute;"],
        [0, "&Lcedil;"],
        [0, "&lcedil;"],
        [0, "&Lcaron;"],
        [0, "&lcaron;"],
        [0, "&Lmidot;"],
        [0, "&lmidot;"],
        [0, "&Lstrok;"],
        [0, "&lstrok;"],
        [0, "&Nacute;"],
        [0, "&nacute;"],
        [0, "&Ncedil;"],
        [0, "&ncedil;"],
        [0, "&Ncaron;"],
        [0, "&ncaron;"],
        [0, "&napos;"],
        [0, "&ENG;"],
        [0, "&eng;"],
        [0, "&Omacr;"],
        [0, "&omacr;"],
        [2, "&Odblac;"],
        [0, "&odblac;"],
        [0, "&OElig;"],
        [0, "&oelig;"],
        [0, "&Racute;"],
        [0, "&racute;"],
        [0, "&Rcedil;"],
        [0, "&rcedil;"],
        [0, "&Rcaron;"],
        [0, "&rcaron;"],
        [0, "&Sacute;"],
        [0, "&sacute;"],
        [0, "&Scirc;"],
        [0, "&scirc;"],
        [0, "&Scedil;"],
        [0, "&scedil;"],
        [0, "&Scaron;"],
        [0, "&scaron;"],
        [0, "&Tcedil;"],
        [0, "&tcedil;"],
        [0, "&Tcaron;"],
        [0, "&tcaron;"],
        [0, "&Tstrok;"],
        [0, "&tstrok;"],
        [0, "&Utilde;"],
        [0, "&utilde;"],
        [0, "&Umacr;"],
        [0, "&umacr;"],
        [0, "&Ubreve;"],
        [0, "&ubreve;"],
        [0, "&Uring;"],
        [0, "&uring;"],
        [0, "&Udblac;"],
        [0, "&udblac;"],
        [0, "&Uogon;"],
        [0, "&uogon;"],
        [0, "&Wcirc;"],
        [0, "&wcirc;"],
        [0, "&Ycirc;"],
        [0, "&ycirc;"],
        [0, "&Yuml;"],
        [0, "&Zacute;"],
        [0, "&zacute;"],
        [0, "&Zdot;"],
        [0, "&zdot;"],
        [0, "&Zcaron;"],
        [0, "&zcaron;"],
        [19, "&fnof;"],
        [34, "&imped;"],
        [63, "&gacute;"],
        [65, "&jmath;"],
        [142, "&circ;"],
        [0, "&caron;"],
        [16, "&breve;"],
        [0, "&DiacriticalDot;"],
        [0, "&ring;"],
        [0, "&ogon;"],
        [0, "&DiacriticalTilde;"],
        [0, "&dblac;"],
        [51, "&DownBreve;"],
        [127, "&Alpha;"],
        [0, "&Beta;"],
        [0, "&Gamma;"],
        [0, "&Delta;"],
        [0, "&Epsilon;"],
        [0, "&Zeta;"],
        [0, "&Eta;"],
        [0, "&Theta;"],
        [0, "&Iota;"],
        [0, "&Kappa;"],
        [0, "&Lambda;"],
        [0, "&Mu;"],
        [0, "&Nu;"],
        [0, "&Xi;"],
        [0, "&Omicron;"],
        [0, "&Pi;"],
        [0, "&Rho;"],
        [1, "&Sigma;"],
        [0, "&Tau;"],
        [0, "&Upsilon;"],
        [0, "&Phi;"],
        [0, "&Chi;"],
        [0, "&Psi;"],
        [0, "&ohm;"],
        [7, "&alpha;"],
        [0, "&beta;"],
        [0, "&gamma;"],
        [0, "&delta;"],
        [0, "&epsi;"],
        [0, "&zeta;"],
        [0, "&eta;"],
        [0, "&theta;"],
        [0, "&iota;"],
        [0, "&kappa;"],
        [0, "&lambda;"],
        [0, "&mu;"],
        [0, "&nu;"],
        [0, "&xi;"],
        [0, "&omicron;"],
        [0, "&pi;"],
        [0, "&rho;"],
        [0, "&sigmaf;"],
        [0, "&sigma;"],
        [0, "&tau;"],
        [0, "&upsi;"],
        [0, "&phi;"],
        [0, "&chi;"],
        [0, "&psi;"],
        [0, "&omega;"],
        [7, "&thetasym;"],
        [0, "&Upsi;"],
        [2, "&phiv;"],
        [0, "&piv;"],
        [5, "&Gammad;"],
        [0, "&digamma;"],
        [18, "&kappav;"],
        [0, "&rhov;"],
        [3, "&epsiv;"],
        [0, "&backepsilon;"],
        [10, "&IOcy;"],
        [0, "&DJcy;"],
        [0, "&GJcy;"],
        [0, "&Jukcy;"],
        [0, "&DScy;"],
        [0, "&Iukcy;"],
        [0, "&YIcy;"],
        [0, "&Jsercy;"],
        [0, "&LJcy;"],
        [0, "&NJcy;"],
        [0, "&TSHcy;"],
        [0, "&KJcy;"],
        [1, "&Ubrcy;"],
        [0, "&DZcy;"],
        [0, "&Acy;"],
        [0, "&Bcy;"],
        [0, "&Vcy;"],
        [0, "&Gcy;"],
        [0, "&Dcy;"],
        [0, "&IEcy;"],
        [0, "&ZHcy;"],
        [0, "&Zcy;"],
        [0, "&Icy;"],
        [0, "&Jcy;"],
        [0, "&Kcy;"],
        [0, "&Lcy;"],
        [0, "&Mcy;"],
        [0, "&Ncy;"],
        [0, "&Ocy;"],
        [0, "&Pcy;"],
        [0, "&Rcy;"],
        [0, "&Scy;"],
        [0, "&Tcy;"],
        [0, "&Ucy;"],
        [0, "&Fcy;"],
        [0, "&KHcy;"],
        [0, "&TScy;"],
        [0, "&CHcy;"],
        [0, "&SHcy;"],
        [0, "&SHCHcy;"],
        [0, "&HARDcy;"],
        [0, "&Ycy;"],
        [0, "&SOFTcy;"],
        [0, "&Ecy;"],
        [0, "&YUcy;"],
        [0, "&YAcy;"],
        [0, "&acy;"],
        [0, "&bcy;"],
        [0, "&vcy;"],
        [0, "&gcy;"],
        [0, "&dcy;"],
        [0, "&iecy;"],
        [0, "&zhcy;"],
        [0, "&zcy;"],
        [0, "&icy;"],
        [0, "&jcy;"],
        [0, "&kcy;"],
        [0, "&lcy;"],
        [0, "&mcy;"],
        [0, "&ncy;"],
        [0, "&ocy;"],
        [0, "&pcy;"],
        [0, "&rcy;"],
        [0, "&scy;"],
        [0, "&tcy;"],
        [0, "&ucy;"],
        [0, "&fcy;"],
        [0, "&khcy;"],
        [0, "&tscy;"],
        [0, "&chcy;"],
        [0, "&shcy;"],
        [0, "&shchcy;"],
        [0, "&hardcy;"],
        [0, "&ycy;"],
        [0, "&softcy;"],
        [0, "&ecy;"],
        [0, "&yucy;"],
        [0, "&yacy;"],
        [1, "&iocy;"],
        [0, "&djcy;"],
        [0, "&gjcy;"],
        [0, "&jukcy;"],
        [0, "&dscy;"],
        [0, "&iukcy;"],
        [0, "&yicy;"],
        [0, "&jsercy;"],
        [0, "&ljcy;"],
        [0, "&njcy;"],
        [0, "&tshcy;"],
        [0, "&kjcy;"],
        [1, "&ubrcy;"],
        [0, "&dzcy;"],
        [7074, "&ensp;"],
        [0, "&emsp;"],
        [0, "&emsp13;"],
        [0, "&emsp14;"],
        [1, "&numsp;"],
        [0, "&puncsp;"],
        [0, "&ThinSpace;"],
        [0, "&hairsp;"],
        [0, "&NegativeMediumSpace;"],
        [0, "&zwnj;"],
        [0, "&zwj;"],
        [0, "&lrm;"],
        [0, "&rlm;"],
        [0, "&dash;"],
        [2, "&ndash;"],
        [0, "&mdash;"],
        [0, "&horbar;"],
        [0, "&Verbar;"],
        [1, "&lsquo;"],
        [0, "&CloseCurlyQuote;"],
        [0, "&lsquor;"],
        [1, "&ldquo;"],
        [0, "&CloseCurlyDoubleQuote;"],
        [0, "&bdquo;"],
        [1, "&dagger;"],
        [0, "&Dagger;"],
        [0, "&bull;"],
        [2, "&nldr;"],
        [0, "&hellip;"],
        [9, "&permil;"],
        [0, "&pertenk;"],
        [0, "&prime;"],
        [0, "&Prime;"],
        [0, "&tprime;"],
        [0, "&backprime;"],
        [3, "&lsaquo;"],
        [0, "&rsaquo;"],
        [3, "&oline;"],
        [2, "&caret;"],
        [1, "&hybull;"],
        [0, "&frasl;"],
        [10, "&bsemi;"],
        [7, "&qprime;"],
        [7, {v: "&MediumSpace;", n: 8202, o: "&ThickSpace;"}],
        [0, "&NoBreak;"],
        [0, "&af;"],
        [0, "&InvisibleTimes;"],
        [0, "&ic;"],
        [72, "&euro;"],
        [46, "&tdot;"],
        [0, "&DotDot;"],
        [37, "&complexes;"],
        [2, "&incare;"],
        [4, "&gscr;"],
        [0, "&hamilt;"],
        [0, "&Hfr;"],
        [0, "&Hopf;"],
        [0, "&planckh;"],
        [0, "&hbar;"],
        [0, "&imagline;"],
        [0, "&Ifr;"],
        [0, "&lagran;"],
        [0, "&ell;"],
        [1, "&naturals;"],
        [0, "&numero;"],
        [0, "&copysr;"],
        [0, "&weierp;"],
        [0, "&Popf;"],
        [0, "&Qopf;"],
        [0, "&realine;"],
        [0, "&real;"],
        [0, "&reals;"],
        [0, "&rx;"],
        [3, "&trade;"],
        [1, "&integers;"],
        [2, "&mho;"],
        [0, "&zeetrf;"],
        [0, "&iiota;"],
        [2, "&bernou;"],
        [0, "&Cayleys;"],
        [1, "&escr;"],
        [0, "&Escr;"],
        [0, "&Fouriertrf;"],
        [1, "&Mellintrf;"],
        [0, "&order;"],
        [0, "&alefsym;"],
        [0, "&beth;"],
        [0, "&gimel;"],
        [0, "&daleth;"],
        [12, "&CapitalDifferentialD;"],
        [0, "&dd;"],
        [0, "&ee;"],
        [0, "&ii;"],
        [10, "&frac13;"],
        [0, "&frac23;"],
        [0, "&frac15;"],
        [0, "&frac25;"],
        [0, "&frac35;"],
        [0, "&frac45;"],
        [0, "&frac16;"],
        [0, "&frac56;"],
        [0, "&frac18;"],
        [0, "&frac38;"],
        [0, "&frac58;"],
        [0, "&frac78;"],
        [49, "&larr;"],
        [0, "&ShortUpArrow;"],
        [0, "&rarr;"],
        [0, "&darr;"],
        [0, "&harr;"],
        [0, "&updownarrow;"],
        [0, "&nwarr;"],
        [0, "&nearr;"],
        [0, "&LowerRightArrow;"],
        [0, "&LowerLeftArrow;"],
        [0, "&nlarr;"],
        [0, "&nrarr;"],
        [1, {v: "&rarrw;", n: 824, o: "&nrarrw;"}],
        [0, "&Larr;"],
        [0, "&Uarr;"],
        [0, "&Rarr;"],
        [0, "&Darr;"],
        [0, "&larrtl;"],
        [0, "&rarrtl;"],
        [0, "&LeftTeeArrow;"],
        [0, "&mapstoup;"],
        [0, "&map;"],
        [0, "&DownTeeArrow;"],
        [1, "&hookleftarrow;"],
        [0, "&hookrightarrow;"],
        [0, "&larrlp;"],
        [0, "&looparrowright;"],
        [0, "&harrw;"],
        [0, "&nharr;"],
        [1, "&lsh;"],
        [0, "&rsh;"],
        [0, "&ldsh;"],
        [0, "&rdsh;"],
        [1, "&crarr;"],
        [0, "&cularr;"],
        [0, "&curarr;"],
        [2, "&circlearrowleft;"],
        [0, "&circlearrowright;"],
        [0, "&leftharpoonup;"],
        [0, "&DownLeftVector;"],
        [0, "&RightUpVector;"],
        [0, "&LeftUpVector;"],
        [0, "&rharu;"],
        [0, "&DownRightVector;"],
        [0, "&dharr;"],
        [0, "&dharl;"],
        [0, "&RightArrowLeftArrow;"],
        [0, "&udarr;"],
        [0, "&LeftArrowRightArrow;"],
        [0, "&leftleftarrows;"],
        [0, "&upuparrows;"],
        [0, "&rightrightarrows;"],
        [0, "&ddarr;"],
        [0, "&leftrightharpoons;"],
        [0, "&Equilibrium;"],
        [0, "&nlArr;"],
        [0, "&nhArr;"],
        [0, "&nrArr;"],
        [0, "&DoubleLeftArrow;"],
        [0, "&DoubleUpArrow;"],
        [0, "&DoubleRightArrow;"],
        [0, "&dArr;"],
        [0, "&DoubleLeftRightArrow;"],
        [0, "&DoubleUpDownArrow;"],
        [0, "&nwArr;"],
        [0, "&neArr;"],
        [0, "&seArr;"],
        [0, "&swArr;"],
        [0, "&lAarr;"],
        [0, "&rAarr;"],
        [1, "&zigrarr;"],
        [6, "&larrb;"],
        [0, "&rarrb;"],
        [15, "&DownArrowUpArrow;"],
        [7, "&loarr;"],
        [0, "&roarr;"],
        [0, "&hoarr;"],
        [0, "&forall;"],
        [0, "&comp;"],
        [0, {v: "&part;", n: 824, o: "&npart;"}],
        [0, "&exist;"],
        [0, "&nexist;"],
        [0, "&empty;"],
        [1, "&Del;"],
        [0, "&Element;"],
        [0, "&NotElement;"],
        [1, "&ni;"],
        [0, "&notni;"],
        [2, "&prod;"],
        [0, "&coprod;"],
        [0, "&sum;"],
        [0, "&minus;"],
        [0, "&MinusPlus;"],
        [0, "&dotplus;"],
        [1, "&Backslash;"],
        [0, "&lowast;"],
        [0, "&compfn;"],
        [1, "&radic;"],
        [2, "&prop;"],
        [0, "&infin;"],
        [0, "&angrt;"],
        [0, {v: "&ang;", n: 8402, o: "&nang;"}],
        [0, "&angmsd;"],
        [0, "&angsph;"],
        [0, "&mid;"],
        [0, "&nmid;"],
        [0, "&DoubleVerticalBar;"],
        [0, "&NotDoubleVerticalBar;"],
        [0, "&and;"],
        [0, "&or;"],
        [0, {v: "&cap;", n: 65024, o: "&caps;"}],
        [0, {v: "&cup;", n: 65024, o: "&cups;"}],
        [0, "&int;"],
        [0, "&Int;"],
        [0, "&iiint;"],
        [0, "&conint;"],
        [0, "&Conint;"],
        [0, "&Cconint;"],
        [0, "&cwint;"],
        [0, "&ClockwiseContourIntegral;"],
        [0, "&awconint;"],
        [0, "&there4;"],
        [0, "&becaus;"],
        [0, "&ratio;"],
        [0, "&Colon;"],
        [0, "&dotminus;"],
        [1, "&mDDot;"],
        [0, "&homtht;"],
        [0, {v: "&sim;", n: 8402, o: "&nvsim;"}],
        [0, {v: "&backsim;", n: 817, o: "&race;"}],
        [0, {v: "&ac;", n: 819, o: "&acE;"}],
        [0, "&acd;"],
        [0, "&VerticalTilde;"],
        [0, "&NotTilde;"],
        [0, {v: "&eqsim;", n: 824, o: "&nesim;"}],
        [0, "&sime;"],
        [0, "&NotTildeEqual;"],
        [0, "&cong;"],
        [0, "&simne;"],
        [0, "&ncong;"],
        [0, "&ap;"],
        [0, "&nap;"],
        [0, "&ape;"],
        [0, {v: "&apid;", n: 824, o: "&napid;"}],
        [0, "&backcong;"],
        [0, {v: "&asympeq;", n: 8402, o: "&nvap;"}],
        [0, {v: "&bump;", n: 824, o: "&nbump;"}],
        [0, {v: "&bumpe;", n: 824, o: "&nbumpe;"}],
        [0, {v: "&doteq;", n: 824, o: "&nedot;"}],
        [0, "&doteqdot;"],
        [0, "&efDot;"],
        [0, "&erDot;"],
        [0, "&Assign;"],
        [0, "&ecolon;"],
        [0, "&ecir;"],
        [0, "&circeq;"],
        [1, "&wedgeq;"],
        [0, "&veeeq;"],
        [1, "&triangleq;"],
        [2, "&equest;"],
        [0, "&ne;"],
        [0, {v: "&Congruent;", n: 8421, o: "&bnequiv;"}],
        [0, "&nequiv;"],
        [1, {v: "&le;", n: 8402, o: "&nvle;"}],
        [0, {v: "&ge;", n: 8402, o: "&nvge;"}],
        [0, {v: "&lE;", n: 824, o: "&nlE;"}],
        [0, {v: "&gE;", n: 824, o: "&ngE;"}],
        [0, {v: "&lnE;", n: 65024, o: "&lvertneqq;"}],
        [0, {v: "&gnE;", n: 65024, o: "&gvertneqq;"}],
        [
          0,
          {
            v: "&ll;",
            n: new Map(
              wa([
                [824, "&nLtv;"],
                [7577, "&nLt;"],
              ])
            ),
          },
        ],
        [
          0,
          {
            v: "&gg;",
            n: new Map(
              wa([
                [824, "&nGtv;"],
                [7577, "&nGt;"],
              ])
            ),
          },
        ],
        [0, "&between;"],
        [0, "&NotCupCap;"],
        [0, "&nless;"],
        [0, "&ngt;"],
        [0, "&nle;"],
        [0, "&nge;"],
        [0, "&lesssim;"],
        [0, "&GreaterTilde;"],
        [0, "&nlsim;"],
        [0, "&ngsim;"],
        [0, "&LessGreater;"],
        [0, "&gl;"],
        [0, "&NotLessGreater;"],
        [0, "&NotGreaterLess;"],
        [0, "&pr;"],
        [0, "&sc;"],
        [0, "&prcue;"],
        [0, "&sccue;"],
        [0, "&PrecedesTilde;"],
        [0, {v: "&scsim;", n: 824, o: "&NotSucceedsTilde;"}],
        [0, "&NotPrecedes;"],
        [0, "&NotSucceeds;"],
        [0, {v: "&sub;", n: 8402, o: "&NotSubset;"}],
        [0, {v: "&sup;", n: 8402, o: "&NotSuperset;"}],
        [0, "&nsub;"],
        [0, "&nsup;"],
        [0, "&sube;"],
        [0, "&supe;"],
        [0, "&NotSubsetEqual;"],
        [0, "&NotSupersetEqual;"],
        [0, {v: "&subne;", n: 65024, o: "&varsubsetneq;"}],
        [0, {v: "&supne;", n: 65024, o: "&varsupsetneq;"}],
        [1, "&cupdot;"],
        [0, "&UnionPlus;"],
        [0, {v: "&sqsub;", n: 824, o: "&NotSquareSubset;"}],
        [0, {v: "&sqsup;", n: 824, o: "&NotSquareSuperset;"}],
        [0, "&sqsube;"],
        [0, "&sqsupe;"],
        [0, {v: "&sqcap;", n: 65024, o: "&sqcaps;"}],
        [0, {v: "&sqcup;", n: 65024, o: "&sqcups;"}],
        [0, "&CirclePlus;"],
        [0, "&CircleMinus;"],
        [0, "&CircleTimes;"],
        [0, "&osol;"],
        [0, "&CircleDot;"],
        [0, "&circledcirc;"],
        [0, "&circledast;"],
        [1, "&circleddash;"],
        [0, "&boxplus;"],
        [0, "&boxminus;"],
        [0, "&boxtimes;"],
        [0, "&dotsquare;"],
        [0, "&RightTee;"],
        [0, "&dashv;"],
        [0, "&DownTee;"],
        [0, "&bot;"],
        [1, "&models;"],
        [0, "&DoubleRightTee;"],
        [0, "&Vdash;"],
        [0, "&Vvdash;"],
        [0, "&VDash;"],
        [0, "&nvdash;"],
        [0, "&nvDash;"],
        [0, "&nVdash;"],
        [0, "&nVDash;"],
        [0, "&prurel;"],
        [1, "&LeftTriangle;"],
        [0, "&RightTriangle;"],
        [0, {v: "&LeftTriangleEqual;", n: 8402, o: "&nvltrie;"}],
        [0, {v: "&RightTriangleEqual;", n: 8402, o: "&nvrtrie;"}],
        [0, "&origof;"],
        [0, "&imof;"],
        [0, "&multimap;"],
        [0, "&hercon;"],
        [0, "&intcal;"],
        [0, "&veebar;"],
        [1, "&barvee;"],
        [0, "&angrtvb;"],
        [0, "&lrtri;"],
        [0, "&bigwedge;"],
        [0, "&bigvee;"],
        [0, "&bigcap;"],
        [0, "&bigcup;"],
        [0, "&diam;"],
        [0, "&sdot;"],
        [0, "&sstarf;"],
        [0, "&divideontimes;"],
        [0, "&bowtie;"],
        [0, "&ltimes;"],
        [0, "&rtimes;"],
        [0, "&leftthreetimes;"],
        [0, "&rightthreetimes;"],
        [0, "&backsimeq;"],
        [0, "&curlyvee;"],
        [0, "&curlywedge;"],
        [0, "&Sub;"],
        [0, "&Sup;"],
        [0, "&Cap;"],
        [0, "&Cup;"],
        [0, "&fork;"],
        [0, "&epar;"],
        [0, "&lessdot;"],
        [0, "&gtdot;"],
        [0, {v: "&Ll;", n: 824, o: "&nLl;"}],
        [0, {v: "&Gg;", n: 824, o: "&nGg;"}],
        [0, {v: "&leg;", n: 65024, o: "&lesg;"}],
        [0, {v: "&gel;", n: 65024, o: "&gesl;"}],
        [2, "&cuepr;"],
        [0, "&cuesc;"],
        [0, "&NotPrecedesSlantEqual;"],
        [0, "&NotSucceedsSlantEqual;"],
        [0, "&NotSquareSubsetEqual;"],
        [0, "&NotSquareSupersetEqual;"],
        [2, "&lnsim;"],
        [0, "&gnsim;"],
        [0, "&precnsim;"],
        [0, "&scnsim;"],
        [0, "&nltri;"],
        [0, "&NotRightTriangle;"],
        [0, "&nltrie;"],
        [0, "&NotRightTriangleEqual;"],
        [0, "&vellip;"],
        [0, "&ctdot;"],
        [0, "&utdot;"],
        [0, "&dtdot;"],
        [0, "&disin;"],
        [0, "&isinsv;"],
        [0, "&isins;"],
        [0, {v: "&isindot;", n: 824, o: "&notindot;"}],
        [0, "&notinvc;"],
        [0, "&notinvb;"],
        [1, {v: "&isinE;", n: 824, o: "&notinE;"}],
        [0, "&nisd;"],
        [0, "&xnis;"],
        [0, "&nis;"],
        [0, "&notnivc;"],
        [0, "&notnivb;"],
        [6, "&barwed;"],
        [0, "&Barwed;"],
        [1, "&lceil;"],
        [0, "&rceil;"],
        [0, "&LeftFloor;"],
        [0, "&rfloor;"],
        [0, "&drcrop;"],
        [0, "&dlcrop;"],
        [0, "&urcrop;"],
        [0, "&ulcrop;"],
        [0, "&bnot;"],
        [1, "&profline;"],
        [0, "&profsurf;"],
        [1, "&telrec;"],
        [0, "&target;"],
        [5, "&ulcorn;"],
        [0, "&urcorn;"],
        [0, "&dlcorn;"],
        [0, "&drcorn;"],
        [2, "&frown;"],
        [0, "&smile;"],
        [9, "&cylcty;"],
        [0, "&profalar;"],
        [7, "&topbot;"],
        [6, "&ovbar;"],
        [1, "&solbar;"],
        [60, "&angzarr;"],
        [51, "&lmoustache;"],
        [0, "&rmoustache;"],
        [2, "&OverBracket;"],
        [0, "&bbrk;"],
        [0, "&bbrktbrk;"],
        [37, "&OverParenthesis;"],
        [0, "&UnderParenthesis;"],
        [0, "&OverBrace;"],
        [0, "&UnderBrace;"],
        [2, "&trpezium;"],
        [4, "&elinters;"],
        [59, "&blank;"],
        [164, "&circledS;"],
        [55, "&boxh;"],
        [1, "&boxv;"],
        [9, "&boxdr;"],
        [3, "&boxdl;"],
        [3, "&boxur;"],
        [3, "&boxul;"],
        [3, "&boxvr;"],
        [7, "&boxvl;"],
        [7, "&boxhd;"],
        [7, "&boxhu;"],
        [7, "&boxvh;"],
        [19, "&boxH;"],
        [0, "&boxV;"],
        [0, "&boxdR;"],
        [0, "&boxDr;"],
        [0, "&boxDR;"],
        [0, "&boxdL;"],
        [0, "&boxDl;"],
        [0, "&boxDL;"],
        [0, "&boxuR;"],
        [0, "&boxUr;"],
        [0, "&boxUR;"],
        [0, "&boxuL;"],
        [0, "&boxUl;"],
        [0, "&boxUL;"],
        [0, "&boxvR;"],
        [0, "&boxVr;"],
        [0, "&boxVR;"],
        [0, "&boxvL;"],
        [0, "&boxVl;"],
        [0, "&boxVL;"],
        [0, "&boxHd;"],
        [0, "&boxhD;"],
        [0, "&boxHD;"],
        [0, "&boxHu;"],
        [0, "&boxhU;"],
        [0, "&boxHU;"],
        [0, "&boxvH;"],
        [0, "&boxVh;"],
        [0, "&boxVH;"],
        [19, "&uhblk;"],
        [3, "&lhblk;"],
        [3, "&block;"],
        [8, "&blk14;"],
        [0, "&blk12;"],
        [0, "&blk34;"],
        [13, "&square;"],
        [8, "&blacksquare;"],
        [0, "&EmptyVerySmallSquare;"],
        [1, "&rect;"],
        [0, "&marker;"],
        [2, "&fltns;"],
        [1, "&bigtriangleup;"],
        [0, "&blacktriangle;"],
        [0, "&triangle;"],
        [2, "&blacktriangleright;"],
        [0, "&rtri;"],
        [3, "&bigtriangledown;"],
        [0, "&blacktriangledown;"],
        [0, "&dtri;"],
        [2, "&blacktriangleleft;"],
        [0, "&ltri;"],
        [6, "&loz;"],
        [0, "&cir;"],
        [32, "&tridot;"],
        [2, "&bigcirc;"],
        [8, "&ultri;"],
        [0, "&urtri;"],
        [0, "&lltri;"],
        [0, "&EmptySmallSquare;"],
        [0, "&FilledSmallSquare;"],
        [8, "&bigstar;"],
        [0, "&star;"],
        [7, "&phone;"],
        [49, "&female;"],
        [1, "&male;"],
        [29, "&spades;"],
        [2, "&clubs;"],
        [1, "&hearts;"],
        [0, "&diamondsuit;"],
        [3, "&sung;"],
        [2, "&flat;"],
        [0, "&natural;"],
        [0, "&sharp;"],
        [163, "&check;"],
        [3, "&cross;"],
        [8, "&malt;"],
        [21, "&sext;"],
        [33, "&VerticalSeparator;"],
        [25, "&lbbrk;"],
        [0, "&rbbrk;"],
        [84, "&bsolhsub;"],
        [0, "&suphsol;"],
        [28, "&LeftDoubleBracket;"],
        [0, "&RightDoubleBracket;"],
        [0, "&lang;"],
        [0, "&rang;"],
        [0, "&Lang;"],
        [0, "&Rang;"],
        [0, "&loang;"],
        [0, "&roang;"],
        [7, "&longleftarrow;"],
        [0, "&longrightarrow;"],
        [0, "&longleftrightarrow;"],
        [0, "&DoubleLongLeftArrow;"],
        [0, "&DoubleLongRightArrow;"],
        [0, "&DoubleLongLeftRightArrow;"],
        [1, "&longmapsto;"],
        [2, "&dzigrarr;"],
        [258, "&nvlArr;"],
        [0, "&nvrArr;"],
        [0, "&nvHarr;"],
        [0, "&Map;"],
        [6, "&lbarr;"],
        [0, "&bkarow;"],
        [0, "&lBarr;"],
        [0, "&dbkarow;"],
        [0, "&drbkarow;"],
        [0, "&DDotrahd;"],
        [0, "&UpArrowBar;"],
        [0, "&DownArrowBar;"],
        [2, "&Rarrtl;"],
        [2, "&latail;"],
        [0, "&ratail;"],
        [0, "&lAtail;"],
        [0, "&rAtail;"],
        [0, "&larrfs;"],
        [0, "&rarrfs;"],
        [0, "&larrbfs;"],
        [0, "&rarrbfs;"],
        [2, "&nwarhk;"],
        [0, "&nearhk;"],
        [0, "&hksearow;"],
        [0, "&hkswarow;"],
        [0, "&nwnear;"],
        [0, "&nesear;"],
        [0, "&seswar;"],
        [0, "&swnwar;"],
        [8, {v: "&rarrc;", n: 824, o: "&nrarrc;"}],
        [1, "&cudarrr;"],
        [0, "&ldca;"],
        [0, "&rdca;"],
        [0, "&cudarrl;"],
        [0, "&larrpl;"],
        [2, "&curarrm;"],
        [0, "&cularrp;"],
        [7, "&rarrpl;"],
        [2, "&harrcir;"],
        [0, "&Uarrocir;"],
        [0, "&lurdshar;"],
        [0, "&ldrushar;"],
        [2, "&LeftRightVector;"],
        [0, "&RightUpDownVector;"],
        [0, "&DownLeftRightVector;"],
        [0, "&LeftUpDownVector;"],
        [0, "&LeftVectorBar;"],
        [0, "&RightVectorBar;"],
        [0, "&RightUpVectorBar;"],
        [0, "&RightDownVectorBar;"],
        [0, "&DownLeftVectorBar;"],
        [0, "&DownRightVectorBar;"],
        [0, "&LeftUpVectorBar;"],
        [0, "&LeftDownVectorBar;"],
        [0, "&LeftTeeVector;"],
        [0, "&RightTeeVector;"],
        [0, "&RightUpTeeVector;"],
        [0, "&RightDownTeeVector;"],
        [0, "&DownLeftTeeVector;"],
        [0, "&DownRightTeeVector;"],
        [0, "&LeftUpTeeVector;"],
        [0, "&LeftDownTeeVector;"],
        [0, "&lHar;"],
        [0, "&uHar;"],
        [0, "&rHar;"],
        [0, "&dHar;"],
        [0, "&luruhar;"],
        [0, "&ldrdhar;"],
        [0, "&ruluhar;"],
        [0, "&rdldhar;"],
        [0, "&lharul;"],
        [0, "&llhard;"],
        [0, "&rharul;"],
        [0, "&lrhard;"],
        [0, "&udhar;"],
        [0, "&duhar;"],
        [0, "&RoundImplies;"],
        [0, "&erarr;"],
        [0, "&simrarr;"],
        [0, "&larrsim;"],
        [0, "&rarrsim;"],
        [0, "&rarrap;"],
        [0, "&ltlarr;"],
        [1, "&gtrarr;"],
        [0, "&subrarr;"],
        [1, "&suplarr;"],
        [0, "&lfisht;"],
        [0, "&rfisht;"],
        [0, "&ufisht;"],
        [0, "&dfisht;"],
        [5, "&lopar;"],
        [0, "&ropar;"],
        [4, "&lbrke;"],
        [0, "&rbrke;"],
        [0, "&lbrkslu;"],
        [0, "&rbrksld;"],
        [0, "&lbrksld;"],
        [0, "&rbrkslu;"],
        [0, "&langd;"],
        [0, "&rangd;"],
        [0, "&lparlt;"],
        [0, "&rpargt;"],
        [0, "&gtlPar;"],
        [0, "&ltrPar;"],
        [3, "&vzigzag;"],
        [1, "&vangrt;"],
        [0, "&angrtvbd;"],
        [6, "&ange;"],
        [0, "&range;"],
        [0, "&dwangle;"],
        [0, "&uwangle;"],
        [0, "&angmsdaa;"],
        [0, "&angmsdab;"],
        [0, "&angmsdac;"],
        [0, "&angmsdad;"],
        [0, "&angmsdae;"],
        [0, "&angmsdaf;"],
        [0, "&angmsdag;"],
        [0, "&angmsdah;"],
        [0, "&bemptyv;"],
        [0, "&demptyv;"],
        [0, "&cemptyv;"],
        [0, "&raemptyv;"],
        [0, "&laemptyv;"],
        [0, "&ohbar;"],
        [0, "&omid;"],
        [0, "&opar;"],
        [1, "&operp;"],
        [1, "&olcross;"],
        [0, "&odsold;"],
        [1, "&olcir;"],
        [0, "&ofcir;"],
        [0, "&olt;"],
        [0, "&ogt;"],
        [0, "&cirscir;"],
        [0, "&cirE;"],
        [0, "&solb;"],
        [0, "&bsolb;"],
        [3, "&boxbox;"],
        [3, "&trisb;"],
        [0, "&rtriltri;"],
        [0, {v: "&LeftTriangleBar;", n: 824, o: "&NotLeftTriangleBar;"}],
        [0, {v: "&RightTriangleBar;", n: 824, o: "&NotRightTriangleBar;"}],
        [11, "&iinfin;"],
        [0, "&infintie;"],
        [0, "&nvinfin;"],
        [4, "&eparsl;"],
        [0, "&smeparsl;"],
        [0, "&eqvparsl;"],
        [5, "&blacklozenge;"],
        [8, "&RuleDelayed;"],
        [1, "&dsol;"],
        [9, "&bigodot;"],
        [0, "&bigoplus;"],
        [0, "&bigotimes;"],
        [1, "&biguplus;"],
        [1, "&bigsqcup;"],
        [5, "&iiiint;"],
        [0, "&fpartint;"],
        [2, "&cirfnint;"],
        [0, "&awint;"],
        [0, "&rppolint;"],
        [0, "&scpolint;"],
        [0, "&npolint;"],
        [0, "&pointint;"],
        [0, "&quatint;"],
        [0, "&intlarhk;"],
        [10, "&pluscir;"],
        [0, "&plusacir;"],
        [0, "&simplus;"],
        [0, "&plusdu;"],
        [0, "&plussim;"],
        [0, "&plustwo;"],
        [1, "&mcomma;"],
        [0, "&minusdu;"],
        [2, "&loplus;"],
        [0, "&roplus;"],
        [0, "&Cross;"],
        [0, "&timesd;"],
        [0, "&timesbar;"],
        [1, "&smashp;"],
        [0, "&lotimes;"],
        [0, "&rotimes;"],
        [0, "&otimesas;"],
        [0, "&Otimes;"],
        [0, "&odiv;"],
        [0, "&triplus;"],
        [0, "&triminus;"],
        [0, "&tritime;"],
        [0, "&intprod;"],
        [2, "&amalg;"],
        [0, "&capdot;"],
        [1, "&ncup;"],
        [0, "&ncap;"],
        [0, "&capand;"],
        [0, "&cupor;"],
        [0, "&cupcap;"],
        [0, "&capcup;"],
        [0, "&cupbrcap;"],
        [0, "&capbrcup;"],
        [0, "&cupcup;"],
        [0, "&capcap;"],
        [0, "&ccups;"],
        [0, "&ccaps;"],
        [2, "&ccupssm;"],
        [2, "&And;"],
        [0, "&Or;"],
        [0, "&andand;"],
        [0, "&oror;"],
        [0, "&orslope;"],
        [0, "&andslope;"],
        [1, "&andv;"],
        [0, "&orv;"],
        [0, "&andd;"],
        [0, "&ord;"],
        [1, "&wedbar;"],
        [6, "&sdote;"],
        [3, "&simdot;"],
        [2, {v: "&congdot;", n: 824, o: "&ncongdot;"}],
        [0, "&easter;"],
        [0, "&apacir;"],
        [0, {v: "&apE;", n: 824, o: "&napE;"}],
        [0, "&eplus;"],
        [0, "&pluse;"],
        [0, "&Esim;"],
        [0, "&Colone;"],
        [0, "&Equal;"],
        [1, "&ddotseq;"],
        [0, "&equivDD;"],
        [0, "&ltcir;"],
        [0, "&gtcir;"],
        [0, "&ltquest;"],
        [0, "&gtquest;"],
        [0, {v: "&leqslant;", n: 824, o: "&nleqslant;"}],
        [0, {v: "&geqslant;", n: 824, o: "&ngeqslant;"}],
        [0, "&lesdot;"],
        [0, "&gesdot;"],
        [0, "&lesdoto;"],
        [0, "&gesdoto;"],
        [0, "&lesdotor;"],
        [0, "&gesdotol;"],
        [0, "&lap;"],
        [0, "&gap;"],
        [0, "&lne;"],
        [0, "&gne;"],
        [0, "&lnap;"],
        [0, "&gnap;"],
        [0, "&lEg;"],
        [0, "&gEl;"],
        [0, "&lsime;"],
        [0, "&gsime;"],
        [0, "&lsimg;"],
        [0, "&gsiml;"],
        [0, "&lgE;"],
        [0, "&glE;"],
        [0, "&lesges;"],
        [0, "&gesles;"],
        [0, "&els;"],
        [0, "&egs;"],
        [0, "&elsdot;"],
        [0, "&egsdot;"],
        [0, "&el;"],
        [0, "&eg;"],
        [2, "&siml;"],
        [0, "&simg;"],
        [0, "&simlE;"],
        [0, "&simgE;"],
        [0, {v: "&LessLess;", n: 824, o: "&NotNestedLessLess;"}],
        [0, {v: "&GreaterGreater;", n: 824, o: "&NotNestedGreaterGreater;"}],
        [1, "&glj;"],
        [0, "&gla;"],
        [0, "&ltcc;"],
        [0, "&gtcc;"],
        [0, "&lescc;"],
        [0, "&gescc;"],
        [0, "&smt;"],
        [0, "&lat;"],
        [0, {v: "&smte;", n: 65024, o: "&smtes;"}],
        [0, {v: "&late;", n: 65024, o: "&lates;"}],
        [0, "&bumpE;"],
        [0, {v: "&PrecedesEqual;", n: 824, o: "&NotPrecedesEqual;"}],
        [0, {v: "&sce;", n: 824, o: "&NotSucceedsEqual;"}],
        [2, "&prE;"],
        [0, "&scE;"],
        [0, "&precneqq;"],
        [0, "&scnE;"],
        [0, "&prap;"],
        [0, "&scap;"],
        [0, "&precnapprox;"],
        [0, "&scnap;"],
        [0, "&Pr;"],
        [0, "&Sc;"],
        [0, "&subdot;"],
        [0, "&supdot;"],
        [0, "&subplus;"],
        [0, "&supplus;"],
        [0, "&submult;"],
        [0, "&supmult;"],
        [0, "&subedot;"],
        [0, "&supedot;"],
        [0, {v: "&subE;", n: 824, o: "&nsubE;"}],
        [0, {v: "&supE;", n: 824, o: "&nsupE;"}],
        [0, "&subsim;"],
        [0, "&supsim;"],
        [2, {v: "&subnE;", n: 65024, o: "&varsubsetneqq;"}],
        [0, {v: "&supnE;", n: 65024, o: "&varsupsetneqq;"}],
        [2, "&csub;"],
        [0, "&csup;"],
        [0, "&csube;"],
        [0, "&csupe;"],
        [0, "&subsup;"],
        [0, "&supsub;"],
        [0, "&subsub;"],
        [0, "&supsup;"],
        [0, "&suphsub;"],
        [0, "&supdsub;"],
        [0, "&forkv;"],
        [0, "&topfork;"],
        [0, "&mlcp;"],
        [8, "&Dashv;"],
        [1, "&Vdashl;"],
        [0, "&Barv;"],
        [0, "&vBar;"],
        [0, "&vBarv;"],
        [1, "&Vbar;"],
        [0, "&Not;"],
        [0, "&bNot;"],
        [0, "&rnmid;"],
        [0, "&cirmid;"],
        [0, "&midcir;"],
        [0, "&topcir;"],
        [0, "&nhpar;"],
        [0, "&parsim;"],
        [9, {v: "&parsl;", n: 8421, o: "&nparsl;"}],
        [
          44343,
          {
            n: new Map(
              wa([
                [56476, "&Ascr;"],
                [1, "&Cscr;"],
                [0, "&Dscr;"],
                [2, "&Gscr;"],
                [2, "&Jscr;"],
                [0, "&Kscr;"],
                [2, "&Nscr;"],
                [0, "&Oscr;"],
                [0, "&Pscr;"],
                [0, "&Qscr;"],
                [1, "&Sscr;"],
                [0, "&Tscr;"],
                [0, "&Uscr;"],
                [0, "&Vscr;"],
                [0, "&Wscr;"],
                [0, "&Xscr;"],
                [0, "&Yscr;"],
                [0, "&Zscr;"],
                [0, "&ascr;"],
                [0, "&bscr;"],
                [0, "&cscr;"],
                [0, "&dscr;"],
                [1, "&fscr;"],
                [1, "&hscr;"],
                [0, "&iscr;"],
                [0, "&jscr;"],
                [0, "&kscr;"],
                [0, "&lscr;"],
                [0, "&mscr;"],
                [0, "&nscr;"],
                [1, "&pscr;"],
                [0, "&qscr;"],
                [0, "&rscr;"],
                [0, "&sscr;"],
                [0, "&tscr;"],
                [0, "&uscr;"],
                [0, "&vscr;"],
                [0, "&wscr;"],
                [0, "&xscr;"],
                [0, "&yscr;"],
                [0, "&zscr;"],
                [52, "&Afr;"],
                [0, "&Bfr;"],
                [1, "&Dfr;"],
                [0, "&Efr;"],
                [0, "&Ffr;"],
                [0, "&Gfr;"],
                [2, "&Jfr;"],
                [0, "&Kfr;"],
                [0, "&Lfr;"],
                [0, "&Mfr;"],
                [0, "&Nfr;"],
                [0, "&Ofr;"],
                [0, "&Pfr;"],
                [0, "&Qfr;"],
                [1, "&Sfr;"],
                [0, "&Tfr;"],
                [0, "&Ufr;"],
                [0, "&Vfr;"],
                [0, "&Wfr;"],
                [0, "&Xfr;"],
                [0, "&Yfr;"],
                [1, "&afr;"],
                [0, "&bfr;"],
                [0, "&cfr;"],
                [0, "&dfr;"],
                [0, "&efr;"],
                [0, "&ffr;"],
                [0, "&gfr;"],
                [0, "&hfr;"],
                [0, "&ifr;"],
                [0, "&jfr;"],
                [0, "&kfr;"],
                [0, "&lfr;"],
                [0, "&mfr;"],
                [0, "&nfr;"],
                [0, "&ofr;"],
                [0, "&pfr;"],
                [0, "&qfr;"],
                [0, "&rfr;"],
                [0, "&sfr;"],
                [0, "&tfr;"],
                [0, "&ufr;"],
                [0, "&vfr;"],
                [0, "&wfr;"],
                [0, "&xfr;"],
                [0, "&yfr;"],
                [0, "&zfr;"],
                [0, "&Aopf;"],
                [0, "&Bopf;"],
                [1, "&Dopf;"],
                [0, "&Eopf;"],
                [0, "&Fopf;"],
                [0, "&Gopf;"],
                [1, "&Iopf;"],
                [0, "&Jopf;"],
                [0, "&Kopf;"],
                [0, "&Lopf;"],
                [0, "&Mopf;"],
                [1, "&Oopf;"],
                [3, "&Sopf;"],
                [0, "&Topf;"],
                [0, "&Uopf;"],
                [0, "&Vopf;"],
                [0, "&Wopf;"],
                [0, "&Xopf;"],
                [0, "&Yopf;"],
                [1, "&aopf;"],
                [0, "&bopf;"],
                [0, "&copf;"],
                [0, "&dopf;"],
                [0, "&eopf;"],
                [0, "&fopf;"],
                [0, "&gopf;"],
                [0, "&hopf;"],
                [0, "&iopf;"],
                [0, "&jopf;"],
                [0, "&kopf;"],
                [0, "&lopf;"],
                [0, "&mopf;"],
                [0, "&nopf;"],
                [0, "&oopf;"],
                [0, "&popf;"],
                [0, "&qopf;"],
                [0, "&ropf;"],
                [0, "&sopf;"],
                [0, "&topf;"],
                [0, "&uopf;"],
                [0, "&vopf;"],
                [0, "&wopf;"],
                [0, "&xopf;"],
                [0, "&yopf;"],
                [0, "&zopf;"],
              ])
            ),
          },
        ],
        [8906, "&fflig;"],
        [0, "&filig;"],
        [0, "&fllig;"],
        [0, "&ffilig;"],
        [0, "&ffllig;"],
      ])
    );
  });
function ui(t) {
  let e = "",
    r = 0,
    n;
  for (; (n = Dd.exec(t)) !== null; ) {
    let s = n.index,
      i = t.charCodeAt(s),
      o = Gm.get(i);
    o !== void 0
      ? ((e += t.substring(r, s) + o), (r = s + 1))
      : ((e += `${t.substring(r, s)}&#x${Ym(t, s).toString(16)};`),
        (r = Dd.lastIndex += +((i & 64512) === 55296)));
  }
  return e + t.substr(r);
}
function Md(t, e) {
  return function (n) {
    let s,
      i = 0,
      o = "";
    for (; (s = t.exec(n)); )
      i !== s.index && (o += n.substring(i, s.index)),
        (o += e.get(s[0].charCodeAt(0))),
        (i = s.index + 1);
    return o + n.substring(i);
  };
}
var Dd,
  Gm,
  Ym,
  Xm,
  Sa,
  Ea,
  Ta = b(() => {
    (Dd = /["&'<>$\x80-\uFFFF]/g),
      (Gm = new Map([
        [34, "&quot;"],
        [38, "&amp;"],
        [39, "&apos;"],
        [60, "&lt;"],
        [62, "&gt;"],
      ])),
      (Ym =
        String.prototype.codePointAt != null
          ? (t, e) => t.codePointAt(e)
          : (t, e) =>
              (t.charCodeAt(e) & 64512) === 55296
                ? (t.charCodeAt(e) - 55296) * 1024 +
                  t.charCodeAt(e + 1) -
                  56320 +
                  65536
                : t.charCodeAt(e));
    (Xm = Md(/[&<>'"]/g, Gm)),
      (Sa = Md(
        /["&\u00A0]/g,
        new Map([
          [34, "&quot;"],
          [38, "&amp;"],
          [160, "&nbsp;"],
        ])
      )),
      (Ea = Md(
        /[&<>\u00A0]/g,
        new Map([
          [38, "&amp;"],
          [60, "&lt;"],
          [62, "&gt;"],
          [160, "&nbsp;"],
        ])
      ));
  });
var _d = b(() => {
  Wm();
  Ta();
});
var Jm,
  Zm,
  tg = b(() => {
    ei();
    _d();
    Ta();
    Ta();
    _d();
    ei();
    (function (t) {
      (t[(t.XML = 0)] = "XML"), (t[(t.HTML = 1)] = "HTML");
    })(Jm || (Jm = {}));
    (function (t) {
      (t[(t.UTF8 = 0)] = "UTF8"),
        (t[(t.ASCII = 1)] = "ASCII"),
        (t[(t.Extensive = 2)] = "Extensive"),
        (t[(t.Attribute = 3)] = "Attribute"),
        (t[(t.Text = 4)] = "Text");
    })(Zm || (Zm = {}));
  });
var rg,
  ng,
  sg = b(() => {
    (rg = new Map(
      [
        "altGlyph",
        "altGlyphDef",
        "altGlyphItem",
        "animateColor",
        "animateMotion",
        "animateTransform",
        "clipPath",
        "feBlend",
        "feColorMatrix",
        "feComponentTransfer",
        "feComposite",
        "feConvolveMatrix",
        "feDiffuseLighting",
        "feDisplacementMap",
        "feDistantLight",
        "feDropShadow",
        "feFlood",
        "feFuncA",
        "feFuncB",
        "feFuncG",
        "feFuncR",
        "feGaussianBlur",
        "feImage",
        "feMerge",
        "feMergeNode",
        "feMorphology",
        "feOffset",
        "fePointLight",
        "feSpecularLighting",
        "feSpotLight",
        "feTile",
        "feTurbulence",
        "foreignObject",
        "glyphRef",
        "linearGradient",
        "radialGradient",
        "textPath",
      ].map((t) => [t.toLowerCase(), t])
    )),
      (ng = new Map(
        [
          "definitionURL",
          "attributeName",
          "attributeType",
          "baseFrequency",
          "baseProfile",
          "calcMode",
          "clipPathUnits",
          "diffuseConstant",
          "edgeMode",
          "filterUnits",
          "glyphRef",
          "gradientTransform",
          "gradientUnits",
          "kernelMatrix",
          "kernelUnitLength",
          "keyPoints",
          "keySplines",
          "keyTimes",
          "lengthAdjust",
          "limitingConeAngle",
          "markerHeight",
          "markerUnits",
          "markerWidth",
          "maskContentUnits",
          "maskUnits",
          "numOctaves",
          "pathLength",
          "patternContentUnits",
          "patternTransform",
          "patternUnits",
          "pointsAtX",
          "pointsAtY",
          "pointsAtZ",
          "preserveAlpha",
          "preserveAspectRatio",
          "primitiveUnits",
          "refX",
          "refY",
          "repeatCount",
          "repeatDur",
          "requiredExtensions",
          "requiredFeatures",
          "specularConstant",
          "specularExponent",
          "spreadMethod",
          "startOffset",
          "stdDeviation",
          "stitchTiles",
          "surfaceScale",
          "systemLanguage",
          "tableValues",
          "targetX",
          "targetY",
          "textLength",
          "viewBox",
          "viewTarget",
          "xChannelSelector",
          "yChannelSelector",
          "zoomAndPan",
        ].map((t) => [t.toLowerCase(), t])
      ));
  });
function x4(t) {
  return t.replace(/"/g, "&quot;");
}
function v4(t, e) {
  var r;
  if (!t) return;
  let n =
    ((r = e.encodeEntities) !== null && r !== void 0 ? r : e.decodeEntities) ===
    !1
      ? x4
      : e.xmlMode || e.encodeEntities !== "utf8"
      ? ui
      : Sa;
  return Object.keys(t)
    .map((s) => {
      var i, o;
      let a = (i = t[s]) !== null && i !== void 0 ? i : "";
      return (
        e.xmlMode === "foreign" &&
          (s = (o = ng.get(s)) !== null && o !== void 0 ? o : s),
        !e.emptyAttrs && !e.xmlMode && a === "" ? s : `${s}="${n(a)}"`
      );
    })
    .join(" ");
}
function Hd(t, e = {}) {
  let r = "length" in t ? t : [t],
    n = "";
  for (let s = 0; s < r.length; s++) n += w4(r[s], e);
  return n;
}
function w4(t, e) {
  switch (t.type) {
    case Sd:
      return Hd(t.children, e);
    case Pd:
    case Td:
      return A4(t);
    case Ad:
      return N4(t);
    case Ld:
      return R4(t);
    case Cd:
    case Rd:
    case Nd:
      return T4(t, e);
    case Ed:
      return C4(t, e);
  }
}
function T4(t, e) {
  var r;
  e.xmlMode === "foreign" &&
    ((t.name = (r = rg.get(t.name)) !== null && r !== void 0 ? r : t.name),
    t.parent && S4.has(t.parent.name) && (e = {...e, xmlMode: !1})),
    !e.xmlMode && E4.has(t.name) && (e = {...e, xmlMode: "foreign"});
  let n = `<${t.name}`,
    s = v4(t.attribs, e);
  return (
    s && (n += ` ${s}`),
    t.children.length === 0 &&
    (e.xmlMode ? e.selfClosingTags !== !1 : e.selfClosingTags && ig.has(t.name))
      ? (e.xmlMode || (n += " "), (n += "/>"))
      : ((n += ">"),
        t.children.length > 0 && (n += Hd(t.children, e)),
        (e.xmlMode || !ig.has(t.name)) && (n += `</${t.name}>`)),
    n
  );
}
function A4(t) {
  return `<${t.data}>`;
}
function C4(t, e) {
  var r;
  let n = t.data || "";
  return (
    ((r = e.encodeEntities) !== null && r !== void 0 ? r : e.decodeEntities) !==
      !1 &&
      !(!e.xmlMode && t.parent && y4.has(t.parent.name)) &&
      (n = e.xmlMode || e.encodeEntities !== "utf8" ? ui(n) : Ea(n)),
    n
  );
}
function R4(t) {
  return `<![CDATA[${t.children[0].data}]]>`;
}
function N4(t) {
  return `<!--${t.data}-->`;
}
var y4,
  ig,
  og,
  S4,
  E4,
  ag = b(() => {
    os();
    tg();
    sg();
    y4 = new Set([
      "style",
      "script",
      "xmp",
      "iframe",
      "noembed",
      "noframes",
      "plaintext",
      "noscript",
    ]);
    ig = new Set([
      "area",
      "base",
      "basefont",
      "br",
      "col",
      "command",
      "embed",
      "frame",
      "hr",
      "img",
      "input",
      "isindex",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ]);
    og = Hd;
    (S4 = new Set([
      "mi",
      "mo",
      "mn",
      "ms",
      "mtext",
      "annotation-xml",
      "foreignObject",
      "desc",
      "title",
    ])),
      (E4 = new Set(["svg", "math"]));
  });
function ug(t, e) {
  return og(t, e);
}
function L4(t, e) {
  return mt(t) ? t.children.map((r) => ug(r, e)).join("") : "";
}
function Aa(t) {
  return Array.isArray(t)
    ? t.map(Aa).join("")
    : _e(t)
    ? t.name === "br"
      ? `
`
      : Aa(t.children)
    : cs(t)
    ? Aa(t.children)
    : er(t)
    ? t.data
    : "";
}
function ci(t) {
  return Array.isArray(t)
    ? t.map(ci).join("")
    : mt(t) && !ai(t)
    ? ci(t.children)
    : er(t)
    ? t.data
    : "";
}
function jd(t) {
  return Array.isArray(t)
    ? t.map(jd).join("")
    : mt(t) && (t.type === J.Tag || cs(t))
    ? jd(t.children)
    : er(t)
    ? t.data
    : "";
}
var zd = b(() => {
  br();
  ag();
  os();
});
function cg(t) {
  return mt(t) ? t.children : [];
}
function lg(t) {
  return t.parent || null;
}
function P4(t) {
  let e = lg(t);
  if (e != null) return cg(e);
  let r = [t],
    {prev: n, next: s} = t;
  for (; n != null; ) r.unshift(n), ({prev: n} = n);
  for (; s != null; ) r.push(s), ({next: s} = s);
  return r;
}
function I4(t, e) {
  var r;
  return (r = t.attribs) === null || r === void 0 ? void 0 : r[e];
}
function k4(t, e) {
  return (
    t.attribs != null &&
    Object.prototype.hasOwnProperty.call(t.attribs, e) &&
    t.attribs[e] != null
  );
}
function O4(t) {
  return t.name;
}
function D4(t) {
  let {next: e} = t;
  for (; e !== null && !_e(e); ) ({next: e} = e);
  return e;
}
function M4(t) {
  let {prev: e} = t;
  for (; e !== null && !_e(e); ) ({prev: e} = e);
  return e;
}
var dg = b(() => {
  br();
});
function li(t) {
  if (
    (t.prev && (t.prev.next = t.next),
    t.next && (t.next.prev = t.prev),
    t.parent)
  ) {
    let e = t.parent.children,
      r = e.lastIndexOf(t);
    r >= 0 && e.splice(r, 1);
  }
  (t.next = null), (t.prev = null), (t.parent = null);
}
function _4(t, e) {
  let r = (e.prev = t.prev);
  r && (r.next = e);
  let n = (e.next = t.next);
  n && (n.prev = e);
  let s = (e.parent = t.parent);
  if (s) {
    let i = s.children;
    (i[i.lastIndexOf(t)] = e), (t.parent = null);
  }
}
function $4(t, e) {
  if ((li(e), (e.next = null), (e.parent = t), t.children.push(e) > 1)) {
    let r = t.children[t.children.length - 2];
    (r.next = e), (e.prev = r);
  } else e.prev = null;
}
function F4(t, e) {
  li(e);
  let {parent: r} = t,
    n = t.next;
  if (((e.next = n), (e.prev = t), (t.next = e), (e.parent = r), n)) {
    if (((n.prev = e), r)) {
      let s = r.children;
      s.splice(s.lastIndexOf(n), 0, e);
    }
  } else r && r.children.push(e);
}
function H4(t, e) {
  if ((li(e), (e.parent = t), (e.prev = null), t.children.unshift(e) !== 1)) {
    let r = t.children[1];
    (r.prev = e), (e.next = r);
  } else e.next = null;
}
function j4(t, e) {
  li(e);
  let {parent: r} = t;
  if (r) {
    let n = r.children;
    n.splice(n.indexOf(t), 0, e);
  }
  t.prev && (t.prev.next = e),
    (e.parent = r),
    (e.prev = t.prev),
    (e.next = t),
    (t.prev = e);
}
var fg = b(() => {});
function di(t, e, r = !0, n = 1 / 0) {
  return pg(t, Array.isArray(e) ? e : [e], r, n);
}
function pg(t, e, r, n) {
  let s = [],
    i = [e],
    o = [0];
  for (;;) {
    if (o[0] >= i[0].length) {
      if (o.length === 1) return s;
      i.shift(), o.shift();
      continue;
    }
    let a = i[0][o[0]++];
    if (t(a) && (s.push(a), --n <= 0)) return s;
    r &&
      mt(a) &&
      a.children.length > 0 &&
      (o.unshift(0), i.unshift(a.children));
  }
}
function z4(t, e) {
  return e.find(t);
}
function Ca(t, e, r = !0) {
  let n = null;
  for (let s = 0; s < e.length && !n; s++) {
    let i = e[s];
    if (_e(i))
      t(i)
        ? (n = i)
        : r && i.children.length > 0 && (n = Ca(t, i.children, !0));
    else continue;
  }
  return n;
}
function hg(t, e) {
  return e.some((r) => _e(r) && (t(r) || hg(t, r.children)));
}
function q4(t, e) {
  let r = [],
    n = [e],
    s = [0];
  for (;;) {
    if (s[0] >= n[0].length) {
      if (n.length === 1) return r;
      n.shift(), s.shift();
      continue;
    }
    let i = n[0][s[0]++];
    _e(i) &&
      (t(i) && r.push(i),
      i.children.length > 0 && (s.unshift(0), n.unshift(i.children)));
  }
}
var qd = b(() => {
  br();
});
function mg(t, e) {
  return typeof e == "function"
    ? (r) => _e(r) && e(r.attribs[t])
    : (r) => _e(r) && r.attribs[t] === e;
}
function U4(t, e) {
  return (r) => t(r) || e(r);
}
function gg(t) {
  let e = Object.keys(t).map((r) => {
    let n = t[r];
    return Object.prototype.hasOwnProperty.call(Ra, r) ? Ra[r](n) : mg(r, n);
  });
  return e.length === 0 ? null : e.reduce(U4);
}
function B4(t, e) {
  let r = gg(t);
  return r ? r(e) : !0;
}
function V4(t, e, r, n = 1 / 0) {
  let s = gg(t);
  return s ? di(s, e, r, n) : [];
}
function K4(t, e, r = !0) {
  return Array.isArray(e) || (e = [e]), Ca(mg("id", t), e, r);
}
function xn(t, e, r = !0, n = 1 / 0) {
  return di(Ra.tag_name(t), e, r, n);
}
function W4(t, e, r = !0, n = 1 / 0) {
  return di(Ra.tag_type(t), e, r, n);
}
var Ra,
  Ud = b(() => {
    br();
    qd();
    Ra = {
      tag_name(t) {
        return typeof t == "function"
          ? (e) => _e(e) && t(e.name)
          : t === "*"
          ? _e
          : (e) => _e(e) && e.name === t;
      },
      tag_type(t) {
        return typeof t == "function" ? (e) => t(e.type) : (e) => e.type === t;
      },
      tag_contains(t) {
        return typeof t == "function"
          ? (e) => er(e) && t(e.data)
          : (e) => er(e) && e.data === t;
      },
    };
  });
function G4(t) {
  let e = t.length;
  for (; --e >= 0; ) {
    let r = t[e];
    if (e > 0 && t.lastIndexOf(r, e - 1) >= 0) {
      t.splice(e, 1);
      continue;
    }
    for (let n = r.parent; n; n = n.parent)
      if (t.includes(n)) {
        t.splice(e, 1);
        break;
      }
  }
  return t;
}
function bg(t, e) {
  let r = [],
    n = [];
  if (t === e) return 0;
  let s = mt(t) ? t : t.parent;
  for (; s; ) r.unshift(s), (s = s.parent);
  for (s = mt(e) ? e : e.parent; s; ) n.unshift(s), (s = s.parent);
  let i = Math.min(r.length, n.length),
    o = 0;
  for (; o < i && r[o] === n[o]; ) o++;
  if (o === 0) return Et.DISCONNECTED;
  let a = r[o - 1],
    u = a.children,
    c = r[o],
    l = n[o];
  return u.indexOf(c) > u.indexOf(l)
    ? a === e
      ? Et.FOLLOWING | Et.CONTAINED_BY
      : Et.FOLLOWING
    : a === t
    ? Et.PRECEDING | Et.CONTAINS
    : Et.PRECEDING;
}
function Y4(t) {
  return (
    (t = t.filter((e, r, n) => !n.includes(e, r + 1))),
    t.sort((e, r) => {
      let n = bg(e, r);
      return n & Et.PRECEDING ? -1 : n & Et.FOLLOWING ? 1 : 0;
    }),
    t
  );
}
var Et,
  yg = b(() => {
    br();
    (function (t) {
      (t[(t.DISCONNECTED = 1)] = "DISCONNECTED"),
        (t[(t.PRECEDING = 2)] = "PRECEDING"),
        (t[(t.FOLLOWING = 4)] = "FOLLOWING"),
        (t[(t.CONTAINS = 8)] = "CONTAINS"),
        (t[(t.CONTAINED_BY = 16)] = "CONTAINED_BY");
    })(Et || (Et = {}));
  });
function fi(t) {
  let e = Na(eT, t);
  return e ? (e.name === "feed" ? X4(e) : J4(e)) : null;
}
function X4(t) {
  var e;
  let r = t.children,
    n = {
      type: "atom",
      items: xn("entry", r).map((o) => {
        var a;
        let {children: u} = o,
          c = {media: xg(u)};
        nt(c, "id", "id", u), nt(c, "title", "title", u);
        let l =
          (a = Na("link", u)) === null || a === void 0
            ? void 0
            : a.attribs.href;
        l && (c.link = l);
        let d = Kr("summary", u) || Kr("content", u);
        d && (c.description = d);
        let f = Kr("updated", u);
        return f && (c.pubDate = new Date(f)), c;
      }),
    };
  nt(n, "id", "id", r), nt(n, "title", "title", r);
  let s =
    (e = Na("link", r)) === null || e === void 0 ? void 0 : e.attribs.href;
  s && (n.link = s), nt(n, "description", "subtitle", r);
  let i = Kr("updated", r);
  return i && (n.updated = new Date(i)), nt(n, "author", "email", r, !0), n;
}
function J4(t) {
  var e, r;
  let n =
      (r =
        (e = Na("channel", t.children)) === null || e === void 0
          ? void 0
          : e.children) !== null && r !== void 0
        ? r
        : [],
    s = {
      type: t.name.substr(0, 3),
      id: "",
      items: xn("item", t.children).map((o) => {
        let {children: a} = o,
          u = {media: xg(a)};
        nt(u, "id", "guid", a),
          nt(u, "title", "title", a),
          nt(u, "link", "link", a),
          nt(u, "description", "description", a);
        let c = Kr("pubDate", a) || Kr("dc:date", a);
        return c && (u.pubDate = new Date(c)), u;
      }),
    };
  nt(s, "title", "title", n),
    nt(s, "link", "link", n),
    nt(s, "description", "description", n);
  let i = Kr("lastBuildDate", n);
  return (
    i && (s.updated = new Date(i)), nt(s, "author", "managingEditor", n, !0), s
  );
}
function xg(t) {
  return xn("media:content", t).map((e) => {
    let {attribs: r} = e,
      n = {medium: r.medium, isDefault: !!r.isDefault};
    for (let s of Z4) r[s] && (n[s] = r[s]);
    for (let s of Q4) r[s] && (n[s] = parseInt(r[s], 10));
    return r.expression && (n.expression = r.expression), n;
  });
}
function Na(t, e) {
  return xn(t, e, !0, 1)[0];
}
function Kr(t, e, r = !1) {
  return ci(xn(t, e, r, 1)).trim();
}
function nt(t, e, r, n, s = !1) {
  let i = Kr(r, n, s);
  i && (t[e] = i);
}
function eT(t) {
  return t === "rss" || t === "feed" || t === "rdf:RDF";
}
var Z4,
  Q4,
  vg = b(() => {
    zd();
    Ud();
    (Z4 = ["url", "type", "lang"]),
      (Q4 = [
        "fileSize",
        "bitrate",
        "framerate",
        "samplingrate",
        "channels",
        "duration",
        "height",
        "width",
      ]);
  });
var ls = {};
vt(ls, {
  DocumentPosition: () => Et,
  append: () => F4,
  appendChild: () => $4,
  compareDocumentPosition: () => bg,
  existsOne: () => hg,
  filter: () => di,
  find: () => pg,
  findAll: () => q4,
  findOne: () => Ca,
  findOneChild: () => z4,
  getAttributeValue: () => I4,
  getChildren: () => cg,
  getElementById: () => K4,
  getElements: () => V4,
  getElementsByTagName: () => xn,
  getElementsByTagType: () => W4,
  getFeed: () => fi,
  getInnerHTML: () => L4,
  getName: () => O4,
  getOuterHTML: () => ug,
  getParent: () => lg,
  getSiblings: () => P4,
  getText: () => Aa,
  hasAttrib: () => k4,
  hasChildren: () => mt,
  innerText: () => jd,
  isCDATA: () => cs,
  isComment: () => ai,
  isDocument: () => kd,
  isTag: () => _e,
  isText: () => er,
  nextElementSibling: () => D4,
  prepend: () => j4,
  prependChild: () => H4,
  prevElementSibling: () => M4,
  removeElement: () => li,
  removeSubsets: () => G4,
  replaceElement: () => _4,
  testElement: () => B4,
  textContent: () => ci,
  uniqueSort: () => Y4,
});
var pi = b(() => {
  zd();
  dg();
  fg();
  qd();
  Ud();
  yg();
  vg();
  br();
});
var Bd = {};
vt(Bd, {
  DefaultHandler: () => gr,
  DomHandler: () => gr,
  DomUtils: () => ls,
  ElementType: () => xa,
  Parser: () => Vr,
  QuoteType: () => ht,
  Tokenizer: () => yn,
  createDocumentStream: () => tT,
  createDomStream: () => rT,
  getFeed: () => fi,
  parseDOM: () => Sg,
  parseDocument: () => wg,
  parseFeed: () => sT,
});
function wg(t, e) {
  let r = new gr(void 0, e);
  return new Vr(r, e).end(t), r.root;
}
function Sg(t, e) {
  return wg(t, e).children;
}
function tT(t, e, r) {
  let n = new gr((s) => t(s, n.root), e, r);
  return new Vr(n, e);
}
function rT(t, e, r) {
  let n = new gr(t, e, r);
  return new Vr(n, e);
}
function sT(t, e = nT) {
  return fi(Sg(t, e));
}
var nT,
  Eg = b(() => {
    vd();
    vd();
    br();
    br();
    xd();
    os();
    pi();
    pi();
    pi();
    nT = {xmlMode: !0};
  });
var Tg,
  Vd,
  Kd,
  Wd,
  Gd,
  Yd,
  Ag,
  Xd,
  Jd,
  Cg,
  Rg,
  Ng,
  vn,
  fe = b(() => {
    (Tg = new Set([
      "ARTICLE",
      "ASIDE",
      "BLOCKQUOTE",
      "BODY",
      "BR",
      "BUTTON",
      "CANVAS",
      "CAPTION",
      "COL",
      "COLGROUP",
      "DD",
      "DIV",
      "DL",
      "DT",
      "EMBED",
      "FIELDSET",
      "FIGCAPTION",
      "FIGURE",
      "FOOTER",
      "FORM",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "LI",
      "UL",
      "OL",
      "P",
    ])),
      (Vd = -1),
      (Kd = 1),
      (Wd = 4),
      (Gd = 8),
      (Yd = 128),
      (Ag = 1),
      (Xd = 2),
      (Jd = 4),
      (Cg = 8),
      (Rg = 16),
      (Ng = 32),
      (vn = "http://www.w3.org/2000/svg");
  });
var Lg,
  Pg,
  Ig,
  kg,
  JL,
  Og,
  Ne,
  wn = b(() => {
    ({
      assign: Lg,
      create: Pg,
      defineProperties: Ig,
      entries: kg,
      getOwnPropertyDescriptors: JL,
      keys: Og,
      setPrototypeOf: Ne,
    } = Object);
  });
var $t,
  $e,
  Tt,
  st,
  hi,
  Dg,
  yr,
  mi,
  La,
  Ve = b(() => {
    fe();
    ee();
    ($t = String),
      ($e = (t) => (t.nodeType === 1 ? t[_] : t)),
      (Tt = ({ownerDocument: t}) => t[_t].ignoreCase),
      (st = (t, e) => {
        (t[I] = e), (e[ie] = t);
      }),
      (hi = (t, e, r) => {
        st(t, e), st($e(e), r);
      }),
      (Dg = (t, e, r, n) => {
        st(t, e), st($e(r), n);
      }),
      (yr = (t, e, r) => {
        st(t, e), st(e, r);
      }),
      (mi = ({localName: t, ownerDocument: e}) =>
        e[_t].ignoreCase ? t.toUpperCase() : t),
      (La = (t, e) => {
        t && (t[I] = e), e && (e[ie] = t);
      });
  });
var tr,
  Zd = b(() => {
    tr = new WeakMap();
  });
var Ia,
  Sn,
  xr,
  En,
  $g,
  Mg,
  gi,
  _g,
  Fg,
  Pa,
  vr = b(() => {
    fe();
    ee();
    wn();
    Zd();
    (Ia = !1),
      (Sn = new WeakMap()),
      (xr = new WeakMap()),
      (En = (t, e, r, n) => {
        Ia &&
          xr.has(t) &&
          t.attributeChangedCallback &&
          t.constructor.observedAttributes.includes(e) &&
          t.attributeChangedCallback(e, r, n);
      }),
      ($g = (t, e) => (r) => {
        if (xr.has(r)) {
          let n = xr.get(r);
          n.connected !== e &&
            r.isConnected === e &&
            ((n.connected = e), t in r && r[t]());
        }
      }),
      (Mg = $g("connectedCallback", !0)),
      (gi = (t) => {
        if (Ia) {
          Mg(t), tr.has(t) && (t = tr.get(t).shadowRoot);
          let {[I]: e, [_]: r} = t;
          for (; e !== r; ) e.nodeType === 1 && Mg(e), (e = e[I]);
        }
      }),
      (_g = $g("disconnectedCallback", !1)),
      (Fg = (t) => {
        if (Ia) {
          _g(t), tr.has(t) && (t = tr.get(t).shadowRoot);
          let {[I]: e, [_]: r} = t;
          for (; e !== r; ) e.nodeType === 1 && _g(e), (e = e[I]);
        }
      }),
      (Pa = class {
        constructor(e) {
          (this.ownerDocument = e),
            (this.registry = new Map()),
            (this.waiting = new Map()),
            (this.active = !1);
        }
        define(e, r, n = {}) {
          let {ownerDocument: s, registry: i, waiting: o} = this;
          if (i.has(e)) throw new Error("unable to redefine " + e);
          if (Sn.has(r))
            throw new Error("unable to redefine the same class: " + r);
          this.active = Ia = !0;
          let {extends: a} = n;
          Sn.set(r, {
            ownerDocument: s,
            options: {is: a ? e : ""},
            localName: a || e,
          });
          let u = a
            ? (c) => c.localName === a && c.getAttribute("is") === e
            : (c) => c.localName === e;
          if ((i.set(e, {Class: r, check: u}), o.has(e))) {
            for (let c of o.get(e)) c(r);
            o.delete(e);
          }
          s.querySelectorAll(a ? `${a}[is="${e}"]` : e).forEach(
            this.upgrade,
            this
          );
        }
        upgrade(e) {
          if (xr.has(e)) return;
          let {ownerDocument: r, registry: n} = this,
            s = e.getAttribute("is") || e.localName;
          if (n.has(s)) {
            let {Class: i, check: o} = n.get(s);
            if (o(e)) {
              let {attributes: a, isConnected: u} = e;
              for (let l of a) e.removeAttributeNode(l);
              let c = kg(e);
              for (let [l] of c) delete e[l];
              Ne(e, i.prototype),
                (r[Ur] = {element: e, values: c}),
                new i(r, s),
                xr.set(e, {connected: u});
              for (let l of a) e.setAttributeNode(l);
              u && e.connectedCallback && e.connectedCallback();
            }
          }
        }
        whenDefined(e) {
          let {registry: r, waiting: n} = this;
          return new Promise((s) => {
            r.has(e)
              ? s(r.get(e).Class)
              : (n.has(e) || n.set(e, []), n.get(e).push(s));
          });
        }
        get(e) {
          let r = this.registry.get(e);
          return r && r.Class;
        }
        getName(e) {
          if (Sn.has(e)) {
            let {localName: r} = Sn.get(e);
            return r;
          }
          return null;
        }
      });
  });
var iT,
  Hg,
  Tn,
  oT,
  ka,
  Qd = b(() => {
    Eg();
    fe();
    ee();
    wn();
    Ve();
    vr();
    ({Parser: iT} = Bd),
      (Hg = !0),
      (Tn = (t, e, r) => {
        let n = t[_];
        return (
          (e.parentNode = t), hi(n[ie], e, n), r && e.nodeType === 1 && gi(e), e
        );
      }),
      (oT = (t, e, r, n, s) => {
        (r[Y] = n),
          (r.ownerElement = t),
          yr(e[ie], r, e),
          r.name === "class" && (t.className = n),
          s && En(t, r.name, null, n);
      }),
      (ka = (t, e, r) => {
        let {active: n, registry: s} = t[Je],
          i = t,
          o = null,
          a = !1;
        Hg = !1;
        let u = new iT(
          {
            onprocessinginstruction(c, l) {
              c.toLowerCase() === "!doctype" &&
                (t.doctype = l.slice(c.length).trim());
            },
            onopentag(c, l) {
              let d = !0;
              if (e) {
                if (o)
                  (i = Tn(i, t.createElementNS(vn, c), n)),
                    (i.ownerSVGElement = o),
                    (d = !1);
                else if (c === "svg" || c === "SVG")
                  (o = t.createElementNS(vn, c)), (i = Tn(i, o, n)), (d = !1);
                else if (n) {
                  let h = c.includes("-") ? c : l.is || "";
                  if (h && s.has(h)) {
                    let {Class: p} = s.get(h);
                    (i = Tn(i, new p(), n)), delete l.is, (d = !1);
                  }
                }
              }
              d && (i = Tn(i, t.createElement(c), !1));
              let f = i[_];
              for (let h of Og(l)) oT(i, f, t.createAttribute(h), l[h], n);
            },
            oncomment(c) {
              Tn(i, t.createComment(c), n);
            },
            ontext(c) {
              a
                ? Tn(i, t.createCDATASection(c), n)
                : Tn(i, t.createTextNode(c), n);
            },
            oncdatastart() {
              a = !0;
            },
            oncdataend() {
              a = !1;
            },
            onclosetag() {
              e && i === o && (o = null), (i = i.parentNode);
            },
          },
          {lowerCaseAttributeNames: !1, decodeEntities: !0, xmlMode: !e}
        );
        return u.write(r), u.end(), (Hg = !0), t;
      });
  });
var ds,
  X,
  ve = b(() => {
    (ds = new Map()),
      (X = (t, e) => {
        for (let r of [].concat(t)) ds.set(r, e), ds.set(r.toUpperCase(), e);
      });
  });
var jg = de((ef) => {
  try {
    let {performance: t} = op("perf_hooks");
    ef.performance = t;
  } catch {
    ef.performance = {
      now() {
        return +new Date();
      },
    };
  }
});
var zg,
  tf,
  rf,
  qg,
  nf,
  sf,
  fs = b(() => {
    fe();
    ee();
    Ve();
    (zg = ({[I]: t, [_]: e}, r) => {
      for (; t !== e; ) {
        switch (t.nodeType) {
          case 2:
            tf(t, r);
            break;
          case 3:
          case 8:
          case 4:
            rf(t, r);
            break;
          case 1:
            sf(t, r), (t = $e(t));
            break;
          case 10:
            nf(t, r);
            break;
        }
        t = t[I];
      }
      let n = r.length - 1,
        s = r[n];
      typeof s == "number" && s < 0 ? (r[n] += -1) : r.push(-1);
    }),
      (tf = (t, e) => {
        e.push(2, t.name);
        let r = t[Y].trim();
        r && e.push(r);
      }),
      (rf = (t, e) => {
        let r = t[Y];
        r.trim() && e.push(t.nodeType, r);
      }),
      (qg = (t, e) => {
        e.push(t.nodeType), zg(t, e);
      }),
      (nf = ({name: t, publicId: e, systemId: r}, n) => {
        n.push(10, t), e && n.push(e), r && n.push(r);
      }),
      (sf = (t, e) => {
        e.push(1, t.localName), zg(t, e);
      });
  });
var Bg,
  Ug,
  bi,
  Wr,
  Oa,
  An = b(() => {
    ee();
    (Bg = (t, e, r, n, s, i) => ({
      type: t,
      target: e,
      addedNodes: r,
      removedNodes: n,
      attributeName: s,
      oldValue: i,
    })),
      (Ug = (t, e, r, n, s, i) => {
        if (!n || n.includes(r)) {
          let {callback: o, records: a, scheduled: u} = t;
          a.push(Bg("attributes", e, [], [], r, s ? i : void 0)),
            u ||
              ((t.scheduled = !0),
              Promise.resolve().then(() => {
                (t.scheduled = !1), o(a.splice(0), t);
              }));
        }
      }),
      (bi = (t, e, r) => {
        let {ownerDocument: n} = t,
          {active: s, observers: i} = n[Qt];
        if (s) {
          for (let o of i)
            for (let [
              a,
              {
                childList: u,
                subtree: c,
                attributes: l,
                attributeFilter: d,
                attributeOldValue: f,
              },
            ] of o.nodes)
              if (u) {
                if (
                  (c && (a === n || a.contains(t))) ||
                  (!c && a.children.includes(t))
                ) {
                  Ug(o, t, e, d, f, r);
                  break;
                }
              } else if (l && a === t) {
                Ug(o, t, e, d, f, r);
                break;
              }
        }
      }),
      (Wr = (t, e) => {
        let {ownerDocument: r} = t,
          {active: n, observers: s} = r[Qt];
        if (n) {
          for (let i of s)
            for (let [
              o,
              {subtree: a, childList: u, characterData: c},
            ] of i.nodes)
              if (
                u &&
                ((e && (o === e || (a && o.contains(e)))) ||
                  (!e &&
                    ((a && (o === r || o.contains(t))) ||
                      (!a && o[c ? "childNodes" : "children"].includes(t)))))
              ) {
                let {callback: l, records: d, scheduled: f} = i;
                d.push(Bg("childList", o, e ? [] : [t], e ? [t] : [])),
                  f ||
                    ((i.scheduled = !0),
                    Promise.resolve().then(() => {
                      (i.scheduled = !1), l(d.splice(0), i);
                    }));
                break;
              }
        }
      }),
      (Oa = class {
        constructor(e) {
          let r = new Set();
          (this.observers = r),
            (this.active = !1),
            (this.class = class {
              constructor(s) {
                (this.callback = s),
                  (this.nodes = new Map()),
                  (this.records = []),
                  (this.scheduled = !1);
              }
              disconnect() {
                this.records.splice(0),
                  this.nodes.clear(),
                  r.delete(this),
                  (e[Qt].active = !!r.size);
              }
              observe(
                s,
                i = {
                  subtree: !1,
                  childList: !1,
                  attributes: !1,
                  attributeFilter: null,
                  attributeOldValue: !1,
                  characterData: !1,
                }
              ) {
                ("attributeOldValue" in i || "attributeFilter" in i) &&
                  (i.attributes = !0),
                  (i.childList = !!i.childList),
                  (i.subtree = !!i.subtree),
                  this.nodes.set(s, i),
                  r.add(this),
                  (e[Qt].active = !0);
              }
              takeRecords() {
                return this.records.splice(0);
              }
            });
        }
      });
  });
var Vg,
  yi,
  of,
  W,
  Ft,
  L,
  Fe = b(() => {
    ee();
    Ve();
    vr();
    An();
    (Vg = new Set([
      "allowfullscreen",
      "allowpaymentrequest",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "class",
      "contenteditable",
      "controls",
      "default",
      "defer",
      "disabled",
      "draggable",
      "formnovalidate",
      "hidden",
      "id",
      "ismap",
      "itemscope",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "selected",
      "style",
      "truespeed",
    ])),
      (yi = (t, e) => {
        let {[Y]: r, name: n} = e;
        (e.ownerElement = t),
          yr(t, e, t[I]),
          n === "class" && (t.className = r),
          bi(t, n, null),
          En(t, n, null, r);
      }),
      (of = (t, e) => {
        let {[Y]: r, name: n} = e;
        st(e[ie], e[I]),
          (e.ownerElement = e[ie] = e[I] = null),
          n === "class" && (t[zr] = null),
          bi(t, n, r),
          En(t, n, r, null);
      }),
      (W = {
        get(t, e) {
          return t.hasAttribute(e);
        },
        set(t, e, r) {
          r ? t.setAttribute(e, "") : t.removeAttribute(e);
        },
      }),
      (Ft = {
        get(t, e) {
          return parseFloat(t.getAttribute(e) || 0);
        },
        set(t, e, r) {
          t.setAttribute(e, r);
        },
      }),
      (L = {
        get(t, e) {
          return t.getAttribute(e) || "";
        },
        set(t, e, r) {
          t.setAttribute(e, r);
        },
      });
  });
function aT(t, e) {
  return (
    typeof e == "function" ? e.call(t.target, t) : e.handleEvent(t),
    t._stopImmediatePropagationFlag
  );
}
function uT({currentTarget: t, target: e}) {
  let r = Da.get(t);
  if (r && r.has(this.type)) {
    let n = r.get(this.type);
    t === e
      ? (this.eventPhase = this.AT_TARGET)
      : (this.eventPhase = this.BUBBLING_PHASE),
      (this.currentTarget = t),
      (this.target = e);
    for (let [s, i] of n) if ((i && i.once && n.delete(s), aT(this, s))) break;
    return delete this.currentTarget, delete this.target, this.cancelBubble;
  }
}
var Da,
  Gr,
  Ma = b(() => {
    Da = new WeakMap();
    Gr = class {
      constructor() {
        Da.set(this, new Map());
      }
      _getParent() {
        return null;
      }
      addEventListener(e, r, n) {
        let s = Da.get(this);
        s.has(e) || s.set(e, new Map()), s.get(e).set(r, n);
      }
      removeEventListener(e, r) {
        let n = Da.get(this);
        if (n.has(e)) {
          let s = n.get(e);
          s.delete(r) && !s.size && n.delete(e);
        }
      }
      dispatchEvent(e) {
        let r = this;
        for (e.eventPhase = e.CAPTURING_PHASE; r; )
          r.dispatchEvent && e._path.push({currentTarget: r, target: this}),
            (r = e.bubbles && r._getParent && r._getParent());
        return (
          e._path.some(uT, e),
          (e._path = []),
          (e.eventPhase = e.NONE),
          !e.defaultPrevented
        );
      }
    };
  });
var ke,
  Yr = b(() => {
    ke = class extends Array {
      item(e) {
        return e < this.length ? this[e] : null;
      }
    };
  });
var Kg,
  it,
  ps = b(() => {
    fe();
    ee();
    Ma();
    Yr();
    (Kg = ({parentNode: t}) => {
      let e = 0;
      for (; t; ) e++, (t = t.parentNode);
      return e;
    }),
      (it = class extends Gr {
        static get ELEMENT_NODE() {
          return 1;
        }
        static get ATTRIBUTE_NODE() {
          return 2;
        }
        static get TEXT_NODE() {
          return 3;
        }
        static get CDATA_SECTION_NODE() {
          return 4;
        }
        static get COMMENT_NODE() {
          return 8;
        }
        static get DOCUMENT_NODE() {
          return 9;
        }
        static get DOCUMENT_FRAGMENT_NODE() {
          return 11;
        }
        static get DOCUMENT_TYPE_NODE() {
          return 10;
        }
        constructor(e, r, n) {
          super(),
            (this.ownerDocument = e),
            (this.localName = r),
            (this.nodeType = n),
            (this.parentNode = null),
            (this[I] = null),
            (this[ie] = null);
        }
        get ELEMENT_NODE() {
          return 1;
        }
        get ATTRIBUTE_NODE() {
          return 2;
        }
        get TEXT_NODE() {
          return 3;
        }
        get CDATA_SECTION_NODE() {
          return 4;
        }
        get COMMENT_NODE() {
          return 8;
        }
        get DOCUMENT_NODE() {
          return 9;
        }
        get DOCUMENT_FRAGMENT_NODE() {
          return 11;
        }
        get DOCUMENT_TYPE_NODE() {
          return 10;
        }
        get baseURI() {
          let e = this.nodeType === 9 ? this : this.ownerDocument;
          if (e) {
            let r = e.querySelector("base");
            if (r) return r.getAttribute("href");
            let {location: n} = e.defaultView;
            if (n) return n.href;
          }
          return null;
        }
        get isConnected() {
          return !1;
        }
        get nodeName() {
          return this.localName;
        }
        get parentElement() {
          return null;
        }
        get previousSibling() {
          return null;
        }
        get previousElementSibling() {
          return null;
        }
        get nextSibling() {
          return null;
        }
        get nextElementSibling() {
          return null;
        }
        get childNodes() {
          return new ke();
        }
        get firstChild() {
          return null;
        }
        get lastChild() {
          return null;
        }
        get nodeValue() {
          return null;
        }
        set nodeValue(e) {}
        get textContent() {
          return null;
        }
        set textContent(e) {}
        normalize() {}
        cloneNode() {
          return null;
        }
        contains() {
          return !1;
        }
        insertBefore(e, r) {
          return e;
        }
        appendChild(e) {
          return e;
        }
        replaceChild(e, r) {
          return r;
        }
        removeChild(e) {
          return e;
        }
        toString() {
          return "";
        }
        hasChildNodes() {
          return !!this.lastChild;
        }
        isSameNode(e) {
          return this === e;
        }
        compareDocumentPosition(e) {
          let r = 0;
          if (this !== e) {
            let n = Kg(this),
              s = Kg(e);
            if (n < s) (r += Jd), this.contains(e) && (r += Rg);
            else if (s < n) (r += Xd), e.contains(this) && (r += Cg);
            else if (n && s) {
              let {childNodes: i} = this.parentNode;
              i.indexOf(this) < i.indexOf(e) ? (r += Jd) : (r += Xd);
            }
            (!n || !s) && ((r += Ng), (r += Ag));
          }
          return r;
        }
        isEqualNode(e) {
          if (this === e) return !0;
          if (this.nodeType === e.nodeType) {
            switch (this.nodeType) {
              case 9:
              case 11: {
                let r = this.childNodes,
                  n = e.childNodes;
                return (
                  r.length === n.length &&
                  r.every((s, i) => s.isEqualNode(n[i]))
                );
              }
            }
            return this.toString() === e.toString();
          }
          return !1;
        }
        _getParent() {
          return this.parentNode;
        }
        getRootNode() {
          let e = this;
          for (; e.parentNode; ) e = e.parentNode;
          return e;
        }
      });
  });
var cT,
  lT,
  dT,
  fT,
  hs,
  _a = b(() => {
    ({replace: cT} = ""),
      (lT = /[<>&\xA0]/g),
      (dT = {"\xA0": "&#160;", "&": "&amp;", "<": "&lt;", ">": "&gt;"}),
      (fT = (t) => dT[t]),
      (hs = (t) => cT.call(t, lT, fT));
  });
var pT,
  Ct,
  ms = b(() => {
    fe();
    ee();
    Ve();
    fs();
    Fe();
    An();
    vr();
    ps();
    _a();
    (pT = /"/g),
      (Ct = class t extends it {
        constructor(e, r, n = "") {
          super(e, r, 2),
            (this.ownerElement = null),
            (this.name = $t(r)),
            (this[Y] = $t(n)),
            (this[es] = !1);
        }
        get value() {
          return this[Y];
        }
        set value(e) {
          let {[Y]: r, name: n, ownerElement: s} = this;
          (this[Y] = $t(e)),
            (this[es] = !0),
            s && (bi(s, n, r), En(s, n, r, this[Y]));
        }
        cloneNode() {
          let {ownerDocument: e, name: r, [Y]: n} = this;
          return new t(e, r, n);
        }
        toString() {
          let {name: e, [Y]: r} = this;
          if (Vg.has(e) && !r) return Tt(this) ? e : `${e}=""`;
          let n = Tt(this) ? r.replace(pT, "&quot;") : hs(r);
          return `${e}="${n}"`;
        }
        toJSON() {
          let e = [];
          return tf(this, e), e;
        }
      });
  });
var $a,
  Fa,
  wr,
  jt,
  xi = b(() => {
    fe();
    ee();
    Ve();
    ($a = ({ownerDocument: t, parentNode: e}) => {
      for (; e; ) {
        if (e === t) return !0;
        e = e.parentNode || e.host;
      }
      return !1;
    }),
      (Fa = ({parentNode: t}) => {
        if (t)
          switch (t.nodeType) {
            case 9:
            case 11:
              return null;
          }
        return t;
      }),
      (wr = ({[ie]: t}) => {
        switch (t ? t.nodeType : 0) {
          case -1:
            return t[Oe];
          case 3:
          case 8:
          case 4:
            return t;
        }
        return null;
      }),
      (jt = (t) => {
        let e = $e(t)[I];
        return e && (e.nodeType === -1 ? null : e);
      });
  });
var gs,
  Ha,
  ja = b(() => {
    fe();
    xi();
    (gs = (t) => {
      let e = jt(t);
      for (; e && e.nodeType !== 1; ) e = jt(e);
      return e;
    }),
      (Ha = (t) => {
        let e = wr(t);
        for (; e && e.nodeType !== 1; ) e = wr(e);
        return e;
      });
  });
var af,
  za,
  qa,
  vi,
  Ua,
  uf = b(() => {
    fe();
    ee();
    Ve();
    An();
    vr();
    (af = (t, e) => {
      let r = t.createDocumentFragment();
      return r.append(...e), r;
    }),
      (za = (t, e) => {
        let {ownerDocument: r, parentNode: n} = t;
        n && n.insertBefore(af(r, e), t);
      }),
      (qa = (t, e) => {
        let {ownerDocument: r, parentNode: n} = t;
        n && n.insertBefore(af(r, e), $e(t)[I]);
      }),
      (vi = (t, e) => {
        let {ownerDocument: r, parentNode: n} = t;
        n &&
          (e.includes(t) && vi(t, [(t = t.cloneNode())]),
          n.insertBefore(af(r, e), t),
          t.remove());
      }),
      (Ua = (t, e, r) => {
        let {parentNode: n, nodeType: s} = e;
        (t || r) && (La(t, r), (e[ie] = null), ($e(e)[I] = null)),
          n && ((e.parentNode = null), Wr(e, n), s === 1 && Fg(e));
      });
  });
var zt,
  wi = b(() => {
    ee();
    Ve();
    xi();
    fs();
    ja();
    uf();
    ps();
    An();
    zt = class extends it {
      constructor(e, r, n, s) {
        super(e, r, n), (this[Y] = $t(s));
      }
      get isConnected() {
        return $a(this);
      }
      get parentElement() {
        return Fa(this);
      }
      get previousSibling() {
        return wr(this);
      }
      get nextSibling() {
        return jt(this);
      }
      get previousElementSibling() {
        return Ha(this);
      }
      get nextElementSibling() {
        return gs(this);
      }
      before(...e) {
        za(this, e);
      }
      after(...e) {
        qa(this, e);
      }
      replaceWith(...e) {
        vi(this, e);
      }
      remove() {
        Ua(this[ie], this, this[I]);
      }
      get data() {
        return this[Y];
      }
      set data(e) {
        (this[Y] = $t(e)), Wr(this, this.parentNode);
      }
      get nodeValue() {
        return this.data;
      }
      set nodeValue(e) {
        this.data = e;
      }
      get textContent() {
        return this.data;
      }
      set textContent(e) {
        this.data = e;
      }
      get length() {
        return this.data.length;
      }
      substringData(e, r) {
        return this.data.substr(e, r);
      }
      appendData(e) {
        this.data += e;
      }
      insertData(e, r) {
        let {data: n} = this;
        this.data = n.slice(0, e) + r + n.slice(e);
      }
      deleteData(e, r) {
        let {data: n} = this;
        this.data = n.slice(0, e) + n.slice(e + r);
      }
      replaceData(e, r, n) {
        let {data: s} = this;
        this.data = s.slice(0, e) + n + s.slice(e + r);
      }
      toJSON() {
        let e = [];
        return rf(this, e), e;
      }
    };
  });
var Xr,
  Ba = b(() => {
    fe();
    ee();
    wi();
    Xr = class t extends zt {
      constructor(e, r = "") {
        super(e, "#cdatasection", 4, r);
      }
      cloneNode() {
        let {ownerDocument: e, [Y]: r} = this;
        return new t(e, r);
      }
      toString() {
        return `<![CDATA[${this[Y]}]]>`;
      }
    };
  });
var Jr,
  Va = b(() => {
    fe();
    ee();
    wi();
    Jr = class t extends zt {
      constructor(e, r = "") {
        super(e, "#comment", 8, r);
      }
      cloneNode() {
        let {ownerDocument: e, [Y]: r} = this;
        return new t(e, r);
      }
      toString() {
        return `<!--${this[Y]}-->`;
      }
    };
  });
var Cn = de((SP, Wg) => {
  Wg.exports = {
    trueFunc: function () {
      return !0;
    },
    falseFunc: function () {
      return !1;
    },
  };
});
var j,
  we,
  cf = b(() => {
    (function (t) {
      (t.Attribute = "attribute"),
        (t.Pseudo = "pseudo"),
        (t.PseudoElement = "pseudo-element"),
        (t.Tag = "tag"),
        (t.Universal = "universal"),
        (t.Adjacent = "adjacent"),
        (t.Child = "child"),
        (t.Descendant = "descendant"),
        (t.Parent = "parent"),
        (t.Sibling = "sibling"),
        (t.ColumnCombinator = "column-combinator");
    })(j || (j = {}));
    (function (t) {
      (t.Any = "any"),
        (t.Element = "element"),
        (t.End = "end"),
        (t.Equals = "equals"),
        (t.Exists = "exists"),
        (t.Hyphen = "hyphen"),
        (t.Not = "not"),
        (t.Start = "start");
    })(we || (we = {}));
  });
function Xg(t) {
  switch (t.type) {
    case j.Adjacent:
    case j.Child:
    case j.Descendant:
    case j.Parent:
    case j.Sibling:
    case j.ColumnCombinator:
      return !0;
    default:
      return !1;
  }
}
function yT(t, e, r) {
  let n = parseInt(e, 16) - 65536;
  return n !== n || r
    ? e
    : n < 0
    ? String.fromCharCode(n + 65536)
    : String.fromCharCode((n >> 10) | 55296, (n & 1023) | 56320);
}
function Si(t) {
  return t.replace(hT, yT);
}
function lf(t) {
  return t === 39 || t === 34;
}
function Yg(t) {
  return t === 32 || t === 9 || t === 10 || t === 12 || t === 13;
}
function Ei(t) {
  let e = [],
    r = Jg(e, `${t}`, 0);
  if (r < t.length) throw new Error(`Unmatched selector: ${t.slice(r)}`);
  return e;
}
function Jg(t, e, r) {
  let n = [];
  function s(f) {
    let h = e.slice(r + f).match(Gg);
    if (!h) throw new Error(`Expected name, found ${e.slice(r)}`);
    let [p] = h;
    return (r += f + p.length), Si(p);
  }
  function i(f) {
    for (r += f; r < e.length && Yg(e.charCodeAt(r)); ) r++;
  }
  function o() {
    r += 1;
    let f = r,
      h = 1;
    for (; h > 0 && r < e.length; r++)
      e.charCodeAt(r) === 40 && !a(r)
        ? h++
        : e.charCodeAt(r) === 41 && !a(r) && h--;
    if (h) throw new Error("Parenthesis not matched");
    return Si(e.slice(f, r - 1));
  }
  function a(f) {
    let h = 0;
    for (; e.charCodeAt(--f) === 92; ) h++;
    return (h & 1) === 1;
  }
  function u() {
    if (n.length > 0 && Xg(n[n.length - 1]))
      throw new Error("Did not expect successive traversals.");
  }
  function c(f) {
    if (n.length > 0 && n[n.length - 1].type === j.Descendant) {
      n[n.length - 1].type = f;
      return;
    }
    u(), n.push({type: f});
  }
  function l(f, h) {
    n.push({
      type: j.Attribute,
      name: f,
      action: h,
      value: s(1),
      namespace: null,
      ignoreCase: "quirks",
    });
  }
  function d() {
    if (
      (n.length && n[n.length - 1].type === j.Descendant && n.pop(),
      n.length === 0)
    )
      throw new Error("Empty sub-selector");
    t.push(n);
  }
  if ((i(0), e.length === r)) return r;
  e: for (; r < e.length; ) {
    let f = e.charCodeAt(r);
    switch (f) {
      case 32:
      case 9:
      case 10:
      case 12:
      case 13: {
        (n.length === 0 || n[0].type !== j.Descendant) &&
          (u(), n.push({type: j.Descendant})),
          i(1);
        break;
      }
      case 62: {
        c(j.Child), i(1);
        break;
      }
      case 60: {
        c(j.Parent), i(1);
        break;
      }
      case 126: {
        c(j.Sibling), i(1);
        break;
      }
      case 43: {
        c(j.Adjacent), i(1);
        break;
      }
      case 46: {
        l("class", we.Element);
        break;
      }
      case 35: {
        l("id", we.Equals);
        break;
      }
      case 91: {
        i(1);
        let h,
          p = null;
        e.charCodeAt(r) === 124
          ? (h = s(1))
          : e.startsWith("*|", r)
          ? ((p = "*"), (h = s(2)))
          : ((h = s(0)),
            e.charCodeAt(r) === 124 &&
              e.charCodeAt(r + 1) !== 61 &&
              ((p = h), (h = s(1)))),
          i(0);
        let m = we.Exists,
          g = mT.get(e.charCodeAt(r));
        if (g) {
          if (((m = g), e.charCodeAt(r + 1) !== 61))
            throw new Error("Expected `=`");
          i(2);
        } else e.charCodeAt(r) === 61 && ((m = we.Equals), i(1));
        let x = "",
          y = null;
        if (m !== "exists") {
          if (lf(e.charCodeAt(r))) {
            let O = e.charCodeAt(r),
              C = r + 1;
            for (; C < e.length && (e.charCodeAt(C) !== O || a(C)); ) C += 1;
            if (e.charCodeAt(C) !== O)
              throw new Error("Attribute value didn't end");
            (x = Si(e.slice(r + 1, C))), (r = C + 1);
          } else {
            let O = r;
            for (
              ;
              r < e.length &&
              ((!Yg(e.charCodeAt(r)) && e.charCodeAt(r) !== 93) || a(r));

            )
              r += 1;
            x = Si(e.slice(O, r));
          }
          i(0);
          let T = e.charCodeAt(r) | 32;
          T === 115 ? ((y = !1), i(1)) : T === 105 && ((y = !0), i(1));
        }
        if (e.charCodeAt(r) !== 93)
          throw new Error("Attribute selector didn't terminate");
        r += 1;
        let A = {
          type: j.Attribute,
          name: h,
          action: m,
          value: x,
          namespace: p,
          ignoreCase: y,
        };
        n.push(A);
        break;
      }
      case 58: {
        if (e.charCodeAt(r + 1) === 58) {
          n.push({
            type: j.PseudoElement,
            name: s(2).toLowerCase(),
            data: e.charCodeAt(r) === 40 ? o() : null,
          });
          continue;
        }
        let h = s(1).toLowerCase(),
          p = null;
        if (e.charCodeAt(r) === 40)
          if (gT.has(h)) {
            if (lf(e.charCodeAt(r + 1)))
              throw new Error(`Pseudo-selector ${h} cannot be quoted`);
            if (((p = []), (r = Jg(p, e, r + 1)), e.charCodeAt(r) !== 41))
              throw new Error(`Missing closing parenthesis in :${h} (${e})`);
            r += 1;
          } else {
            if (((p = o()), bT.has(h))) {
              let m = p.charCodeAt(0);
              m === p.charCodeAt(p.length - 1) && lf(m) && (p = p.slice(1, -1));
            }
            p = Si(p);
          }
        n.push({type: j.Pseudo, name: h, data: p});
        break;
      }
      case 44: {
        d(), (n = []), i(1);
        break;
      }
      default: {
        if (e.startsWith("/*", r)) {
          let m = e.indexOf("*/", r + 2);
          if (m < 0) throw new Error("Comment was not terminated");
          (r = m + 2), n.length === 0 && i(0);
          break;
        }
        let h = null,
          p;
        if (f === 42) (r += 1), (p = "*");
        else if (f === 124) {
          if (((p = ""), e.charCodeAt(r + 1) === 124)) {
            c(j.ColumnCombinator), i(2);
            break;
          }
        } else if (Gg.test(e.slice(r))) p = s(0);
        else break e;
        e.charCodeAt(r) === 124 &&
          e.charCodeAt(r + 1) !== 124 &&
          ((h = p),
          e.charCodeAt(r + 1) === 42 ? ((p = "*"), (r += 2)) : (p = s(1))),
          n.push(
            p === "*"
              ? {type: j.Universal, namespace: h}
              : {type: j.Tag, name: p, namespace: h}
          );
      }
    }
  }
  return d(), r;
}
var Gg,
  hT,
  mT,
  gT,
  bT,
  Zg = b(() => {
    cf();
    (Gg = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/),
      (hT = /\\([\da-f]{1,6}\s?|(\s)|.)/gi),
      (mT = new Map([
        [126, we.Element],
        [94, we.Start],
        [36, we.End],
        [42, we.Any],
        [33, we.Not],
        [124, we.Hyphen],
      ])),
      (gT = new Set([
        "has",
        "not",
        "matches",
        "is",
        "where",
        "host",
        "host-context",
      ]));
    bT = new Set(["contains", "icontains"]);
  });
var Ti = b(() => {
  cf();
  Zg();
});
function Ai(t) {
  return !Qg.has(t.type);
}
function df(t) {
  let e = t.map(eb);
  for (let r = 1; r < t.length; r++) {
    let n = e[r];
    if (!(n < 0))
      for (let s = r - 1; s >= 0 && n < e[s]; s--) {
        let i = t[s + 1];
        (t[s + 1] = t[s]), (t[s] = i), (e[s + 1] = e[s]), (e[s] = n);
      }
  }
}
function eb(t) {
  var e, r;
  let n = (e = Qg.get(t.type)) !== null && e !== void 0 ? e : -1;
  return (
    t.type === j.Attribute
      ? ((n = (r = xT.get(t.action)) !== null && r !== void 0 ? r : 4),
        t.action === we.Equals && t.name === "id" && (n = 9),
        t.ignoreCase && (n >>= 1))
      : t.type === j.Pseudo &&
        (t.data
          ? t.name === "has" || t.name === "contains"
            ? (n = 0)
            : Array.isArray(t.data)
            ? ((n = Math.min(...t.data.map((s) => Math.min(...s.map(eb))))),
              n < 0 && (n = 0))
            : (n = 2)
          : (n = 3)),
    n
  );
}
var Qg,
  xT,
  ff = b(() => {
    Ti();
    Qg = new Map([
      [j.Universal, 50],
      [j.Tag, 30],
      [j.Attribute, 1],
      [j.Pseudo, 0],
    ]);
    xT = new Map([
      [we.Exists, 10],
      [we.Equals, 8],
      [we.Not, 7],
      [we.Start, 6],
      [we.End, 6],
      [we.Any, 5],
    ]);
  });
function tb(t) {
  return t.replace(vT, "\\$&");
}
function Rn(t, e) {
  return typeof t.ignoreCase == "boolean"
    ? t.ignoreCase
    : t.ignoreCase === "quirks"
    ? !!e.quirksMode
    : !e.xmlMode && wT.has(t.name);
}
var Ci,
  vT,
  wT,
  rb,
  nb = b(() => {
    (Ci = Ot(Cn(), 1)), (vT = /[-[\]{}()*+?.,\\^$|#\s]/g);
    wT = new Set([
      "accept",
      "accept-charset",
      "align",
      "alink",
      "axis",
      "bgcolor",
      "charset",
      "checked",
      "clear",
      "codetype",
      "color",
      "compact",
      "declare",
      "defer",
      "dir",
      "direction",
      "disabled",
      "enctype",
      "face",
      "frame",
      "hreflang",
      "http-equiv",
      "lang",
      "language",
      "link",
      "media",
      "method",
      "multiple",
      "nohref",
      "noresize",
      "noshade",
      "nowrap",
      "readonly",
      "rel",
      "rev",
      "rules",
      "scope",
      "scrolling",
      "selected",
      "shape",
      "target",
      "text",
      "type",
      "valign",
      "valuetype",
      "vlink",
    ]);
    rb = {
      equals(t, e, r) {
        let {adapter: n} = r,
          {name: s} = e,
          {value: i} = e;
        return Rn(e, r)
          ? ((i = i.toLowerCase()),
            (o) => {
              let a = n.getAttributeValue(o, s);
              return (
                a != null &&
                a.length === i.length &&
                a.toLowerCase() === i &&
                t(o)
              );
            })
          : (o) => n.getAttributeValue(o, s) === i && t(o);
      },
      hyphen(t, e, r) {
        let {adapter: n} = r,
          {name: s} = e,
          {value: i} = e,
          o = i.length;
        return Rn(e, r)
          ? ((i = i.toLowerCase()),
            function (u) {
              let c = n.getAttributeValue(u, s);
              return (
                c != null &&
                (c.length === o || c.charAt(o) === "-") &&
                c.substr(0, o).toLowerCase() === i &&
                t(u)
              );
            })
          : function (u) {
              let c = n.getAttributeValue(u, s);
              return (
                c != null &&
                (c.length === o || c.charAt(o) === "-") &&
                c.substr(0, o) === i &&
                t(u)
              );
            };
      },
      element(t, e, r) {
        let {adapter: n} = r,
          {name: s, value: i} = e;
        if (/\s/.test(i)) return Ci.default.falseFunc;
        let o = new RegExp(`(?:^|\\s)${tb(i)}(?:$|\\s)`, Rn(e, r) ? "i" : "");
        return function (u) {
          let c = n.getAttributeValue(u, s);
          return c != null && c.length >= i.length && o.test(c) && t(u);
        };
      },
      exists(t, {name: e}, {adapter: r}) {
        return (n) => r.hasAttrib(n, e) && t(n);
      },
      start(t, e, r) {
        let {adapter: n} = r,
          {name: s} = e,
          {value: i} = e,
          o = i.length;
        return o === 0
          ? Ci.default.falseFunc
          : Rn(e, r)
          ? ((i = i.toLowerCase()),
            (a) => {
              let u = n.getAttributeValue(a, s);
              return (
                u != null &&
                u.length >= o &&
                u.substr(0, o).toLowerCase() === i &&
                t(a)
              );
            })
          : (a) => {
              var u;
              return (
                !!(
                  !((u = n.getAttributeValue(a, s)) === null || u === void 0) &&
                  u.startsWith(i)
                ) && t(a)
              );
            };
      },
      end(t, e, r) {
        let {adapter: n} = r,
          {name: s} = e,
          {value: i} = e,
          o = -i.length;
        return o === 0
          ? Ci.default.falseFunc
          : Rn(e, r)
          ? ((i = i.toLowerCase()),
            (a) => {
              var u;
              return (
                ((u = n.getAttributeValue(a, s)) === null || u === void 0
                  ? void 0
                  : u.substr(o).toLowerCase()) === i && t(a)
              );
            })
          : (a) => {
              var u;
              return (
                !!(
                  !((u = n.getAttributeValue(a, s)) === null || u === void 0) &&
                  u.endsWith(i)
                ) && t(a)
              );
            };
      },
      any(t, e, r) {
        let {adapter: n} = r,
          {name: s, value: i} = e;
        if (i === "") return Ci.default.falseFunc;
        if (Rn(e, r)) {
          let o = new RegExp(tb(i), "i");
          return function (u) {
            let c = n.getAttributeValue(u, s);
            return c != null && c.length >= i.length && o.test(c) && t(u);
          };
        }
        return (o) => {
          var a;
          return (
            !!(
              !((a = n.getAttributeValue(o, s)) === null || a === void 0) &&
              a.includes(i)
            ) && t(o)
          );
        };
      },
      not(t, e, r) {
        let {adapter: n} = r,
          {name: s} = e,
          {value: i} = e;
        return i === ""
          ? (o) => !!n.getAttributeValue(o, s) && t(o)
          : Rn(e, r)
          ? ((i = i.toLowerCase()),
            (o) => {
              let a = n.getAttributeValue(o, s);
              return (
                (a == null || a.length !== i.length || a.toLowerCase() !== i) &&
                t(o)
              );
            })
          : (o) => n.getAttributeValue(o, s) !== i && t(o);
      },
    };
  });
function ib(t) {
  if (((t = t.trim().toLowerCase()), t === "even")) return [2, 0];
  if (t === "odd") return [2, 1];
  let e = 0,
    r = 0,
    n = i(),
    s = o();
  if (
    (e < t.length &&
      t.charAt(e) === "n" &&
      (e++,
      (r = n * (s ?? 1)),
      a(),
      e < t.length ? ((n = i()), a(), (s = o())) : (n = s = 0)),
    s === null || e < t.length)
  )
    throw new Error(`n-th rule couldn't be parsed ('${t}')`);
  return [r, n * s];
  function i() {
    return t.charAt(e) === "-" ? (e++, -1) : (t.charAt(e) === "+" && e++, 1);
  }
  function o() {
    let u = e,
      c = 0;
    for (; e < t.length && t.charCodeAt(e) >= sb && t.charCodeAt(e) <= ET; )
      (c = c * 10 + (t.charCodeAt(e) - sb)), e++;
    return e === u ? null : c;
  }
  function a() {
    for (; e < t.length && ST.has(t.charCodeAt(e)); ) e++;
  }
}
var ST,
  sb,
  ET,
  ob = b(() => {
    (ST = new Set([9, 10, 12, 13, 32])), (sb = 48), (ET = 57);
  });
function ab(t) {
  let e = t[0],
    r = t[1] - 1;
  if (r < 0 && e <= 0) return pf.default.falseFunc;
  if (e === -1) return (i) => i <= r;
  if (e === 0) return (i) => i === r;
  if (e === 1) return r < 0 ? pf.default.trueFunc : (i) => i >= r;
  let n = Math.abs(e),
    s = ((r % n) + n) % n;
  return e > 1 ? (i) => i >= r && i % n === s : (i) => i <= r && i % n === s;
}
var pf,
  ub = b(() => {
    pf = Ot(Cn(), 1);
  });
function bs(t) {
  return ab(ib(t));
}
var cb = b(() => {
  ob();
  ub();
});
function Ka(t, e) {
  return (r) => {
    let n = e.getParent(r);
    return n != null && e.isTag(n) && t(r);
  };
}
function hf(t) {
  return function (r, n, {adapter: s}) {
    let i = s[t];
    return typeof i != "function"
      ? ot.default.falseFunc
      : function (a) {
          return i(a) && r(a);
        };
  };
}
var ot,
  Ri,
  lb = b(() => {
    cb();
    ot = Ot(Cn(), 1);
    Ri = {
      contains(t, e, {adapter: r}) {
        return function (s) {
          return t(s) && r.getText(s).includes(e);
        };
      },
      icontains(t, e, {adapter: r}) {
        let n = e.toLowerCase();
        return function (i) {
          return t(i) && r.getText(i).toLowerCase().includes(n);
        };
      },
      "nth-child"(t, e, {adapter: r, equals: n}) {
        let s = bs(e);
        return s === ot.default.falseFunc
          ? ot.default.falseFunc
          : s === ot.default.trueFunc
          ? Ka(t, r)
          : function (o) {
              let a = r.getSiblings(o),
                u = 0;
              for (let c = 0; c < a.length && !n(o, a[c]); c++)
                r.isTag(a[c]) && u++;
              return s(u) && t(o);
            };
      },
      "nth-last-child"(t, e, {adapter: r, equals: n}) {
        let s = bs(e);
        return s === ot.default.falseFunc
          ? ot.default.falseFunc
          : s === ot.default.trueFunc
          ? Ka(t, r)
          : function (o) {
              let a = r.getSiblings(o),
                u = 0;
              for (let c = a.length - 1; c >= 0 && !n(o, a[c]); c--)
                r.isTag(a[c]) && u++;
              return s(u) && t(o);
            };
      },
      "nth-of-type"(t, e, {adapter: r, equals: n}) {
        let s = bs(e);
        return s === ot.default.falseFunc
          ? ot.default.falseFunc
          : s === ot.default.trueFunc
          ? Ka(t, r)
          : function (o) {
              let a = r.getSiblings(o),
                u = 0;
              for (let c = 0; c < a.length; c++) {
                let l = a[c];
                if (n(o, l)) break;
                r.isTag(l) && r.getName(l) === r.getName(o) && u++;
              }
              return s(u) && t(o);
            };
      },
      "nth-last-of-type"(t, e, {adapter: r, equals: n}) {
        let s = bs(e);
        return s === ot.default.falseFunc
          ? ot.default.falseFunc
          : s === ot.default.trueFunc
          ? Ka(t, r)
          : function (o) {
              let a = r.getSiblings(o),
                u = 0;
              for (let c = a.length - 1; c >= 0; c--) {
                let l = a[c];
                if (n(o, l)) break;
                r.isTag(l) && r.getName(l) === r.getName(o) && u++;
              }
              return s(u) && t(o);
            };
      },
      root(t, e, {adapter: r}) {
        return (n) => {
          let s = r.getParent(n);
          return (s == null || !r.isTag(s)) && t(n);
        };
      },
      scope(t, e, r, n) {
        let {equals: s} = r;
        return !n || n.length === 0
          ? Ri.root(t, e, r)
          : n.length === 1
          ? (i) => s(n[0], i) && t(i)
          : (i) => n.includes(i) && t(i);
      },
      hover: hf("isHovered"),
      visited: hf("isVisited"),
      active: hf("isActive"),
    };
  });
function mf(t, e, r, n) {
  if (r === null) {
    if (t.length > n)
      throw new Error(`Pseudo-class :${e} requires an argument`);
  } else if (t.length === n)
    throw new Error(`Pseudo-class :${e} doesn't have any arguments`);
}
var Wa,
  db = b(() => {
    Wa = {
      empty(t, {adapter: e}) {
        return !e.getChildren(t).some((r) => e.isTag(r) || e.getText(r) !== "");
      },
      "first-child"(t, {adapter: e, equals: r}) {
        if (e.prevElementSibling) return e.prevElementSibling(t) == null;
        let n = e.getSiblings(t).find((s) => e.isTag(s));
        return n != null && r(t, n);
      },
      "last-child"(t, {adapter: e, equals: r}) {
        let n = e.getSiblings(t);
        for (let s = n.length - 1; s >= 0; s--) {
          if (r(t, n[s])) return !0;
          if (e.isTag(n[s])) break;
        }
        return !1;
      },
      "first-of-type"(t, {adapter: e, equals: r}) {
        let n = e.getSiblings(t),
          s = e.getName(t);
        for (let i = 0; i < n.length; i++) {
          let o = n[i];
          if (r(t, o)) return !0;
          if (e.isTag(o) && e.getName(o) === s) break;
        }
        return !1;
      },
      "last-of-type"(t, {adapter: e, equals: r}) {
        let n = e.getSiblings(t),
          s = e.getName(t);
        for (let i = n.length - 1; i >= 0; i--) {
          let o = n[i];
          if (r(t, o)) return !0;
          if (e.isTag(o) && e.getName(o) === s) break;
        }
        return !1;
      },
      "only-of-type"(t, {adapter: e, equals: r}) {
        let n = e.getName(t);
        return e
          .getSiblings(t)
          .every((s) => r(t, s) || !e.isTag(s) || e.getName(s) !== n);
      },
      "only-child"(t, {adapter: e, equals: r}) {
        return e.getSiblings(t).every((n) => r(t, n) || !e.isTag(n));
      },
    };
  });
var gf,
  fb = b(() => {
    gf = {
      "any-link": ":is(a, area, link)[href]",
      link: ":any-link:not(:visited)",
      disabled: `:is(
        :is(button, input, select, textarea, optgroup, option)[disabled],
        optgroup[disabled] > option,
        fieldset[disabled]:not(fieldset[disabled] legend:first-of-type *)
    )`,
      enabled: ":not(:disabled)",
      checked:
        ":is(:is(input[type=radio], input[type=checkbox])[checked], option:selected)",
      required: ":is(input, select, textarea)[required]",
      optional: ":is(input, select, textarea):not([required])",
      selected:
        "option:is([selected], select:not([multiple]):not(:has(> option[selected])) > :first-of-type)",
      checkbox: "[type=checkbox]",
      file: "[type=file]",
      password: "[type=password]",
      radio: "[type=radio]",
      reset: "[type=reset]",
      image: "[type=image]",
      submit: "[type=submit]",
      parent: ":not(:empty)",
      header: ":is(h1, h2, h3, h4, h5, h6)",
      button: ":is(button, input[type=button])",
      input: ":is(input, textarea, select, button)",
      text: "input:is(:not([type!='']), [type=text])",
    };
  });
function vf(t, e) {
  return t === Rt.default.falseFunc
    ? Rt.default.falseFunc
    : (r) => e.isTag(r) && t(r);
}
function wf(t, e) {
  let r = e.getSiblings(t);
  if (r.length <= 1) return [];
  let n = r.indexOf(t);
  return n < 0 || n === r.length - 1 ? [] : r.slice(n + 1).filter(e.isTag);
}
function yf(t) {
  return {
    xmlMode: !!t.xmlMode,
    lowerCaseAttributeNames: !!t.lowerCaseAttributeNames,
    lowerCaseTags: !!t.lowerCaseTags,
    quirksMode: !!t.quirksMode,
    cacheResults: !!t.cacheResults,
    pseudos: t.pseudos,
    adapter: t.adapter,
    equals: t.equals,
  };
}
var Rt,
  xf,
  bf,
  Ga,
  Ya = b(() => {
    Rt = Ot(Cn(), 1);
    ff();
    xf = {};
    (bf = (t, e, r, n, s) => {
      let i = s(e, yf(r), n);
      return i === Rt.default.trueFunc
        ? t
        : i === Rt.default.falseFunc
        ? Rt.default.falseFunc
        : (o) => i(o) && t(o);
    }),
      (Ga = {
        is: bf,
        matches: bf,
        where: bf,
        not(t, e, r, n, s) {
          let i = s(e, yf(r), n);
          return i === Rt.default.falseFunc
            ? t
            : i === Rt.default.trueFunc
            ? Rt.default.falseFunc
            : (o) => !i(o) && t(o);
        },
        has(t, e, r, n, s) {
          let {adapter: i} = r,
            o = yf(r);
          o.relativeSelector = !0;
          let a = e.some((l) => l.some(Ai)) ? [xf] : void 0,
            u = s(e, o, a);
          if (u === Rt.default.falseFunc) return Rt.default.falseFunc;
          let c = vf(u, i);
          if (a && u !== Rt.default.trueFunc) {
            let {shouldTestNextSiblings: l = !1} = u;
            return (d) => {
              if (!t(d)) return !1;
              a[0] = d;
              let f = i.getChildren(d),
                h = l ? [...f, ...wf(d, i)] : f;
              return i.existsOne(c, h);
            };
          }
          return (l) => t(l) && i.existsOne(c, i.getChildren(l));
        },
      });
  });
function pb(t, e, r, n, s) {
  var i;
  let {name: o, data: a} = e;
  if (Array.isArray(a)) {
    if (!(o in Ga)) throw new Error(`Unknown pseudo-class :${o}(${a})`);
    return Ga[o](t, a, r, n, s);
  }
  let u = (i = r.pseudos) === null || i === void 0 ? void 0 : i[o],
    c = typeof u == "string" ? u : gf[o];
  if (typeof c == "string") {
    if (a != null) throw new Error(`Pseudo ${o} doesn't have any arguments`);
    let l = Ei(c);
    return Ga.is(t, l, r, n, s);
  }
  if (typeof u == "function") return mf(u, o, a, 1), (l) => u(l, a) && t(l);
  if (o in Ri) return Ri[o](t, a, r, n);
  if (o in Wa) {
    let l = Wa[o];
    return mf(l, o, a, 2), (d) => l(d, r, a) && t(d);
  }
  throw new Error(`Unknown pseudo-class :${o}`);
}
var Sf = b(() => {
  Ti();
  lb();
  db();
  fb();
  Ya();
});
function Ef(t, e) {
  let r = e.getParent(t);
  return r && e.isTag(r) ? r : null;
}
function hb(t, e, r, n, s) {
  let {adapter: i, equals: o} = r;
  switch (e.type) {
    case j.PseudoElement:
      throw new Error("Pseudo-elements are not supported by css-select");
    case j.ColumnCombinator:
      throw new Error("Column combinators are not yet supported by css-select");
    case j.Attribute: {
      if (e.namespace != null)
        throw new Error(
          "Namespaced attributes are not yet supported by css-select"
        );
      return (
        (!r.xmlMode || r.lowerCaseAttributeNames) &&
          (e.name = e.name.toLowerCase()),
        rb[e.action](t, e, r)
      );
    }
    case j.Pseudo:
      return pb(t, e, r, n, s);
    case j.Tag: {
      if (e.namespace != null)
        throw new Error(
          "Namespaced tag names are not yet supported by css-select"
        );
      let {name: a} = e;
      return (
        (!r.xmlMode || r.lowerCaseTags) && (a = a.toLowerCase()),
        function (c) {
          return i.getName(c) === a && t(c);
        }
      );
    }
    case j.Descendant: {
      if (r.cacheResults === !1 || typeof WeakSet > "u")
        return function (c) {
          let l = c;
          for (; (l = Ef(l, i)); ) if (t(l)) return !0;
          return !1;
        };
      let a = new WeakSet();
      return function (c) {
        let l = c;
        for (; (l = Ef(l, i)); )
          if (!a.has(l)) {
            if (i.isTag(l) && t(l)) return !0;
            a.add(l);
          }
        return !1;
      };
    }
    case "_flexibleDescendant":
      return function (u) {
        let c = u;
        do if (t(c)) return !0;
        while ((c = Ef(c, i)));
        return !1;
      };
    case j.Parent:
      return function (u) {
        return i.getChildren(u).some((c) => i.isTag(c) && t(c));
      };
    case j.Child:
      return function (u) {
        let c = i.getParent(u);
        return c != null && i.isTag(c) && t(c);
      };
    case j.Sibling:
      return function (u) {
        let c = i.getSiblings(u);
        for (let l = 0; l < c.length; l++) {
          let d = c[l];
          if (o(u, d)) break;
          if (i.isTag(d) && t(d)) return !0;
        }
        return !1;
      };
    case j.Adjacent:
      return i.prevElementSibling
        ? function (u) {
            let c = i.prevElementSibling(u);
            return c != null && t(c);
          }
        : function (u) {
            let c = i.getSiblings(u),
              l;
            for (let d = 0; d < c.length; d++) {
              let f = c[d];
              if (o(u, f)) break;
              i.isTag(f) && (l = f);
            }
            return !!l && t(l);
          };
    case j.Universal: {
      if (e.namespace != null && e.namespace !== "*")
        throw new Error(
          "Namespaced universal selectors are not yet supported by css-select"
        );
      return t;
    }
  }
}
var mb = b(() => {
  nb();
  Sf();
  Ti();
});
function Tf(t, e, r) {
  let n = Xa(t, e, r);
  return vf(n, e.adapter);
}
function Xa(t, e, r) {
  let n = typeof t == "string" ? Ei(t) : t;
  return Ja(n, e, r);
}
function gb(t) {
  return (
    t.type === j.Pseudo &&
    (t.name === "scope" ||
      (Array.isArray(t.data) && t.data.some((e) => e.some(gb))))
  );
}
function RT(t, {adapter: e}, r) {
  let n = !!r?.every((s) => {
    let i = e.isTag(s) && e.getParent(s);
    return s === xf || (i && e.isTag(i));
  });
  for (let s of t) {
    if (!(s.length > 0 && Ai(s[0]) && s[0].type !== j.Descendant))
      if (n && !s.some(gb)) s.unshift(TT);
      else continue;
    s.unshift(CT);
  }
}
function Ja(t, e, r) {
  var n;
  t.forEach(df), (r = (n = e.context) !== null && n !== void 0 ? n : r);
  let s = Array.isArray(r),
    i = r && (Array.isArray(r) ? r : [r]);
  if (e.relativeSelector !== !1) RT(t, e, i);
  else if (t.some((u) => u.length > 0 && Ai(u[0])))
    throw new Error(
      "Relative selectors are not allowed when the `relativeSelector` option is disabled"
    );
  let o = !1,
    a = t
      .map((u) => {
        if (u.length >= 2) {
          let [c, l] = u;
          c.type !== j.Pseudo ||
            c.name !== "scope" ||
            (s && l.type === j.Descendant
              ? (u[1] = AT)
              : (l.type === j.Adjacent || l.type === j.Sibling) && (o = !0));
        }
        return NT(u, e, i);
      })
      .reduce(LT, Sr.default.falseFunc);
  return (a.shouldTestNextSiblings = o), a;
}
function NT(t, e, r) {
  var n;
  return t.reduce(
    (s, i) =>
      s === Sr.default.falseFunc ? Sr.default.falseFunc : hb(s, i, e, r, Ja),
    (n = e.rootFunc) !== null && n !== void 0 ? n : Sr.default.trueFunc
  );
}
function LT(t, e) {
  return e === Sr.default.falseFunc || t === Sr.default.trueFunc
    ? t
    : t === Sr.default.falseFunc || e === Sr.default.trueFunc
    ? e
    : function (n) {
        return t(n) || e(n);
      };
}
var Sr,
  TT,
  AT,
  CT,
  bb = b(() => {
    Ti();
    Sr = Ot(Cn(), 1);
    ff();
    mb();
    Ya();
    (TT = {type: j.Descendant}),
      (AT = {type: "_flexibleDescendant"}),
      (CT = {type: j.Pseudo, name: "scope", data: null});
  });
function Cf(t) {
  var e, r, n, s;
  let i = t ?? PT;
  return (
    ((e = i.adapter) !== null && e !== void 0) || (i.adapter = ls),
    ((r = i.equals) !== null && r !== void 0) ||
      (i.equals =
        (s = (n = i.adapter) === null || n === void 0 ? void 0 : n.equals) !==
          null && s !== void 0
          ? s
          : yb),
    i
  );
}
function Rf(t) {
  return function (r, n, s) {
    let i = Cf(n);
    return t(r, i, s);
  };
}
function vb(t) {
  return function (r, n, s) {
    let i = Cf(s);
    typeof r != "function" && (r = Xa(r, i, n));
    let o = IT(n, i.adapter, r.shouldTestNextSiblings);
    return t(r, o, i);
  };
}
function IT(t, e, r = !1) {
  return (
    r && (t = kT(t, e)),
    Array.isArray(t) ? e.removeSubsets(t) : e.getChildren(t)
  );
}
function kT(t, e) {
  let r = Array.isArray(t) ? t.slice(0) : [t],
    n = r.length;
  for (let s = 0; s < n; s++) {
    let i = wf(r[s], e);
    r.push(...i);
  }
  return r;
}
function wb(t, e, r) {
  let n = Cf(r);
  return (typeof e == "function" ? e : Tf(e, n))(t);
}
var Af,
  yb,
  PT,
  xb,
  aI,
  uI,
  cI,
  lI,
  Sb = b(() => {
    pi();
    Af = Ot(Cn(), 1);
    bb();
    Ya();
    Sf();
    (yb = (t, e) => t === e), (PT = {adapter: ls, equals: yb});
    (xb = Rf(Tf)), (aI = Rf(Xa)), (uI = Rf(Ja));
    (cI = vb((t, e, r) =>
      t === Af.default.falseFunc || !e || e.length === 0
        ? []
        : r.adapter.findAll(t, e)
    )),
      (lI = vb((t, e, r) =>
        t === Af.default.falseFunc || !e || e.length === 0
          ? null
          : r.adapter.findOne(t, e)
      ));
  });
var DT,
  Za,
  Eb,
  MT,
  ys,
  _T,
  $T,
  FT,
  Nf,
  HT,
  jT,
  Tb,
  Ab,
  Cb,
  Ni,
  Rb,
  Lf = b(() => {
    Sb();
    fe();
    Ve();
    ({isArray: DT} = Array),
      (Za = ({nodeType: t}) => t === 1),
      (Eb = (t, e) => e.some((r) => Za(r) && (t(r) || Eb(t, ys(r))))),
      (MT = (t, e) => (e === "class" ? t.classList.value : t.getAttribute(e))),
      (ys = ({childNodes: t}) => t),
      (_T = (t) => {
        let {localName: e} = t;
        return Tt(t) ? e.toLowerCase() : e;
      }),
      ($T = ({parentNode: t}) => t),
      (FT = (t) => {
        let {parentNode: e} = t;
        return e ? ys(e) : t;
      }),
      (Nf = (t) =>
        DT(t)
          ? t.map(Nf).join("")
          : Za(t)
          ? Nf(ys(t))
          : t.nodeType === 3
          ? t.data
          : ""),
      (HT = (t, e) => t.hasAttribute(e)),
      (jT = (t) => {
        let {length: e} = t;
        for (; e--; ) {
          let r = t[e];
          if (e && -1 < t.lastIndexOf(r, e - 1)) {
            t.splice(e, 1);
            continue;
          }
          for (let {parentNode: n} = r; n; n = n.parentNode)
            if (t.includes(n)) {
              t.splice(e, 1);
              break;
            }
        }
        return t;
      }),
      (Tb = (t, e) => {
        let r = [];
        for (let n of e) Za(n) && (t(n) && r.push(n), r.push(...Tb(t, ys(n))));
        return r;
      }),
      (Ab = (t, e) => {
        for (let r of e) if (t(r) || (r = Ab(t, ys(r)))) return r;
        return null;
      }),
      (Cb = {
        isTag: Za,
        existsOne: Eb,
        getAttributeValue: MT,
        getChildren: ys,
        getName: _T,
        getParent: $T,
        getSiblings: FT,
        getText: Nf,
        hasAttrib: HT,
        removeSubsets: jT,
        findAll: Tb,
        findOne: Ab,
      }),
      (Ni = (t, e) =>
        xb(e, {
          context: e.includes(":scope") ? t : void 0,
          xmlMode: !Tt(t),
          adapter: Cb,
        })),
      (Rb = (t, e) =>
        wb(t, e, {
          strict: !0,
          context: e.includes(":scope") ? t : void 0,
          xmlMode: !Tt(t),
          adapter: Cb,
        }));
  });
var Nt,
  xs = b(() => {
    fe();
    ee();
    _a();
    wi();
    Nt = class t extends zt {
      constructor(e, r = "") {
        super(e, "#text", 3, r);
      }
      get wholeText() {
        let e = [],
          {previousSibling: r, nextSibling: n} = this;
        for (; r && r.nodeType === 3; ) {
          e.unshift(r[Y]);
          r = r.previousSibling;
        }
        for (e.push(this[Y]); n && n.nodeType === 3; ) {
          e.push(n[Y]);
          n = n.nextSibling;
        }
        return e.join("");
      }
      cloneNode() {
        let {ownerDocument: e, [Y]: r} = this;
        return new t(e, r);
      }
      toString() {
        return hs(this[Y]);
      }
    };
  });
var zT,
  Pf,
  vs,
  If = b(() => {
    fe();
    ee();
    Lf();
    xi();
    Ve();
    ps();
    xs();
    Yr();
    An();
    vr();
    ja();
    (zT = (t) => t instanceof it),
      (Pf = (t, e, r) => {
        let {ownerDocument: n} = t;
        for (let s of r) t.insertBefore(zT(s) ? s : new Nt(n, s), e);
      }),
      (vs = class extends it {
        constructor(e, r, n) {
          super(e, r, n),
            (this[Re] = null),
            (this[I] = this[_] =
              {
                [I]: null,
                [ie]: this,
                [Oe]: this,
                nodeType: -1,
                ownerDocument: this.ownerDocument,
                parentNode: null,
              });
        }
        get childNodes() {
          let e = new ke(),
            {firstChild: r} = this;
          for (; r; ) e.push(r), (r = jt(r));
          return e;
        }
        get children() {
          let e = new ke(),
            {firstElementChild: r} = this;
          for (; r; ) e.push(r), (r = gs(r));
          return e;
        }
        get firstChild() {
          let {[I]: e, [_]: r} = this;
          for (; e.nodeType === 2; ) e = e[I];
          return e === r ? null : e;
        }
        get firstElementChild() {
          let {firstChild: e} = this;
          for (; e; ) {
            if (e.nodeType === 1) return e;
            e = jt(e);
          }
          return null;
        }
        get lastChild() {
          let e = this[_][ie];
          switch (e.nodeType) {
            case -1:
              return e[Oe];
            case 2:
              return null;
          }
          return e === this ? null : e;
        }
        get lastElementChild() {
          let {lastChild: e} = this;
          for (; e; ) {
            if (e.nodeType === 1) return e;
            e = wr(e);
          }
          return null;
        }
        get childElementCount() {
          return this.children.length;
        }
        prepend(...e) {
          Pf(this, this.firstChild, e);
        }
        append(...e) {
          Pf(this, this[_], e);
        }
        replaceChildren(...e) {
          let {[I]: r, [_]: n} = this;
          for (; r !== n && r.nodeType === 2; ) r = r[I];
          for (; r !== n; ) {
            let s = $e(r)[I];
            r.remove(), (r = s);
          }
          e.length && Pf(this, n, e);
        }
        getElementsByClassName(e) {
          let r = new ke(),
            {[I]: n, [_]: s} = this;
          for (; n !== s; )
            n.nodeType === 1 &&
              n.hasAttribute("class") &&
              n.classList.has(e) &&
              r.push(n),
              (n = n[I]);
          return r;
        }
        getElementsByTagName(e) {
          let r = new ke(),
            {[I]: n, [_]: s} = this;
          for (; n !== s; )
            n.nodeType === 1 && (n.localName === e || mi(n) === e) && r.push(n),
              (n = n[I]);
          return r;
        }
        querySelector(e) {
          let r = Ni(this, e),
            {[I]: n, [_]: s} = this;
          for (; n !== s; ) {
            if (n.nodeType === 1 && r(n)) return n;
            n = n.nodeType === 1 && n.localName === "template" ? n[_] : n[I];
          }
          return null;
        }
        querySelectorAll(e) {
          let r = Ni(this, e),
            n = new ke(),
            {[I]: s, [_]: i} = this;
          for (; s !== i; )
            s.nodeType === 1 && r(s) && n.push(s),
              (s =
                s.nodeType === 1 && s.localName === "template" ? s[_] : s[I]);
          return n;
        }
        appendChild(e) {
          return this.insertBefore(e, this[_]);
        }
        contains(e) {
          let r = e;
          for (; r && r !== this; ) r = r.parentNode;
          return r === this;
        }
        insertBefore(e, r = null) {
          if (e === r) return e;
          if (e === this) throw new Error("unable to append a node to itself");
          let n = r || this[_];
          switch (e.nodeType) {
            case 1:
              e.remove(),
                (e.parentNode = this),
                hi(n[ie], e, n),
                Wr(e, null),
                gi(e);
              break;
            case 11: {
              let {[Re]: s, firstChild: i, lastChild: o} = e;
              if (i) {
                Dg(n[ie], i, o, n), st(e, e[_]), s && s.replaceChildren();
                do
                  (i.parentNode = this), Wr(i, null), i.nodeType === 1 && gi(i);
                while (i !== o && (i = jt(i)));
              }
              break;
            }
            case 3:
            case 8:
            case 4:
              e.remove();
            default:
              (e.parentNode = this), yr(n[ie], e, n), Wr(e, null);
              break;
          }
          return e;
        }
        normalize() {
          let {[I]: e, [_]: r} = this;
          for (; e !== r; ) {
            let {[I]: n, [ie]: s, nodeType: i} = e;
            i === 3 &&
              (e[Y]
                ? s &&
                  s.nodeType === 3 &&
                  ((s.textContent += e.textContent), e.remove())
                : e.remove()),
              (e = n);
          }
        }
        removeChild(e) {
          if (e.parentNode !== this) throw new Error("node is not a child");
          return e.remove(), e;
        }
        replaceChild(e, r) {
          let n = $e(r)[I];
          return r.remove(), this.insertBefore(e, n), r;
        }
      });
  });
var Zr,
  Qa = b(() => {
    fe();
    ee();
    fs();
    If();
    Zr = class extends vs {
      getElementById(e) {
        let {[I]: r, [_]: n} = this;
        for (; r !== n; ) {
          if (r.nodeType === 1 && r.id === e) return r;
          r = r[I];
        }
        return null;
      }
      cloneNode(e) {
        let {ownerDocument: r, constructor: n} = this,
          s = new n(r);
        if (e) {
          let {[_]: i} = s;
          for (let o of this.childNodes) s.insertBefore(o.cloneNode(e), i);
        }
        return s;
      }
      toString() {
        let {childNodes: e, localName: r} = this;
        return `<${r}>${e.join("")}</${r}>`;
      }
      toJSON() {
        let e = [];
        return qg(this, e), e;
      }
    };
  });
var Nn,
  kf = b(() => {
    fe();
    Qa();
    Nn = class extends Zr {
      constructor(e) {
        super(e, "#document-fragment", 11);
      }
    };
  });
var Er,
  eu = b(() => {
    fe();
    fs();
    ps();
    Er = class t extends it {
      constructor(e, r, n = "", s = "") {
        super(e, "#document-type", 10),
          (this.name = r),
          (this.publicId = n),
          (this.systemId = s);
      }
      cloneNode() {
        let {ownerDocument: e, name: r, publicId: n, systemId: s} = this;
        return new t(e, r, n, s);
      }
      toString() {
        let {name: e, publicId: r, systemId: n} = this,
          s = 0 < r.length,
          i = [e];
        return (
          s && i.push("PUBLIC", `"${r}"`),
          n.length && (s || i.push("SYSTEM"), i.push(`"${n}"`)),
          `<!DOCTYPE ${i.join(" ")}>`
        );
      }
      toJSON() {
        let e = [];
        return nf(this, e), e;
      }
    };
  });
function Nb(t) {
  switch (((t.ownerDocument = this), t.nodeType)) {
    case 1:
    case 11:
      t.childNodes.forEach(Nb, this);
      break;
  }
  return t;
}
var tu,
  ru,
  Of = b(() => {
    fe();
    ee();
    Qd();
    Ve();
    (tu = (t) => t.childNodes.join("")),
      (ru = (t, e) => {
        let {ownerDocument: r} = t,
          {constructor: n} = r,
          s = new n();
        s[Je] = r[Je];
        let {childNodes: i} = ka(s, Tt(t), e);
        t.replaceChildren(...i.map(Nb, r));
      });
  });
var ws,
  Df = b(() => {
    ws = (t) =>
      t
        .replace(
          /(([A-Z0-9])([A-Z0-9][a-z]))|(([a-z0-9]+)([A-Z]))/g,
          "$2$5-$3$6"
        )
        .toLowerCase();
  });
var nu,
  Mf,
  qT,
  UT,
  Li,
  Lb = b(() => {
    Df();
    wn();
    (nu = new WeakMap()),
      (Mf = (t) => `data-${ws(t)}`),
      (qT = (t) => t.slice(5).replace(/-([a-z])/g, (e, r) => r.toUpperCase())),
      (UT = {
        get(t, e) {
          if (e in t) return nu.get(t).getAttribute(Mf(e));
        },
        set(t, e, r) {
          return (t[e] = r), nu.get(t).setAttribute(Mf(e), r), !0;
        },
        deleteProperty(t, e) {
          return e in t && nu.get(t).removeAttribute(Mf(e)), delete t[e];
        },
      }),
      (Li = class {
        constructor(e) {
          for (let {name: r, value: n} of e.attributes)
            /^data-/.test(r) && (this[qT(r)] = n);
          return nu.set(this, e), new Proxy(this, UT);
        }
      });
    Ne(Li.prototype, null);
  });
var BT,
  Pb,
  Pi,
  su,
  Ib = b(() => {
    ee();
    Fe();
    ms();
    ({add: BT} = Set.prototype),
      (Pb = (t, e) => {
        for (let r of e) r && BT.call(t, r);
      }),
      (Pi = ({[hd]: t, value: e}) => {
        let r = t.getAttributeNode("class");
        r ? (r.value = e) : yi(t, new Ct(t.ownerDocument, "class", e));
      }),
      (su = class extends Set {
        constructor(e) {
          super(), (this[hd] = e);
          let r = e.getAttributeNode("class");
          r && Pb(this, r.value.split(/\s+/));
        }
        get length() {
          return this.size;
        }
        get value() {
          return [...this].join(" ");
        }
        add(...e) {
          Pb(this, e), Pi(this);
        }
        contains(e) {
          return this.has(e);
        }
        remove(...e) {
          for (let r of e) this.delete(r);
          Pi(this);
        }
        toggle(e, r) {
          if (this.has(e)) {
            if (r) return !0;
            this.delete(e), Pi(this);
          } else if (r || arguments.length === 1)
            return super.add(e), Pi(this), !0;
          return !1;
        }
        replace(e, r) {
          return this.has(e)
            ? (this.delete(e), super.add(r), Pi(this), !0)
            : !1;
        }
        supports() {
          return !0;
        }
      });
  });
function KT(t, e) {
  e !== Re && this.push(`${e}:${t}`);
}
var ou,
  _f,
  au,
  iu,
  Ii,
  VT,
  kb = b(() => {
    Df();
    ee();
    (ou = new WeakMap()),
      (_f = (t) => [...t.keys()].filter((e) => e !== Re)),
      (au = (t) => {
        let e = ou.get(t).getAttributeNode("style");
        if ((!e || e[es] || t.get(Re) !== e) && (t.clear(), e)) {
          t.set(Re, e);
          for (let r of e[Y].split(/\s*;\s*/)) {
            let [n, ...s] = r.split(":");
            if (s.length > 0) {
              n = n.trim();
              let i = s.join(":").trim();
              n && i && t.set(n, i);
            }
          }
        }
        return e;
      }),
      (iu = {
        get(t, e) {
          return e in VT
            ? t[e]
            : (au(t),
              e === "length"
                ? _f(t).length
                : /^\d+$/.test(e)
                ? _f(t)[e]
                : t.get(ws(e)));
        },
        set(t, e, r) {
          if (e === "cssText") t[e] = r;
          else {
            let n = au(t);
            if ((r == null ? t.delete(ws(e)) : t.set(ws(e), r), !n)) {
              let s = ou.get(t);
              (n = s.ownerDocument.createAttribute("style")),
                s.setAttributeNode(n),
                t.set(Re, n);
            }
            (n[es] = !1), (n[Y] = t.toString());
          }
          return !0;
        },
      }),
      (Ii = class extends Map {
        constructor(e) {
          return super(), ou.set(this, e), new Proxy(this, iu);
        }
        get cssText() {
          return this.toString();
        }
        set cssText(e) {
          ou.get(this).setAttribute("style", e);
        }
        getPropertyValue(e) {
          let r = this[Re];
          return iu.get(r, e);
        }
        setProperty(e, r) {
          let n = this[Re];
          iu.set(n, e, r);
        }
        removeProperty(e) {
          let r = this[Re];
          iu.set(r, e, null);
        }
        [Symbol.iterator]() {
          let e = this[Re];
          au(e);
          let r = _f(e),
            {length: n} = r,
            s = 0;
          return {
            next() {
              let i = s === n;
              return {done: i, value: i ? null : r[s++]};
            },
          };
        }
        get [Re]() {
          return this;
        }
        toString() {
          let e = this[Re];
          au(e);
          let r = [];
          return e.forEach(KT, r), r.join(";");
        }
      }),
      ({prototype: VT} = Ii);
  });
function WT(t) {
  return t.currentTarget;
}
var Ze,
  Ln = b(() => {
    Ze = class {
      static get BUBBLING_PHASE() {
        return 3;
      }
      static get AT_TARGET() {
        return 2;
      }
      static get CAPTURING_PHASE() {
        return 1;
      }
      static get NONE() {
        return 0;
      }
      constructor(e, r = {}) {
        (this.type = e),
          (this.bubbles = !!r.bubbles),
          (this.cancelBubble = !1),
          (this._stopImmediatePropagationFlag = !1),
          (this.cancelable = !!r.cancelable),
          (this.eventPhase = this.NONE),
          (this.timeStamp = Date.now()),
          (this.defaultPrevented = !1),
          (this.originalTarget = null),
          (this.returnValue = null),
          (this.srcElement = null),
          (this.target = null),
          (this._path = []);
      }
      get BUBBLING_PHASE() {
        return 3;
      }
      get AT_TARGET() {
        return 2;
      }
      get CAPTURING_PHASE() {
        return 1;
      }
      get NONE() {
        return 0;
      }
      preventDefault() {
        this.defaultPrevented = !0;
      }
      composedPath() {
        return this._path.map(WT);
      }
      stopPropagation() {
        this.cancelBubble = !0;
      }
      stopImmediatePropagation() {
        this.stopPropagation(), (this._stopImmediatePropagationFlag = !0);
      }
    };
  });
var Ss,
  $f = b(() => {
    Ss = class extends Array {
      constructor(e) {
        super(), (this.ownerElement = e);
      }
      getNamedItem(e) {
        return this.ownerElement.getAttributeNode(e);
      }
      setNamedItem(e) {
        this.ownerElement.setAttributeNode(e), this.unshift(e);
      }
      removeNamedItem(e) {
        let r = this.getNamedItem(e);
        this.ownerElement.removeAttribute(e), this.splice(this.indexOf(r), 1);
      }
      item(e) {
        return e < this.length ? this[e] : null;
      }
      getNamedItemNS(e, r) {
        return this.getNamedItem(r);
      }
      setNamedItemNS(e, r) {
        return this.setNamedItem(r);
      }
      removeNamedItemNS(e, r) {
        return this.removeNamedItem(r);
      }
    };
  });
var Pn,
  Ff = b(() => {
    fe();
    Of();
    Qa();
    Pn = class extends Zr {
      constructor(e) {
        super(e.ownerDocument, "#shadow-root", 11), (this.host = e);
      }
      get innerHTML() {
        return tu(this);
      }
      set innerHTML(e) {
        ru(this, e);
      }
    };
  });
var GT,
  Ob,
  YT,
  qt,
  ki = b(() => {
    fe();
    Fe();
    ee();
    Ve();
    fs();
    Lf();
    Zd();
    xi();
    ja();
    uf();
    Of();
    If();
    Lb();
    Ib();
    kb();
    Ln();
    $f();
    Ff();
    Yr();
    ms();
    xs();
    _a();
    (GT = {
      get(t, e) {
        return e in t ? t[e] : t.find(({name: r}) => r === e);
      },
    }),
      (Ob = (t, e, r) => {
        if ("ownerSVGElement" in e) {
          let n = t.createElementNS(vn, r);
          return (n.ownerSVGElement = e.ownerSVGElement), n;
        }
        return t.createElement(r);
      }),
      (YT = ({localName: t, ownerDocument: e}) => e[_t].voidElements.test(t)),
      (qt = class extends vs {
        constructor(e, r) {
          super(e, r, 1),
            (this[zr] = null),
            (this[ha] = null),
            (this[ma] = null);
        }
        get isConnected() {
          return $a(this);
        }
        get parentElement() {
          return Fa(this);
        }
        get previousSibling() {
          return wr(this);
        }
        get nextSibling() {
          return jt(this);
        }
        get namespaceURI() {
          return "http://www.w3.org/1999/xhtml";
        }
        get previousElementSibling() {
          return Ha(this);
        }
        get nextElementSibling() {
          return gs(this);
        }
        before(...e) {
          za(this, e);
        }
        after(...e) {
          qa(this, e);
        }
        replaceWith(...e) {
          vi(this, e);
        }
        remove() {
          Ua(this[ie], this, this[_][I]);
        }
        get id() {
          return L.get(this, "id");
        }
        set id(e) {
          L.set(this, "id", e);
        }
        get className() {
          return this.classList.value;
        }
        set className(e) {
          let {classList: r} = this;
          r.clear(), r.add(...$t(e).split(/\s+/));
        }
        get nodeName() {
          return mi(this);
        }
        get tagName() {
          return mi(this);
        }
        get classList() {
          return this[zr] || (this[zr] = new su(this));
        }
        get dataset() {
          return this[ha] || (this[ha] = new Li(this));
        }
        getBoundingClientRect() {
          return {
            x: 0,
            y: 0,
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0,
          };
        }
        get nonce() {
          return L.get(this, "nonce");
        }
        set nonce(e) {
          L.set(this, "nonce", e);
        }
        get style() {
          return this[ma] || (this[ma] = new Ii(this));
        }
        get tabIndex() {
          return Ft.get(this, "tabindex") || -1;
        }
        set tabIndex(e) {
          Ft.set(this, "tabindex", e);
        }
        get slot() {
          return L.get(this, "slot");
        }
        set slot(e) {
          L.set(this, "slot", e);
        }
        get innerText() {
          let e = [],
            {[I]: r, [_]: n} = this;
          for (; r !== n; )
            r.nodeType === 3
              ? e.push(r.textContent.replace(/\s+/g, " "))
              : e.length &&
                r[I] != n &&
                Tg.has(r.tagName) &&
                e.push(`
`),
              (r = r[I]);
          return e.join("");
        }
        get textContent() {
          let e = [],
            {[I]: r, [_]: n} = this;
          for (; r !== n; )
            r.nodeType === 3 && e.push(r.textContent), (r = r[I]);
          return e.join("");
        }
        set textContent(e) {
          this.replaceChildren(),
            e != null &&
              e !== "" &&
              this.appendChild(new Nt(this.ownerDocument, e));
        }
        get innerHTML() {
          return tu(this);
        }
        set innerHTML(e) {
          ru(this, e);
        }
        get outerHTML() {
          return this.toString();
        }
        set outerHTML(e) {
          let r = this.ownerDocument.createElement("");
          (r.innerHTML = e), this.replaceWith(...r.childNodes);
        }
        get attributes() {
          let e = new Ss(this),
            r = this[I];
          for (; r.nodeType === 2; ) e.push(r), (r = r[I]);
          return new Proxy(e, GT);
        }
        focus() {
          this.dispatchEvent(new Ze("focus"));
        }
        getAttribute(e) {
          if (e === "class") return this.className;
          let r = this.getAttributeNode(e);
          return r && (Tt(this) ? r.value : hs(r.value));
        }
        getAttributeNode(e) {
          let r = this[I];
          for (; r.nodeType === 2; ) {
            if (r.name === e) return r;
            r = r[I];
          }
          return null;
        }
        getAttributeNames() {
          let e = new ke(),
            r = this[I];
          for (; r.nodeType === 2; ) e.push(r.name), (r = r[I]);
          return e;
        }
        hasAttribute(e) {
          return !!this.getAttributeNode(e);
        }
        hasAttributes() {
          return this[I].nodeType === 2;
        }
        removeAttribute(e) {
          e === "class" && this[zr] && this[zr].clear();
          let r = this[I];
          for (; r.nodeType === 2; ) {
            if (r.name === e) {
              of(this, r);
              return;
            }
            r = r[I];
          }
        }
        removeAttributeNode(e) {
          let r = this[I];
          for (; r.nodeType === 2; ) {
            if (r === e) {
              of(this, r);
              return;
            }
            r = r[I];
          }
        }
        setAttribute(e, r) {
          if (e === "class") this.className = r;
          else {
            let n = this.getAttributeNode(e);
            n ? (n.value = r) : yi(this, new Ct(this.ownerDocument, e, r));
          }
        }
        setAttributeNode(e) {
          let {name: r} = e,
            n = this.getAttributeNode(r);
          if (n !== e) {
            n && this.removeAttributeNode(n);
            let {ownerElement: s} = e;
            s && s.removeAttributeNode(e), yi(this, e);
          }
          return n;
        }
        toggleAttribute(e, r) {
          return this.hasAttribute(e)
            ? r
              ? !0
              : (this.removeAttribute(e), !1)
            : r || arguments.length === 1
            ? (this.setAttribute(e, ""), !0)
            : !1;
        }
        get shadowRoot() {
          if (tr.has(this)) {
            let {mode: e, shadowRoot: r} = tr.get(this);
            if (e === "open") return r;
          }
          return null;
        }
        attachShadow(e) {
          if (tr.has(this)) throw new Error("operation not supported");
          let r = new Pn(this);
          return tr.set(this, {mode: e.mode, shadowRoot: r}), r;
        }
        matches(e) {
          return Rb(this, e);
        }
        closest(e) {
          let r = this,
            n = Ni(r, e);
          for (; r && !n(r); ) r = r.parentElement;
          return r;
        }
        insertAdjacentElement(e, r) {
          let {parentElement: n} = this;
          switch (e) {
            case "beforebegin":
              if (n) {
                n.insertBefore(r, this);
                break;
              }
              return null;
            case "afterbegin":
              this.insertBefore(r, this.firstChild);
              break;
            case "beforeend":
              this.insertBefore(r, null);
              break;
            case "afterend":
              if (n) {
                n.insertBefore(r, this.nextSibling);
                break;
              }
              return null;
          }
          return r;
        }
        insertAdjacentHTML(e, r) {
          let n = this.ownerDocument.createElement("template");
          (n.innerHTML = r), this.insertAdjacentElement(e, n.content);
        }
        insertAdjacentText(e, r) {
          let n = this.ownerDocument.createTextNode(r);
          this.insertAdjacentElement(e, n);
        }
        cloneNode(e = !1) {
          let {ownerDocument: r, localName: n} = this,
            s = (l) => {
              (l.parentNode = o), st(a, l), (a = l);
            },
            i = Ob(r, this, n),
            o = i,
            a = i,
            {[I]: u, [_]: c} = this;
          for (; u !== c && (e || u.nodeType === 2); ) {
            switch (u.nodeType) {
              case -1:
                st(a, o[_]), (a = o[_]), (o = o.parentNode);
                break;
              case 1: {
                let l = Ob(r, u, u.localName);
                s(l), (o = l);
                break;
              }
              case 2: {
                let l = u.cloneNode(e);
                (l.ownerElement = o), s(l);
                break;
              }
              case 3:
              case 8:
              case 4:
                s(u.cloneNode(e));
                break;
            }
            u = u[I];
          }
          return st(a, i[_]), i;
        }
        toString() {
          let e = [],
            {[_]: r} = this,
            n = {[I]: this},
            s = !1;
          do
            switch (((n = n[I]), n.nodeType)) {
              case 2: {
                let i = " " + n;
                switch (i) {
                  case " id":
                  case " class":
                  case " style":
                    break;
                  default:
                    e.push(i);
                }
                break;
              }
              case -1: {
                let i = n[Oe];
                s
                  ? ("ownerSVGElement" in i
                      ? e.push(" />")
                      : YT(i)
                      ? e.push(Tt(i) ? ">" : " />")
                      : e.push(`></${i.localName}>`),
                    (s = !1))
                  : e.push(`</${i.localName}>`);
                break;
              }
              case 1:
                s && e.push(">"),
                  n.toString !== this.toString
                    ? (e.push(n.toString()), (n = n[_]), (s = !1))
                    : (e.push(`<${n.localName}`), (s = !0));
                break;
              case 3:
              case 8:
              case 4:
                e.push((s ? ">" : "") + n), (s = !1);
                break;
            }
          while (n !== r);
          return e.join("");
        }
        toJSON() {
          let e = [];
          return sf(this, e), e;
        }
        getAttributeNS(e, r) {
          return this.getAttribute(r);
        }
        getElementsByTagNameNS(e, r) {
          return this.getElementsByTagName(r);
        }
        hasAttributeNS(e, r) {
          return this.hasAttribute(r);
        }
        removeAttributeNS(e, r) {
          this.removeAttribute(r);
        }
        setAttributeNS(e, r, n) {
          this.setAttribute(r, n);
        }
        setAttributeNodeNS(e) {
          return this.setAttributeNode(e);
        }
      });
  });
var Hf,
  XT,
  Ut,
  Oi = b(() => {
    ki();
    Ve();
    (Hf = new WeakMap()),
      (XT = {
        get(t, e) {
          return t[e];
        },
        set(t, e, r) {
          return (t[e] = r), !0;
        },
      }),
      (Ut = class extends qt {
        constructor(e, r, n = null) {
          super(e, r), (this.ownerSVGElement = n);
        }
        get className() {
          return (
            Hf.has(this) ||
              Hf.set(this, new Proxy({baseVal: "", animVal: ""}, XT)),
            Hf.get(this)
          );
        }
        set className(e) {
          let {classList: r} = this;
          r.clear(), r.add(...$t(e).split(/\s+/));
        }
        get namespaceURI() {
          return "http://www.w3.org/2000/svg";
        }
        getAttribute(e) {
          return e === "class"
            ? [...this.classList].join(" ")
            : super.getAttribute(e);
        }
        setAttribute(e, r) {
          if (e === "class") this.className = r;
          else if (e === "style") {
            let {className: n} = this;
            n.baseVal = n.animVal = r;
          }
          super.setAttribute(e, r);
        }
      });
  });
function jf() {
  Qe();
}
function zf() {
  Qe();
}
function qf() {
  Qe();
}
function Uf() {
  Qe();
}
function Bf() {
  Qe();
}
function Vf() {
  Qe();
}
function Kf() {
  Qe();
}
function Wf() {
  Qe();
}
function Gf() {
  Qe();
}
function Yf() {
  Qe();
}
function Xf() {
  Qe();
}
var Qe,
  Db,
  uu = b(() => {
    ms();
    wi();
    Ba();
    Va();
    kf();
    eu();
    ki();
    ps();
    Ff();
    xs();
    Oi();
    wn();
    Qe = () => {
      throw new TypeError("Illegal constructor");
    };
    Ne(jf, Ct);
    jf.prototype = Ct.prototype;
    Ne(zf, Xr);
    zf.prototype = Xr.prototype;
    Ne(qf, zt);
    qf.prototype = zt.prototype;
    Ne(Uf, Jr);
    Uf.prototype = Jr.prototype;
    Ne(Bf, Nn);
    Bf.prototype = Nn.prototype;
    Ne(Vf, Er);
    Vf.prototype = Er.prototype;
    Ne(Kf, qt);
    Kf.prototype = qt.prototype;
    Ne(Wf, it);
    Wf.prototype = it.prototype;
    Ne(Gf, Pn);
    Gf.prototype = Pn.prototype;
    Ne(Yf, Nt);
    Yf.prototype = Nt.prototype;
    Ne(Xf, Ut);
    Xf.prototype = Ut.prototype;
    Db = {
      Attr: jf,
      CDATASection: zf,
      CharacterData: qf,
      Comment: Uf,
      DocumentFragment: Bf,
      DocumentType: Vf,
      Element: Kf,
      Node: Wf,
      ShadowRoot: Gf,
      Text: Yf,
      SVGElement: Xf,
    };
  });
var Di,
  v,
  S,
  M = b(() => {
    ee();
    Fe();
    Ln();
    ki();
    vr();
    (Di = new WeakMap()),
      (v = {
        get(t, e) {
          return (Di.has(t) && Di.get(t)[e]) || null;
        },
        set(t, e, r) {
          Di.has(t) || Di.set(t, {});
          let n = Di.get(t),
            s = e.slice(2);
          n[e] && t.removeEventListener(s, n[e], !1),
            (n[e] = r) && t.addEventListener(s, r, !1);
        },
      }),
      (S = class extends qt {
        static get observedAttributes() {
          return [];
        }
        constructor(e = null, r = "") {
          super(e, r);
          let n = !e,
            s;
          if (n) {
            let {constructor: i} = this;
            if (!Sn.has(i))
              throw new Error("unable to initialize this Custom Element");
            ({ownerDocument: e, localName: r, options: s} = Sn.get(i));
          }
          if (e[Ur]) {
            let {element: i, values: o} = e[Ur];
            e[Ur] = null;
            for (let [a, u] of o) i[a] = u;
            return i;
          }
          n &&
            ((this.ownerDocument = this[_].ownerDocument = e),
            (this.localName = r),
            xr.set(this, {connected: !1}),
            s.is && this.setAttribute("is", s.is));
        }
        blur() {
          this.dispatchEvent(new Ze("blur"));
        }
        click() {
          let e = new Ze("click", {bubbles: !0, cancelable: !0});
          (e.button = 0), this.dispatchEvent(e);
        }
        get accessKeyLabel() {
          let {accessKey: e} = this;
          return e && `Alt+Shift+${e}`;
        }
        get isContentEditable() {
          return this.hasAttribute("contenteditable");
        }
        get contentEditable() {
          return W.get(this, "contenteditable");
        }
        set contentEditable(e) {
          W.set(this, "contenteditable", e);
        }
        get draggable() {
          return W.get(this, "draggable");
        }
        set draggable(e) {
          W.set(this, "draggable", e);
        }
        get hidden() {
          return W.get(this, "hidden");
        }
        set hidden(e) {
          W.set(this, "hidden", e);
        }
        get spellcheck() {
          return W.get(this, "spellcheck");
        }
        set spellcheck(e) {
          W.set(this, "spellcheck", e);
        }
        get accessKey() {
          return L.get(this, "accesskey");
        }
        set accessKey(e) {
          L.set(this, "accesskey", e);
        }
        get dir() {
          return L.get(this, "dir");
        }
        set dir(e) {
          L.set(this, "dir", e);
        }
        get lang() {
          return L.get(this, "lang");
        }
        set lang(e) {
          L.set(this, "lang", e);
        }
        get title() {
          return L.get(this, "title");
        }
        set title(e) {
          L.set(this, "title", e);
        }
        get onabort() {
          return v.get(this, "onabort");
        }
        set onabort(e) {
          v.set(this, "onabort", e);
        }
        get onblur() {
          return v.get(this, "onblur");
        }
        set onblur(e) {
          v.set(this, "onblur", e);
        }
        get oncancel() {
          return v.get(this, "oncancel");
        }
        set oncancel(e) {
          v.set(this, "oncancel", e);
        }
        get oncanplay() {
          return v.get(this, "oncanplay");
        }
        set oncanplay(e) {
          v.set(this, "oncanplay", e);
        }
        get oncanplaythrough() {
          return v.get(this, "oncanplaythrough");
        }
        set oncanplaythrough(e) {
          v.set(this, "oncanplaythrough", e);
        }
        get onchange() {
          return v.get(this, "onchange");
        }
        set onchange(e) {
          v.set(this, "onchange", e);
        }
        get onclick() {
          return v.get(this, "onclick");
        }
        set onclick(e) {
          v.set(this, "onclick", e);
        }
        get onclose() {
          return v.get(this, "onclose");
        }
        set onclose(e) {
          v.set(this, "onclose", e);
        }
        get oncontextmenu() {
          return v.get(this, "oncontextmenu");
        }
        set oncontextmenu(e) {
          v.set(this, "oncontextmenu", e);
        }
        get oncuechange() {
          return v.get(this, "oncuechange");
        }
        set oncuechange(e) {
          v.set(this, "oncuechange", e);
        }
        get ondblclick() {
          return v.get(this, "ondblclick");
        }
        set ondblclick(e) {
          v.set(this, "ondblclick", e);
        }
        get ondrag() {
          return v.get(this, "ondrag");
        }
        set ondrag(e) {
          v.set(this, "ondrag", e);
        }
        get ondragend() {
          return v.get(this, "ondragend");
        }
        set ondragend(e) {
          v.set(this, "ondragend", e);
        }
        get ondragenter() {
          return v.get(this, "ondragenter");
        }
        set ondragenter(e) {
          v.set(this, "ondragenter", e);
        }
        get ondragleave() {
          return v.get(this, "ondragleave");
        }
        set ondragleave(e) {
          v.set(this, "ondragleave", e);
        }
        get ondragover() {
          return v.get(this, "ondragover");
        }
        set ondragover(e) {
          v.set(this, "ondragover", e);
        }
        get ondragstart() {
          return v.get(this, "ondragstart");
        }
        set ondragstart(e) {
          v.set(this, "ondragstart", e);
        }
        get ondrop() {
          return v.get(this, "ondrop");
        }
        set ondrop(e) {
          v.set(this, "ondrop", e);
        }
        get ondurationchange() {
          return v.get(this, "ondurationchange");
        }
        set ondurationchange(e) {
          v.set(this, "ondurationchange", e);
        }
        get onemptied() {
          return v.get(this, "onemptied");
        }
        set onemptied(e) {
          v.set(this, "onemptied", e);
        }
        get onended() {
          return v.get(this, "onended");
        }
        set onended(e) {
          v.set(this, "onended", e);
        }
        get onerror() {
          return v.get(this, "onerror");
        }
        set onerror(e) {
          v.set(this, "onerror", e);
        }
        get onfocus() {
          return v.get(this, "onfocus");
        }
        set onfocus(e) {
          v.set(this, "onfocus", e);
        }
        get oninput() {
          return v.get(this, "oninput");
        }
        set oninput(e) {
          v.set(this, "oninput", e);
        }
        get oninvalid() {
          return v.get(this, "oninvalid");
        }
        set oninvalid(e) {
          v.set(this, "oninvalid", e);
        }
        get onkeydown() {
          return v.get(this, "onkeydown");
        }
        set onkeydown(e) {
          v.set(this, "onkeydown", e);
        }
        get onkeypress() {
          return v.get(this, "onkeypress");
        }
        set onkeypress(e) {
          v.set(this, "onkeypress", e);
        }
        get onkeyup() {
          return v.get(this, "onkeyup");
        }
        set onkeyup(e) {
          v.set(this, "onkeyup", e);
        }
        get onload() {
          return v.get(this, "onload");
        }
        set onload(e) {
          v.set(this, "onload", e);
        }
        get onloadeddata() {
          return v.get(this, "onloadeddata");
        }
        set onloadeddata(e) {
          v.set(this, "onloadeddata", e);
        }
        get onloadedmetadata() {
          return v.get(this, "onloadedmetadata");
        }
        set onloadedmetadata(e) {
          v.set(this, "onloadedmetadata", e);
        }
        get onloadstart() {
          return v.get(this, "onloadstart");
        }
        set onloadstart(e) {
          v.set(this, "onloadstart", e);
        }
        get onmousedown() {
          return v.get(this, "onmousedown");
        }
        set onmousedown(e) {
          v.set(this, "onmousedown", e);
        }
        get onmouseenter() {
          return v.get(this, "onmouseenter");
        }
        set onmouseenter(e) {
          v.set(this, "onmouseenter", e);
        }
        get onmouseleave() {
          return v.get(this, "onmouseleave");
        }
        set onmouseleave(e) {
          v.set(this, "onmouseleave", e);
        }
        get onmousemove() {
          return v.get(this, "onmousemove");
        }
        set onmousemove(e) {
          v.set(this, "onmousemove", e);
        }
        get onmouseout() {
          return v.get(this, "onmouseout");
        }
        set onmouseout(e) {
          v.set(this, "onmouseout", e);
        }
        get onmouseover() {
          return v.get(this, "onmouseover");
        }
        set onmouseover(e) {
          v.set(this, "onmouseover", e);
        }
        get onmouseup() {
          return v.get(this, "onmouseup");
        }
        set onmouseup(e) {
          v.set(this, "onmouseup", e);
        }
        get onmousewheel() {
          return v.get(this, "onmousewheel");
        }
        set onmousewheel(e) {
          v.set(this, "onmousewheel", e);
        }
        get onpause() {
          return v.get(this, "onpause");
        }
        set onpause(e) {
          v.set(this, "onpause", e);
        }
        get onplay() {
          return v.get(this, "onplay");
        }
        set onplay(e) {
          v.set(this, "onplay", e);
        }
        get onplaying() {
          return v.get(this, "onplaying");
        }
        set onplaying(e) {
          v.set(this, "onplaying", e);
        }
        get onprogress() {
          return v.get(this, "onprogress");
        }
        set onprogress(e) {
          v.set(this, "onprogress", e);
        }
        get onratechange() {
          return v.get(this, "onratechange");
        }
        set onratechange(e) {
          v.set(this, "onratechange", e);
        }
        get onreset() {
          return v.get(this, "onreset");
        }
        set onreset(e) {
          v.set(this, "onreset", e);
        }
        get onresize() {
          return v.get(this, "onresize");
        }
        set onresize(e) {
          v.set(this, "onresize", e);
        }
        get onscroll() {
          return v.get(this, "onscroll");
        }
        set onscroll(e) {
          v.set(this, "onscroll", e);
        }
        get onseeked() {
          return v.get(this, "onseeked");
        }
        set onseeked(e) {
          v.set(this, "onseeked", e);
        }
        get onseeking() {
          return v.get(this, "onseeking");
        }
        set onseeking(e) {
          v.set(this, "onseeking", e);
        }
        get onselect() {
          return v.get(this, "onselect");
        }
        set onselect(e) {
          v.set(this, "onselect", e);
        }
        get onshow() {
          return v.get(this, "onshow");
        }
        set onshow(e) {
          v.set(this, "onshow", e);
        }
        get onstalled() {
          return v.get(this, "onstalled");
        }
        set onstalled(e) {
          v.set(this, "onstalled", e);
        }
        get onsubmit() {
          return v.get(this, "onsubmit");
        }
        set onsubmit(e) {
          v.set(this, "onsubmit", e);
        }
        get onsuspend() {
          return v.get(this, "onsuspend");
        }
        set onsuspend(e) {
          v.set(this, "onsuspend", e);
        }
        get ontimeupdate() {
          return v.get(this, "ontimeupdate");
        }
        set ontimeupdate(e) {
          v.set(this, "ontimeupdate", e);
        }
        get ontoggle() {
          return v.get(this, "ontoggle");
        }
        set ontoggle(e) {
          v.set(this, "ontoggle", e);
        }
        get onvolumechange() {
          return v.get(this, "onvolumechange");
        }
        set onvolumechange(e) {
          v.set(this, "onvolumechange", e);
        }
        get onwaiting() {
          return v.get(this, "onwaiting");
        }
        set onwaiting(e) {
          v.set(this, "onwaiting", e);
        }
        get onauxclick() {
          return v.get(this, "onauxclick");
        }
        set onauxclick(e) {
          v.set(this, "onauxclick", e);
        }
        get ongotpointercapture() {
          return v.get(this, "ongotpointercapture");
        }
        set ongotpointercapture(e) {
          v.set(this, "ongotpointercapture", e);
        }
        get onlostpointercapture() {
          return v.get(this, "onlostpointercapture");
        }
        set onlostpointercapture(e) {
          v.set(this, "onlostpointercapture", e);
        }
        get onpointercancel() {
          return v.get(this, "onpointercancel");
        }
        set onpointercancel(e) {
          v.set(this, "onpointercancel", e);
        }
        get onpointerdown() {
          return v.get(this, "onpointerdown");
        }
        set onpointerdown(e) {
          v.set(this, "onpointerdown", e);
        }
        get onpointerenter() {
          return v.get(this, "onpointerenter");
        }
        set onpointerenter(e) {
          v.set(this, "onpointerenter", e);
        }
        get onpointerleave() {
          return v.get(this, "onpointerleave");
        }
        set onpointerleave(e) {
          v.set(this, "onpointerleave", e);
        }
        get onpointermove() {
          return v.get(this, "onpointermove");
        }
        set onpointermove(e) {
          v.set(this, "onpointermove", e);
        }
        get onpointerout() {
          return v.get(this, "onpointerout");
        }
        set onpointerout(e) {
          v.set(this, "onpointerout", e);
        }
        get onpointerover() {
          return v.get(this, "onpointerover");
        }
        set onpointerover(e) {
          v.set(this, "onpointerover", e);
        }
        get onpointerup() {
          return v.get(this, "onpointerup");
        }
        set onpointerup(e) {
          v.set(this, "onpointerup", e);
        }
      });
  });
var Mb,
  Mi,
  _b = b(() => {
    ee();
    ve();
    M();
    (Mb = "template"),
      (Mi = class extends S {
        constructor(e) {
          super(e, Mb);
          let r = this.ownerDocument.createDocumentFragment();
          (this[Zs] = r)[Re] = this;
        }
        get content() {
          if (this.hasChildNodes() && !this[Zs].hasChildNodes())
            for (let e of this.childNodes)
              this[Zs].appendChild(e.cloneNode(!0));
          return this[Zs];
        }
      });
    X(Mb, Mi);
  });
var cu,
  $b = b(() => {
    M();
    cu = class extends S {
      constructor(e, r = "html") {
        super(e, r);
      }
    };
  });
var JT,
  nr,
  _i = b(() => {
    M();
    ({toString: JT} = S.prototype),
      (nr = class extends S {
        get innerHTML() {
          return this.textContent;
        }
        set innerHTML(e) {
          this.textContent = e;
        }
        toString() {
          return JT.call(this.cloneNode()).replace(
            /></,
            `>${this.textContent}<`
          );
        }
      });
  });
var Fb,
  $i,
  Hb = b(() => {
    Fe();
    ve();
    _i();
    (Fb = "script"),
      ($i = class extends nr {
        constructor(e, r = Fb) {
          super(e, r);
        }
        get type() {
          return L.get(this, "type");
        }
        set type(e) {
          L.set(this, "type", e);
        }
        get src() {
          return L.get(this, "src");
        }
        set src(e) {
          L.set(this, "src", e);
        }
        get defer() {
          return W.get(this, "defer");
        }
        set defer(e) {
          W.set(this, "defer", e);
        }
        get crossOrigin() {
          return L.get(this, "crossorigin");
        }
        set crossOrigin(e) {
          L.set(this, "crossorigin", e);
        }
        get nomodule() {
          return W.get(this, "nomodule");
        }
        set nomodule(e) {
          W.set(this, "nomodule", e);
        }
        get referrerPolicy() {
          return L.get(this, "referrerpolicy");
        }
        set referrerPolicy(e) {
          L.set(this, "referrerpolicy", e);
        }
        get nonce() {
          return L.get(this, "nonce");
        }
        set nonce(e) {
          L.set(this, "nonce", e);
        }
        get async() {
          return W.get(this, "async");
        }
        set async(e) {
          W.set(this, "async", e);
        }
        get text() {
          return this.textContent;
        }
        set text(e) {
          this.textContent = e;
        }
      });
    X(Fb, $i);
  });
var lu,
  jb = b(() => {
    M();
    lu = class extends S {
      constructor(e, r = "frame") {
        super(e, r);
      }
    };
  });
var zb,
  Fi,
  qb = b(() => {
    ve();
    Fe();
    M();
    (zb = "iframe"),
      (Fi = class extends S {
        constructor(e, r = zb) {
          super(e, r);
        }
        get src() {
          return L.get(this, "src");
        }
        set src(e) {
          L.set(this, "src", e);
        }
        get srcdoc() {
          return L.get(this, "srcdoc");
        }
        set srcdoc(e) {
          L.set(this, "srcdoc", e);
        }
        get name() {
          return L.get(this, "name");
        }
        set name(e) {
          L.set(this, "name", e);
        }
        get allow() {
          return L.get(this, "allow");
        }
        set allow(e) {
          L.set(this, "allow", e);
        }
        get allowFullscreen() {
          return W.get(this, "allowfullscreen");
        }
        set allowFullscreen(e) {
          W.set(this, "allowfullscreen", e);
        }
        get referrerPolicy() {
          return L.get(this, "referrerpolicy");
        }
        set referrerPolicy(e) {
          L.set(this, "referrerpolicy", e);
        }
        get loading() {
          return L.get(this, "loading");
        }
        set loading(e) {
          L.set(this, "loading", e);
        }
      });
    X(zb, Fi);
  });
var du,
  Ub = b(() => {
    M();
    du = class extends S {
      constructor(e, r = "object") {
        super(e, r);
      }
    };
  });
var fu,
  Bb = b(() => {
    M();
    fu = class extends S {
      constructor(e, r = "head") {
        super(e, r);
      }
    };
  });
var pu,
  Vb = b(() => {
    M();
    pu = class extends S {
      constructor(e, r = "body") {
        super(e, r);
      }
    };
  });
var Jf = de((Wb) => {
  var Kb = {};
  Kb.StyleSheet = function () {
    this.parentStyleSheet = null;
  };
  Wb.StyleSheet = Kb.StyleSheet;
});
var at = de((Gb) => {
  var Se = {};
  Se.CSSRule = function () {
    (this.parentRule = null), (this.parentStyleSheet = null);
  };
  Se.CSSRule.UNKNOWN_RULE = 0;
  Se.CSSRule.STYLE_RULE = 1;
  Se.CSSRule.CHARSET_RULE = 2;
  Se.CSSRule.IMPORT_RULE = 3;
  Se.CSSRule.MEDIA_RULE = 4;
  Se.CSSRule.FONT_FACE_RULE = 5;
  Se.CSSRule.PAGE_RULE = 6;
  Se.CSSRule.KEYFRAMES_RULE = 7;
  Se.CSSRule.KEYFRAME_RULE = 8;
  Se.CSSRule.MARGIN_RULE = 9;
  Se.CSSRule.NAMESPACE_RULE = 10;
  Se.CSSRule.COUNTER_STYLE_RULE = 11;
  Se.CSSRule.SUPPORTS_RULE = 12;
  Se.CSSRule.DOCUMENT_RULE = 13;
  Se.CSSRule.FONT_FEATURE_VALUES_RULE = 14;
  Se.CSSRule.VIEWPORT_RULE = 15;
  Se.CSSRule.REGION_STYLE_RULE = 16;
  Se.CSSRule.prototype = {constructor: Se.CSSRule};
  Gb.CSSRule = Se.CSSRule;
});
var Hi = de((Yb) => {
  var gt = {
    CSSStyleDeclaration: In().CSSStyleDeclaration,
    CSSRule: at().CSSRule,
  };
  gt.CSSStyleRule = function () {
    gt.CSSRule.call(this),
      (this.selectorText = ""),
      (this.style = new gt.CSSStyleDeclaration()),
      (this.style.parentRule = this);
  };
  gt.CSSStyleRule.prototype = new gt.CSSRule();
  gt.CSSStyleRule.prototype.constructor = gt.CSSStyleRule;
  gt.CSSStyleRule.prototype.type = 1;
  Object.defineProperty(gt.CSSStyleRule.prototype, "cssText", {
    get: function () {
      var t;
      return (
        this.selectorText
          ? (t = this.selectorText + " {" + this.style.cssText + "}")
          : (t = ""),
        t
      );
    },
    set: function (t) {
      var e = gt.CSSStyleRule.parse(t);
      (this.style = e.style), (this.selectorText = e.selectorText);
    },
  });
  gt.CSSStyleRule.parse = function (t) {
    for (
      var e = 0,
        r = "selector",
        n,
        s = e,
        i = "",
        o = {selector: !0, value: !0},
        a = new gt.CSSStyleRule(),
        u,
        c = "",
        l;
      (l = t.charAt(e));
      e++
    )
      switch (l) {
        case " ":
        case "	":
        case "\r":
        case `
`:
        case "\f":
          if (o[r])
            switch (t.charAt(e - 1)) {
              case " ":
              case "	":
              case "\r":
              case `
`:
              case "\f":
                break;
              default:
                i += " ";
                break;
            }
          break;
        case '"':
          if (((s = e + 1), (n = t.indexOf('"', s) + 1), !n))
            throw '" is missing';
          (i += t.slice(e, n)), (e = n - 1);
          break;
        case "'":
          if (((s = e + 1), (n = t.indexOf("'", s) + 1), !n))
            throw "' is missing";
          (i += t.slice(e, n)), (e = n - 1);
          break;
        case "/":
          if (t.charAt(e + 1) === "*") {
            if (((e += 2), (n = t.indexOf("*/", e)), n === -1))
              throw new SyntaxError("Missing */");
            e = n + 1;
          } else i += l;
          break;
        case "{":
          r === "selector" &&
            ((a.selectorText = i.trim()), (i = ""), (r = "name"));
          break;
        case ":":
          r === "name" ? ((u = i.trim()), (i = ""), (r = "value")) : (i += l);
          break;
        case "!":
          r === "value" && t.indexOf("!important", e) === e
            ? ((c = "important"), (e += 9))
            : (i += l);
          break;
        case ";":
          r === "value"
            ? (a.style.setProperty(u, i.trim(), c),
              (c = ""),
              (i = ""),
              (r = "name"))
            : (i += l);
          break;
        case "}":
          if (r === "value")
            a.style.setProperty(u, i.trim(), c), (c = ""), (i = "");
          else {
            if (r === "name") break;
            i += l;
          }
          r = "selector";
          break;
        default:
          i += l;
          break;
      }
    return a;
  };
  Yb.CSSStyleRule = gt.CSSStyleRule;
});
var ji = de((Xb) => {
  var Lt = {StyleSheet: Jf().StyleSheet, CSSStyleRule: Hi().CSSStyleRule};
  Lt.CSSStyleSheet = function () {
    Lt.StyleSheet.call(this), (this.cssRules = []);
  };
  Lt.CSSStyleSheet.prototype = new Lt.StyleSheet();
  Lt.CSSStyleSheet.prototype.constructor = Lt.CSSStyleSheet;
  Lt.CSSStyleSheet.prototype.insertRule = function (t, e) {
    if (e < 0 || e > this.cssRules.length)
      throw new RangeError("INDEX_SIZE_ERR");
    var r = Lt.parse(t).cssRules[0];
    return (r.parentStyleSheet = this), this.cssRules.splice(e, 0, r), e;
  };
  Lt.CSSStyleSheet.prototype.deleteRule = function (t) {
    if (t < 0 || t >= this.cssRules.length)
      throw new RangeError("INDEX_SIZE_ERR");
    this.cssRules.splice(t, 1);
  };
  Lt.CSSStyleSheet.prototype.toString = function () {
    for (var t = "", e = this.cssRules, r = 0; r < e.length; r++)
      t +=
        e[r].cssText +
        `
`;
    return t;
  };
  Xb.CSSStyleSheet = Lt.CSSStyleSheet;
  Lt.parse = hu().parse;
});
var gu = de((Jb) => {
  var mu = {};
  mu.MediaList = function () {
    this.length = 0;
  };
  mu.MediaList.prototype = {
    constructor: mu.MediaList,
    get mediaText() {
      return Array.prototype.join.call(this, ", ");
    },
    set mediaText(t) {
      for (
        var e = t.split(","), r = (this.length = e.length), n = 0;
        n < r;
        n++
      )
        this[n] = e[n].trim();
    },
    appendMedium: function (t) {
      Array.prototype.indexOf.call(this, t) === -1 &&
        ((this[this.length] = t), this.length++);
    },
    deleteMedium: function (t) {
      var e = Array.prototype.indexOf.call(this, t);
      e !== -1 && Array.prototype.splice.call(this, e, 1);
    },
  };
  Jb.MediaList = mu.MediaList;
});
var Zf = de((Zb) => {
  var Bt = {
    CSSRule: at().CSSRule,
    CSSStyleSheet: ji().CSSStyleSheet,
    MediaList: gu().MediaList,
  };
  Bt.CSSImportRule = function () {
    Bt.CSSRule.call(this),
      (this.href = ""),
      (this.media = new Bt.MediaList()),
      (this.styleSheet = new Bt.CSSStyleSheet());
  };
  Bt.CSSImportRule.prototype = new Bt.CSSRule();
  Bt.CSSImportRule.prototype.constructor = Bt.CSSImportRule;
  Bt.CSSImportRule.prototype.type = 3;
  Object.defineProperty(Bt.CSSImportRule.prototype, "cssText", {
    get: function () {
      var t = this.media.mediaText;
      return "@import url(" + this.href + ")" + (t ? " " + t : "") + ";";
    },
    set: function (t) {
      for (var e = 0, r = "", n = "", s, i; (i = t.charAt(e)); e++)
        switch (i) {
          case " ":
          case "	":
          case "\r":
          case `
`:
          case "\f":
            r === "after-import" ? (r = "url") : (n += i);
            break;
          case "@":
            !r &&
              t.indexOf("@import", e) === e &&
              ((r = "after-import"), (e += 6), (n = ""));
            break;
          case "u":
            if (r === "url" && t.indexOf("url(", e) === e) {
              if (((s = t.indexOf(")", e + 1)), s === -1))
                throw e + ': ")" not found';
              e += 4;
              var o = t.slice(e, s);
              o[0] === o[o.length - 1] &&
                (o[0] === '"' || o[0] === "'") &&
                (o = o.slice(1, -1)),
                (this.href = o),
                (e = s),
                (r = "media");
            }
            break;
          case '"':
            if (r === "url") {
              if (((s = t.indexOf('"', e + 1)), !s))
                throw e + `: '"' not found`;
              (this.href = t.slice(e + 1, s)), (e = s), (r = "media");
            }
            break;
          case "'":
            if (r === "url") {
              if (((s = t.indexOf("'", e + 1)), !s))
                throw e + `: "'" not found`;
              (this.href = t.slice(e + 1, s)), (e = s), (r = "media");
            }
            break;
          case ";":
            r === "media" && n && (this.media.mediaText = n.trim());
            break;
          default:
            r === "media" && (n += i);
            break;
        }
    },
  });
  Zb.CSSImportRule = Bt.CSSImportRule;
});
var kn = de((Qb) => {
  var sr = {CSSRule: at().CSSRule};
  sr.CSSGroupingRule = function () {
    sr.CSSRule.call(this), (this.cssRules = []);
  };
  sr.CSSGroupingRule.prototype = new sr.CSSRule();
  sr.CSSGroupingRule.prototype.constructor = sr.CSSGroupingRule;
  sr.CSSGroupingRule.prototype.insertRule = function (e, r) {
    if (r < 0 || r > this.cssRules.length)
      throw new RangeError("INDEX_SIZE_ERR");
    var n = sr.parse(e).cssRules[0];
    return (n.parentRule = this), this.cssRules.splice(r, 0, n), r;
  };
  sr.CSSGroupingRule.prototype.deleteRule = function (e) {
    if (e < 0 || e >= this.cssRules.length)
      throw new RangeError("INDEX_SIZE_ERR");
    this.cssRules.splice(e, 1)[0].parentRule = null;
  };
  Qb.CSSGroupingRule = sr.CSSGroupingRule;
});
var Es = de((e1) => {
  var Tr = {CSSRule: at().CSSRule, CSSGroupingRule: kn().CSSGroupingRule};
  Tr.CSSConditionRule = function () {
    Tr.CSSGroupingRule.call(this), (this.cssRules = []);
  };
  Tr.CSSConditionRule.prototype = new Tr.CSSGroupingRule();
  Tr.CSSConditionRule.prototype.constructor = Tr.CSSConditionRule;
  Tr.CSSConditionRule.prototype.conditionText = "";
  Tr.CSSConditionRule.prototype.cssText = "";
  e1.CSSConditionRule = Tr.CSSConditionRule;
});
var bu = de((t1) => {
  var ir = {
    CSSRule: at().CSSRule,
    CSSGroupingRule: kn().CSSGroupingRule,
    CSSConditionRule: Es().CSSConditionRule,
    MediaList: gu().MediaList,
  };
  ir.CSSMediaRule = function () {
    ir.CSSConditionRule.call(this), (this.media = new ir.MediaList());
  };
  ir.CSSMediaRule.prototype = new ir.CSSConditionRule();
  ir.CSSMediaRule.prototype.constructor = ir.CSSMediaRule;
  ir.CSSMediaRule.prototype.type = 4;
  Object.defineProperties(ir.CSSMediaRule.prototype, {
    conditionText: {
      get: function () {
        return this.media.mediaText;
      },
      set: function (t) {
        this.media.mediaText = t;
      },
      configurable: !0,
      enumerable: !0,
    },
    cssText: {
      get: function () {
        for (var t = [], e = 0, r = this.cssRules.length; e < r; e++)
          t.push(this.cssRules[e].cssText);
        return "@media " + this.media.mediaText + " {" + t.join("") + "}";
      },
      configurable: !0,
      enumerable: !0,
    },
  });
  t1.CSSMediaRule = ir.CSSMediaRule;
});
var yu = de((r1) => {
  var Ar = {
    CSSRule: at().CSSRule,
    CSSGroupingRule: kn().CSSGroupingRule,
    CSSConditionRule: Es().CSSConditionRule,
  };
  Ar.CSSSupportsRule = function () {
    Ar.CSSConditionRule.call(this);
  };
  Ar.CSSSupportsRule.prototype = new Ar.CSSConditionRule();
  Ar.CSSSupportsRule.prototype.constructor = Ar.CSSSupportsRule;
  Ar.CSSSupportsRule.prototype.type = 12;
  Object.defineProperty(Ar.CSSSupportsRule.prototype, "cssText", {
    get: function () {
      for (var t = [], e = 0, r = this.cssRules.length; e < r; e++)
        t.push(this.cssRules[e].cssText);
      return "@supports " + this.conditionText + " {" + t.join("") + "}";
    },
  });
  r1.CSSSupportsRule = Ar.CSSSupportsRule;
});
var Qf = de((n1) => {
  var or = {
    CSSStyleDeclaration: In().CSSStyleDeclaration,
    CSSRule: at().CSSRule,
  };
  or.CSSFontFaceRule = function () {
    or.CSSRule.call(this),
      (this.style = new or.CSSStyleDeclaration()),
      (this.style.parentRule = this);
  };
  or.CSSFontFaceRule.prototype = new or.CSSRule();
  or.CSSFontFaceRule.prototype.constructor = or.CSSFontFaceRule;
  or.CSSFontFaceRule.prototype.type = 5;
  Object.defineProperty(or.CSSFontFaceRule.prototype, "cssText", {
    get: function () {
      return "@font-face {" + this.style.cssText + "}";
    },
  });
  n1.CSSFontFaceRule = or.CSSFontFaceRule;
});
var e0 = de((s1) => {
  var Cr = {CSSRule: at().CSSRule};
  Cr.CSSHostRule = function () {
    Cr.CSSRule.call(this), (this.cssRules = []);
  };
  Cr.CSSHostRule.prototype = new Cr.CSSRule();
  Cr.CSSHostRule.prototype.constructor = Cr.CSSHostRule;
  Cr.CSSHostRule.prototype.type = 1001;
  Object.defineProperty(Cr.CSSHostRule.prototype, "cssText", {
    get: function () {
      for (var t = [], e = 0, r = this.cssRules.length; e < r; e++)
        t.push(this.cssRules[e].cssText);
      return "@host {" + t.join("") + "}";
    },
  });
  s1.CSSHostRule = Cr.CSSHostRule;
});
var xu = de((i1) => {
  var ar = {
    CSSRule: at().CSSRule,
    CSSStyleDeclaration: In().CSSStyleDeclaration,
  };
  ar.CSSKeyframeRule = function () {
    ar.CSSRule.call(this),
      (this.keyText = ""),
      (this.style = new ar.CSSStyleDeclaration()),
      (this.style.parentRule = this);
  };
  ar.CSSKeyframeRule.prototype = new ar.CSSRule();
  ar.CSSKeyframeRule.prototype.constructor = ar.CSSKeyframeRule;
  ar.CSSKeyframeRule.prototype.type = 8;
  Object.defineProperty(ar.CSSKeyframeRule.prototype, "cssText", {
    get: function () {
      return this.keyText + " {" + this.style.cssText + "} ";
    },
  });
  i1.CSSKeyframeRule = ar.CSSKeyframeRule;
});
var vu = de((o1) => {
  var Rr = {CSSRule: at().CSSRule};
  Rr.CSSKeyframesRule = function () {
    Rr.CSSRule.call(this), (this.name = ""), (this.cssRules = []);
  };
  Rr.CSSKeyframesRule.prototype = new Rr.CSSRule();
  Rr.CSSKeyframesRule.prototype.constructor = Rr.CSSKeyframesRule;
  Rr.CSSKeyframesRule.prototype.type = 7;
  Object.defineProperty(Rr.CSSKeyframesRule.prototype, "cssText", {
    get: function () {
      for (var t = [], e = 0, r = this.cssRules.length; e < r; e++)
        t.push("  " + this.cssRules[e].cssText);
      return (
        "@" +
        (this._vendorPrefix || "") +
        "keyframes " +
        this.name +
        ` { 
` +
        t.join(`
`) +
        `
}`
      );
    },
  });
  o1.CSSKeyframesRule = Rr.CSSKeyframesRule;
});
var t0 = de((a1) => {
  var wu = {};
  wu.CSSValue = function () {};
  wu.CSSValue.prototype = {
    constructor: wu.CSSValue,
    set cssText(t) {
      var e = this._getConstructorName();
      throw new Error(
        'DOMException: property "cssText" of "' +
          e +
          '" is readonly and can not be replaced with "' +
          t +
          '"!'
      );
    },
    get cssText() {
      var t = this._getConstructorName();
      throw new Error('getter "cssText" of "' + t + '" is not implemented!');
    },
    _getConstructorName: function () {
      var t = this.constructor.toString(),
        e = t.match(/function\s([^\(]+)/),
        r = e[1];
      return r;
    },
  };
  a1.CSSValue = wu.CSSValue;
});
var r0 = de((u1) => {
  var Vt = {CSSValue: t0().CSSValue};
  Vt.CSSValueExpression = function (e, r) {
    (this._token = e), (this._idx = r);
  };
  Vt.CSSValueExpression.prototype = new Vt.CSSValue();
  Vt.CSSValueExpression.prototype.constructor = Vt.CSSValueExpression;
  Vt.CSSValueExpression.prototype.parse = function () {
    for (
      var t = this._token, e = this._idx, r = "", n = "", s = "", i, o = [];
      ;
      ++e
    ) {
      if (((r = t.charAt(e)), r === "")) {
        s = "css expression error: unfinished expression!";
        break;
      }
      switch (r) {
        case "(":
          o.push(r), (n += r);
          break;
        case ")":
          o.pop(r), (n += r);
          break;
        case "/":
          (i = this._parseJSComment(t, e))
            ? i.error
              ? (s = "css expression error: unfinished comment in expression!")
              : (e = i.idx)
            : (i = this._parseJSRexExp(t, e))
            ? ((e = i.idx), (n += i.text))
            : (n += r);
          break;
        case "'":
        case '"':
          (i = this._parseJSString(t, e, r)),
            i ? ((e = i.idx), (n += i.text)) : (n += r);
          break;
        default:
          n += r;
          break;
      }
      if (s || o.length === 0) break;
    }
    var a;
    return s ? (a = {error: s}) : (a = {idx: e, expression: n}), a;
  };
  Vt.CSSValueExpression.prototype._parseJSComment = function (t, e) {
    var r = t.charAt(e + 1),
      n;
    if (r === "/" || r === "*") {
      var s = e,
        i,
        o;
      if (
        (r === "/"
          ? (o = `
`)
          : r === "*" && (o = "*/"),
        (i = t.indexOf(o, s + 1 + 1)),
        i !== -1)
      )
        return (
          (i = i + o.length - 1), (n = t.substring(e, i + 1)), {idx: i, text: n}
        );
      var a = "css expression error: unfinished comment in expression!";
      return {error: a};
    } else return !1;
  };
  Vt.CSSValueExpression.prototype._parseJSString = function (t, e, r) {
    var n = this._findMatchedIdx(t, e, r),
      s;
    return n === -1
      ? !1
      : ((s = t.substring(e, n + r.length)), {idx: n, text: s});
  };
  Vt.CSSValueExpression.prototype._parseJSRexExp = function (t, e) {
    var r = t.substring(0, e).replace(/\s+$/, ""),
      n = [
        /^$/,
        /\($/,
        /\[$/,
        /\!$/,
        /\+$/,
        /\-$/,
        /\*$/,
        /\/\s+/,
        /\%$/,
        /\=$/,
        /\>$/,
        /<$/,
        /\&$/,
        /\|$/,
        /\^$/,
        /\~$/,
        /\?$/,
        /\,$/,
        /delete$/,
        /in$/,
        /instanceof$/,
        /new$/,
        /typeof$/,
        /void$/,
      ],
      s = n.some(function (o) {
        return o.test(r);
      });
    if (s) {
      var i = "/";
      return this._parseJSString(t, e, i);
    } else return !1;
  };
  Vt.CSSValueExpression.prototype._findMatchedIdx = function (t, e, r) {
    for (var n = e, s, i = -1; ; )
      if (((s = t.indexOf(r, n + 1)), s === -1)) {
        s = i;
        break;
      } else {
        var o = t.substring(e + 1, s),
          a = o.match(/\\+$/);
        if (!a || a[0] % 2 === 0) break;
        n = s;
      }
    var u = t.indexOf(
      `
`,
      e + 1
    );
    return u < s && (s = i), s;
  };
  u1.CSSValueExpression = Vt.CSSValueExpression;
});
var n0 = de((c1) => {
  var Su = {};
  Su.MatcherList = function () {
    this.length = 0;
  };
  Su.MatcherList.prototype = {
    constructor: Su.MatcherList,
    get matcherText() {
      return Array.prototype.join.call(this, ", ");
    },
    set matcherText(t) {
      for (
        var e = t.split(","), r = (this.length = e.length), n = 0;
        n < r;
        n++
      )
        this[n] = e[n].trim();
    },
    appendMatcher: function (t) {
      Array.prototype.indexOf.call(this, t) === -1 &&
        ((this[this.length] = t), this.length++);
    },
    deleteMatcher: function (t) {
      var e = Array.prototype.indexOf.call(this, t);
      e !== -1 && Array.prototype.splice.call(this, e, 1);
    },
  };
  c1.MatcherList = Su.MatcherList;
});
var s0 = de((l1) => {
  var ur = {CSSRule: at().CSSRule, MatcherList: n0().MatcherList};
  ur.CSSDocumentRule = function () {
    ur.CSSRule.call(this),
      (this.matcher = new ur.MatcherList()),
      (this.cssRules = []);
  };
  ur.CSSDocumentRule.prototype = new ur.CSSRule();
  ur.CSSDocumentRule.prototype.constructor = ur.CSSDocumentRule;
  ur.CSSDocumentRule.prototype.type = 10;
  Object.defineProperty(ur.CSSDocumentRule.prototype, "cssText", {
    get: function () {
      for (var t = [], e = 0, r = this.cssRules.length; e < r; e++)
        t.push(this.cssRules[e].cssText);
      return (
        "@-moz-document " + this.matcher.matcherText + " {" + t.join("") + "}"
      );
    },
  });
  l1.CSSDocumentRule = ur.CSSDocumentRule;
});
var hu = de((d1) => {
  var ue = {};
  ue.parse = function (e) {
    for (
      var r = 0,
        n = "before-selector",
        s,
        i = "",
        o = 0,
        a = {
          selector: !0,
          value: !0,
          "value-parenthesis": !0,
          atRule: !0,
          "importRule-begin": !0,
          importRule: !0,
          atBlock: !0,
          conditionBlock: !0,
          "documentRule-begin": !0,
        },
        u = new ue.CSSStyleSheet(),
        c = u,
        l,
        d = [],
        f = !1,
        h,
        p,
        m = "",
        g,
        x,
        y,
        A,
        T,
        O,
        C,
        w,
        k = /@(-(?:\w+-)+)?keyframes/g,
        D = function (le) {
          var G = e.substring(0, r).split(`
`),
            ne = G.length,
            Le = G.pop().length + 1,
            He = new Error(le + " (line " + ne + ", char " + Le + ")");
          throw ((He.line = ne), (He.char = Le), (He.styleSheet = u), He);
        },
        te;
      (te = e.charAt(r));
      r++
    )
      switch (te) {
        case " ":
        case "	":
        case "\r":
        case `
`:
        case "\f":
          a[n] && (i += te);
          break;
        case '"':
          s = r + 1;
          do (s = e.indexOf('"', s) + 1), s || D('Unmatched "');
          while (e[s - 2] === "\\");
          switch (((i += e.slice(r, s)), (r = s - 1), n)) {
            case "before-value":
              n = "value";
              break;
            case "importRule-begin":
              n = "importRule";
              break;
          }
          break;
        case "'":
          s = r + 1;
          do (s = e.indexOf("'", s) + 1), s || D("Unmatched '");
          while (e[s - 2] === "\\");
          switch (((i += e.slice(r, s)), (r = s - 1), n)) {
            case "before-value":
              n = "value";
              break;
            case "importRule-begin":
              n = "importRule";
              break;
          }
          break;
        case "/":
          e.charAt(r + 1) === "*"
            ? ((r += 2),
              (s = e.indexOf("*/", r)),
              s === -1 ? D("Missing */") : (r = s + 1))
            : (i += te),
            n === "importRule-begin" && ((i += " "), (n = "importRule"));
          break;
        case "@":
          if (e.indexOf("@-moz-document", r) === r) {
            (n = "documentRule-begin"),
              (C = new ue.CSSDocumentRule()),
              (C.__starts = r),
              (r += 13),
              (i = "");
            break;
          } else if (e.indexOf("@media", r) === r) {
            (n = "atBlock"),
              (x = new ue.CSSMediaRule()),
              (x.__starts = r),
              (r += 5),
              (i = "");
            break;
          } else if (e.indexOf("@supports", r) === r) {
            (n = "conditionBlock"),
              (y = new ue.CSSSupportsRule()),
              (y.__starts = r),
              (r += 8),
              (i = "");
            break;
          } else if (e.indexOf("@host", r) === r) {
            (n = "hostRule-begin"),
              (r += 4),
              (w = new ue.CSSHostRule()),
              (w.__starts = r),
              (i = "");
            break;
          } else if (e.indexOf("@import", r) === r) {
            (n = "importRule-begin"), (r += 6), (i += "@import");
            break;
          } else if (e.indexOf("@font-face", r) === r) {
            (n = "fontFaceRule-begin"),
              (r += 9),
              (T = new ue.CSSFontFaceRule()),
              (T.__starts = r),
              (i = "");
            break;
          } else {
            k.lastIndex = r;
            var F = k.exec(e);
            if (F && F.index === r) {
              (n = "keyframesRule-begin"),
                (O = new ue.CSSKeyframesRule()),
                (O.__starts = r),
                (O._vendorPrefix = F[1]),
                (r += F[0].length - 1),
                (i = "");
              break;
            } else n === "selector" && (n = "atRule");
          }
          i += te;
          break;
        case "{":
          n === "selector" || n === "atRule"
            ? ((g.selectorText = i.trim()),
              (g.style.__starts = r),
              (i = ""),
              (n = "before-name"))
            : n === "atBlock"
            ? ((x.media.mediaText = i.trim()),
              l && d.push(l),
              (c = l = x),
              (x.parentStyleSheet = u),
              (i = ""),
              (n = "before-selector"))
            : n === "conditionBlock"
            ? ((y.conditionText = i.trim()),
              l && d.push(l),
              (c = l = y),
              (y.parentStyleSheet = u),
              (i = ""),
              (n = "before-selector"))
            : n === "hostRule-begin"
            ? (l && d.push(l),
              (c = l = w),
              (w.parentStyleSheet = u),
              (i = ""),
              (n = "before-selector"))
            : n === "fontFaceRule-begin"
            ? (l && (T.parentRule = l),
              (T.parentStyleSheet = u),
              (g = T),
              (i = ""),
              (n = "before-name"))
            : n === "keyframesRule-begin"
            ? ((O.name = i.trim()),
              l && (d.push(l), (O.parentRule = l)),
              (O.parentStyleSheet = u),
              (c = l = O),
              (i = ""),
              (n = "keyframeRule-begin"))
            : n === "keyframeRule-begin"
            ? ((g = new ue.CSSKeyframeRule()),
              (g.keyText = i.trim()),
              (g.__starts = r),
              (i = ""),
              (n = "before-name"))
            : n === "documentRule-begin" &&
              ((C.matcher.matcherText = i.trim()),
              l && (d.push(l), (C.parentRule = l)),
              (c = l = C),
              (C.parentStyleSheet = u),
              (i = ""),
              (n = "before-selector"));
          break;
        case ":":
          n === "name"
            ? ((p = i.trim()), (i = ""), (n = "before-value"))
            : (i += te);
          break;
        case "(":
          if (n === "value")
            if (i.trim() === "expression") {
              var K = new ue.CSSValueExpression(e, r).parse();
              K.error ? D(K.error) : ((i += K.expression), (r = K.idx));
            } else (n = "value-parenthesis"), (o = 1), (i += te);
          else n === "value-parenthesis" && o++, (i += te);
          break;
        case ")":
          n === "value-parenthesis" && (o--, o === 0 && (n = "value")),
            (i += te);
          break;
        case "!":
          n === "value" && e.indexOf("!important", r) === r
            ? ((m = "important"), (r += 9))
            : (i += te);
          break;
        case ";":
          switch (n) {
            case "value":
              g.style.setProperty(p, i.trim(), m),
                (m = ""),
                (i = ""),
                (n = "before-name");
              break;
            case "atRule":
              (i = ""), (n = "before-selector");
              break;
            case "importRule":
              (A = new ue.CSSImportRule()),
                (A.parentStyleSheet = A.styleSheet.parentStyleSheet = u),
                (A.cssText = i + te),
                u.cssRules.push(A),
                (i = ""),
                (n = "before-selector");
              break;
            default:
              i += te;
              break;
          }
          break;
        case "}":
          switch (n) {
            case "value":
              g.style.setProperty(p, i.trim(), m), (m = "");
            case "before-name":
            case "name":
              (g.__ends = r + 1),
                l && (g.parentRule = l),
                (g.parentStyleSheet = u),
                c.cssRules.push(g),
                (i = ""),
                c.constructor === ue.CSSKeyframesRule
                  ? (n = "keyframeRule-begin")
                  : (n = "before-selector");
              break;
            case "keyframeRule-begin":
            case "before-selector":
            case "selector":
              for (l || D("Unexpected }"), f = d.length > 0; d.length > 0; ) {
                if (
                  ((l = d.pop()),
                  l.constructor.name === "CSSMediaRule" ||
                    l.constructor.name === "CSSSupportsRule")
                ) {
                  (h = c), (c = l), c.cssRules.push(h);
                  break;
                }
                d.length === 0 && (f = !1);
              }
              f ||
                ((c.__ends = r + 1), u.cssRules.push(c), (c = u), (l = null)),
                (i = ""),
                (n = "before-selector");
              break;
          }
          break;
        default:
          switch (n) {
            case "before-selector":
              (n = "selector"), (g = new ue.CSSStyleRule()), (g.__starts = r);
              break;
            case "before-name":
              n = "name";
              break;
            case "before-value":
              n = "value";
              break;
            case "importRule-begin":
              n = "importRule";
              break;
          }
          i += te;
          break;
      }
    return u;
  };
  d1.parse = ue.parse;
  ue.CSSStyleSheet = ji().CSSStyleSheet;
  ue.CSSStyleRule = Hi().CSSStyleRule;
  ue.CSSImportRule = Zf().CSSImportRule;
  ue.CSSGroupingRule = kn().CSSGroupingRule;
  ue.CSSMediaRule = bu().CSSMediaRule;
  ue.CSSConditionRule = Es().CSSConditionRule;
  ue.CSSSupportsRule = yu().CSSSupportsRule;
  ue.CSSFontFaceRule = Qf().CSSFontFaceRule;
  ue.CSSHostRule = e0().CSSHostRule;
  ue.CSSStyleDeclaration = In().CSSStyleDeclaration;
  ue.CSSKeyframeRule = xu().CSSKeyframeRule;
  ue.CSSKeyframesRule = vu().CSSKeyframesRule;
  ue.CSSValueExpression = r0().CSSValueExpression;
  ue.CSSDocumentRule = s0().CSSDocumentRule;
});
var In = de((f1) => {
  var Ts = {};
  Ts.CSSStyleDeclaration = function () {
    (this.length = 0), (this.parentRule = null), (this._importants = {});
  };
  Ts.CSSStyleDeclaration.prototype = {
    constructor: Ts.CSSStyleDeclaration,
    getPropertyValue: function (t) {
      return this[t] || "";
    },
    setProperty: function (t, e, r) {
      if (this[t]) {
        var n = Array.prototype.indexOf.call(this, t);
        n < 0 && ((this[this.length] = t), this.length++);
      } else (this[this.length] = t), this.length++;
      (this[t] = e + ""), (this._importants[t] = r);
    },
    removeProperty: function (t) {
      if (!(t in this)) return "";
      var e = Array.prototype.indexOf.call(this, t);
      if (e < 0) return "";
      var r = this[t];
      return (this[t] = ""), Array.prototype.splice.call(this, e, 1), r;
    },
    getPropertyCSSValue: function () {},
    getPropertyPriority: function (t) {
      return this._importants[t] || "";
    },
    getPropertyShorthand: function () {},
    isPropertyImplicit: function () {},
    get cssText() {
      for (var t = [], e = 0, r = this.length; e < r; ++e) {
        var n = this[e],
          s = this.getPropertyValue(n),
          i = this.getPropertyPriority(n);
        i && (i = " !" + i), (t[e] = n + ": " + s + i + ";");
      }
      return t.join(" ");
    },
    set cssText(t) {
      var e, r;
      for (e = this.length; e--; ) (r = this[e]), (this[r] = "");
      Array.prototype.splice.call(this, 0, this.length),
        (this._importants = {});
      var n = Ts.parse("#bogus{" + t + "}").cssRules[0].style,
        s = n.length;
      for (e = 0; e < s; ++e)
        (r = n[e]),
          this.setProperty(
            n[e],
            n.getPropertyValue(r),
            n.getPropertyPriority(r)
          );
    },
  };
  f1.CSSStyleDeclaration = Ts.CSSStyleDeclaration;
  Ts.parse = hu().parse;
});
var h1 = de((p1) => {
  var Eu = {
    CSSStyleSheet: ji().CSSStyleSheet,
    CSSRule: at().CSSRule,
    CSSStyleRule: Hi().CSSStyleRule,
    CSSGroupingRule: kn().CSSGroupingRule,
    CSSConditionRule: Es().CSSConditionRule,
    CSSMediaRule: bu().CSSMediaRule,
    CSSSupportsRule: yu().CSSSupportsRule,
    CSSStyleDeclaration: In().CSSStyleDeclaration,
    CSSKeyframeRule: xu().CSSKeyframeRule,
    CSSKeyframesRule: vu().CSSKeyframesRule,
  };
  Eu.clone = function t(e) {
    var r = new Eu.CSSStyleSheet(),
      n = e.cssRules;
    if (!n) return r;
    for (var s = 0, i = n.length; s < i; s++) {
      var o = n[s],
        a = (r.cssRules[s] = new o.constructor()),
        u = o.style;
      if (u) {
        for (
          var c = (a.style = new Eu.CSSStyleDeclaration()), l = 0, d = u.length;
          l < d;
          l++
        ) {
          var f = (c[l] = u[l]);
          (c[f] = u[f]), (c._importants[f] = u.getPropertyPriority(f));
        }
        c.length = u.length;
      }
      o.hasOwnProperty("keyText") && (a.keyText = o.keyText),
        o.hasOwnProperty("selectorText") && (a.selectorText = o.selectorText),
        o.hasOwnProperty("mediaText") && (a.mediaText = o.mediaText),
        o.hasOwnProperty("conditionText") &&
          (a.conditionText = o.conditionText),
        o.hasOwnProperty("cssRules") && (a.cssRules = t(o).cssRules);
    }
    return r;
  };
  p1.clone = Eu.clone;
});
var m1 = de((xe) => {
  "use strict";
  xe.CSSStyleDeclaration = In().CSSStyleDeclaration;
  xe.CSSRule = at().CSSRule;
  xe.CSSGroupingRule = kn().CSSGroupingRule;
  xe.CSSConditionRule = Es().CSSConditionRule;
  xe.CSSStyleRule = Hi().CSSStyleRule;
  xe.MediaList = gu().MediaList;
  xe.CSSMediaRule = bu().CSSMediaRule;
  xe.CSSSupportsRule = yu().CSSSupportsRule;
  xe.CSSImportRule = Zf().CSSImportRule;
  xe.CSSFontFaceRule = Qf().CSSFontFaceRule;
  xe.CSSHostRule = e0().CSSHostRule;
  xe.StyleSheet = Jf().StyleSheet;
  xe.CSSStyleSheet = ji().CSSStyleSheet;
  xe.CSSKeyframesRule = vu().CSSKeyframesRule;
  xe.CSSKeyframeRule = xu().CSSKeyframeRule;
  xe.MatcherList = n0().MatcherList;
  xe.CSSDocumentRule = s0().CSSDocumentRule;
  xe.CSSValue = t0().CSSValue;
  xe.CSSValueExpression = r0().CSSValueExpression;
  xe.parse = hu().parse;
  xe.clone = h1().clone;
});
var g1,
  b1,
  zi,
  y1 = b(() => {
    g1 = Ot(m1(), 1);
    ve();
    ee();
    _i();
    (b1 = "style"),
      (zi = class extends nr {
        constructor(e, r = b1) {
          super(e, r), (this[bn] = null);
        }
        get sheet() {
          let e = this[bn];
          return e !== null ? e : (this[bn] = (0, g1.parse)(this.textContent));
        }
        get innerHTML() {
          return super.innerHTML || "";
        }
        set innerHTML(e) {
          (super.textContent = e), (this[bn] = null);
        }
        get innerText() {
          return super.innerText || "";
        }
        set innerText(e) {
          (super.textContent = e), (this[bn] = null);
        }
        get textContent() {
          return super.textContent || "";
        }
        set textContent(e) {
          (super.textContent = e), (this[bn] = null);
        }
      });
    X(b1, zi);
  });
var Tu,
  x1 = b(() => {
    M();
    Tu = class extends S {
      constructor(e, r = "time") {
        super(e, r);
      }
    };
  });
var Au,
  v1 = b(() => {
    M();
    Au = class extends S {
      constructor(e, r = "fieldset") {
        super(e, r);
      }
    };
  });
var Cu,
  w1 = b(() => {
    M();
    Cu = class extends S {
      constructor(e, r = "embed") {
        super(e, r);
      }
    };
  });
var Ru,
  S1 = b(() => {
    M();
    Ru = class extends S {
      constructor(e, r = "hr") {
        super(e, r);
      }
    };
  });
var Nu,
  E1 = b(() => {
    M();
    Nu = class extends S {
      constructor(e, r = "progress") {
        super(e, r);
      }
    };
  });
var Lu,
  T1 = b(() => {
    M();
    Lu = class extends S {
      constructor(e, r = "p") {
        super(e, r);
      }
    };
  });
var Pu,
  A1 = b(() => {
    M();
    Pu = class extends S {
      constructor(e, r = "table") {
        super(e, r);
      }
    };
  });
var Iu,
  C1 = b(() => {
    M();
    Iu = class extends S {
      constructor(e, r = "frameset") {
        super(e, r);
      }
    };
  });
var ku,
  R1 = b(() => {
    M();
    ku = class extends S {
      constructor(e, r = "li") {
        super(e, r);
      }
    };
  });
var Ou,
  N1 = b(() => {
    M();
    Ou = class extends S {
      constructor(e, r = "base") {
        super(e, r);
      }
    };
  });
var Du,
  L1 = b(() => {
    M();
    Du = class extends S {
      constructor(e, r = "datalist") {
        super(e, r);
      }
    };
  });
var P1,
  qi,
  I1 = b(() => {
    ve();
    Fe();
    M();
    (P1 = "input"),
      (qi = class extends S {
        constructor(e, r = P1) {
          super(e, r);
        }
        get autofocus() {
          return W.get(this, "autofocus") || -1;
        }
        set autofocus(e) {
          W.set(this, "autofocus", e);
        }
        get disabled() {
          return W.get(this, "disabled");
        }
        set disabled(e) {
          W.set(this, "disabled", e);
        }
        get name() {
          return this.getAttribute("name");
        }
        set name(e) {
          this.setAttribute("name", e);
        }
        get placeholder() {
          return this.getAttribute("placeholder");
        }
        set placeholder(e) {
          this.setAttribute("placeholder", e);
        }
        get type() {
          return this.getAttribute("type");
        }
        set type(e) {
          this.setAttribute("type", e);
        }
        get value() {
          return L.get(this, "value");
        }
        set value(e) {
          L.set(this, "value", e);
        }
      });
    X(P1, qi);
  });
var Mu,
  k1 = b(() => {
    M();
    Mu = class extends S {
      constructor(e, r = "param") {
        super(e, r);
      }
    };
  });
var _u,
  O1 = b(() => {
    M();
    _u = class extends S {
      constructor(e, r = "media") {
        super(e, r);
      }
    };
  });
var $u,
  D1 = b(() => {
    M();
    $u = class extends S {
      constructor(e, r = "audio") {
        super(e, r);
      }
    };
  });
var M1,
  Ui,
  _1 = b(() => {
    ve();
    M();
    (M1 = "h1"),
      (Ui = class extends S {
        constructor(e, r = M1) {
          super(e, r);
        }
      });
    X([M1, "h2", "h3", "h4", "h5", "h6"], Ui);
  });
var Fu,
  $1 = b(() => {
    M();
    Fu = class extends S {
      constructor(e, r = "dir") {
        super(e, r);
      }
    };
  });
var Hu,
  F1 = b(() => {
    M();
    Hu = class extends S {
      constructor(e, r = "quote") {
        super(e, r);
      }
    };
  });
var j1 = de((FD, H1) => {
  var i0 = class {
    constructor(e, r) {
      (this.width = e), (this.height = r);
    }
    getContext() {
      return null;
    }
    toDataURL() {
      return "";
    }
  };
  H1.exports = {createCanvas: (t, e) => new i0(t, e)};
});
var z1 = de((HD, o0) => {
  try {
    o0.exports = op("canvas");
  } catch {
    o0.exports = j1();
  }
});
var q1,
  ZT,
  U1,
  Bi,
  B1 = b(() => {
    ee();
    ve();
    Fe();
    q1 = Ot(z1(), 1);
    M();
    ({createCanvas: ZT} = q1.default),
      (U1 = "canvas"),
      (Bi = class extends S {
        constructor(e, r = U1) {
          super(e, r), (this[ft] = ZT(300, 150));
        }
        get width() {
          return this[ft].width;
        }
        set width(e) {
          Ft.set(this, "width", e), (this[ft].width = e);
        }
        get height() {
          return this[ft].height;
        }
        set height(e) {
          Ft.set(this, "height", e), (this[ft].height = e);
        }
        getContext(e) {
          return this[ft].getContext(e);
        }
        toDataURL(...e) {
          return this[ft].toDataURL(...e);
        }
      });
    X(U1, Bi);
  });
var ju,
  V1 = b(() => {
    M();
    ju = class extends S {
      constructor(e, r = "legend") {
        super(e, r);
      }
    };
  });
var K1,
  Vi,
  W1 = b(() => {
    M();
    Fe();
    ve();
    (K1 = "option"),
      (Vi = class extends S {
        constructor(e, r = K1) {
          super(e, r);
        }
        get value() {
          return L.get(this, "value");
        }
        set value(e) {
          L.set(this, "value", e);
        }
        get selected() {
          return W.get(this, "selected");
        }
        set selected(e) {
          let r = this.parentElement?.querySelector("option[selected]");
          r && r !== this && (r.selected = !1), W.set(this, "selected", e);
        }
      });
    X(K1, Vi);
  });
var zu,
  G1 = b(() => {
    M();
    zu = class extends S {
      constructor(e, r = "span") {
        super(e, r);
      }
    };
  });
var qu,
  Y1 = b(() => {
    M();
    qu = class extends S {
      constructor(e, r = "meter") {
        super(e, r);
      }
    };
  });
var Uu,
  X1 = b(() => {
    M();
    Uu = class extends S {
      constructor(e, r = "video") {
        super(e, r);
      }
    };
  });
var Bu,
  J1 = b(() => {
    M();
    Bu = class extends S {
      constructor(e, r = "td") {
        super(e, r);
      }
    };
  });
var Z1,
  Ki,
  Q1 = b(() => {
    ve();
    _i();
    (Z1 = "title"),
      (Ki = class extends nr {
        constructor(e, r = Z1) {
          super(e, r);
        }
      });
    X(Z1, Ki);
  });
var Vu,
  ey = b(() => {
    M();
    Vu = class extends S {
      constructor(e, r = "output") {
        super(e, r);
      }
    };
  });
var Ku,
  ty = b(() => {
    M();
    Ku = class extends S {
      constructor(e, r = "tr") {
        super(e, r);
      }
    };
  });
var Wu,
  ry = b(() => {
    M();
    Wu = class extends S {
      constructor(e, r = "data") {
        super(e, r);
      }
    };
  });
var Gu,
  ny = b(() => {
    M();
    Gu = class extends S {
      constructor(e, r = "menu") {
        super(e, r);
      }
    };
  });
var sy,
  Wi,
  iy = b(() => {
    ve();
    Fe();
    M();
    Yr();
    (sy = "select"),
      (Wi = class extends S {
        constructor(e, r = sy) {
          super(e, r);
        }
        get options() {
          let e = new ke(),
            {firstElementChild: r} = this;
          for (; r; )
            r.tagName === "OPTGROUP" ? e.push(...r.children) : e.push(r),
              (r = r.nextElementSibling);
          return e;
        }
        get disabled() {
          return W.get(this, "disabled");
        }
        set disabled(e) {
          W.set(this, "disabled", e);
        }
        get name() {
          return this.getAttribute("name");
        }
        set name(e) {
          this.setAttribute("name", e);
        }
        get value() {
          return this.querySelector("option[selected]")?.value;
        }
      });
    X(sy, Wi);
  });
var Yu,
  oy = b(() => {
    M();
    Yu = class extends S {
      constructor(e, r = "br") {
        super(e, r);
      }
    };
  });
var ay,
  Gi,
  uy = b(() => {
    ve();
    Fe();
    M();
    (ay = "button"),
      (Gi = class extends S {
        constructor(e, r = ay) {
          super(e, r);
        }
        get disabled() {
          return W.get(this, "disabled");
        }
        set disabled(e) {
          W.set(this, "disabled", e);
        }
        get name() {
          return this.getAttribute("name");
        }
        set name(e) {
          this.setAttribute("name", e);
        }
        get type() {
          return this.getAttribute("type");
        }
        set type(e) {
          this.setAttribute("type", e);
        }
      });
    X(ay, Gi);
  });
var Xu,
  cy = b(() => {
    M();
    Xu = class extends S {
      constructor(e, r = "map") {
        super(e, r);
      }
    };
  });
var Ju,
  ly = b(() => {
    M();
    Ju = class extends S {
      constructor(e, r = "optgroup") {
        super(e, r);
      }
    };
  });
var Zu,
  dy = b(() => {
    M();
    Zu = class extends S {
      constructor(e, r = "dl") {
        super(e, r);
      }
    };
  });
var fy,
  Yi,
  py = b(() => {
    ve();
    Fe();
    _i();
    (fy = "textarea"),
      (Yi = class extends nr {
        constructor(e, r = fy) {
          super(e, r);
        }
        get disabled() {
          return W.get(this, "disabled");
        }
        set disabled(e) {
          W.set(this, "disabled", e);
        }
        get name() {
          return this.getAttribute("name");
        }
        set name(e) {
          this.setAttribute("name", e);
        }
        get placeholder() {
          return this.getAttribute("placeholder");
        }
        set placeholder(e) {
          this.setAttribute("placeholder", e);
        }
        get type() {
          return this.getAttribute("type");
        }
        set type(e) {
          this.setAttribute("type", e);
        }
        get value() {
          return this.textContent;
        }
        set value(e) {
          this.textContent = e;
        }
      });
    X(fy, Yi);
  });
var Qu,
  hy = b(() => {
    M();
    Qu = class extends S {
      constructor(e, r = "font") {
        super(e, r);
      }
    };
  });
var ec,
  my = b(() => {
    M();
    ec = class extends S {
      constructor(e, r = "div") {
        super(e, r);
      }
    };
  });
var gy,
  Xi,
  by = b(() => {
    ve();
    Fe();
    M();
    (gy = "link"),
      (Xi = class extends S {
        constructor(e, r = gy) {
          super(e, r);
        }
        get disabled() {
          return W.get(this, "disabled");
        }
        set disabled(e) {
          W.set(this, "disabled", e);
        }
        get href() {
          return L.get(this, "href");
        }
        set href(e) {
          L.set(this, "href", e);
        }
        get hreflang() {
          return L.get(this, "hreflang");
        }
        set hreflang(e) {
          L.set(this, "hreflang", e);
        }
        get media() {
          return L.get(this, "media");
        }
        set media(e) {
          L.set(this, "media", e);
        }
        get rel() {
          return L.get(this, "rel");
        }
        set rel(e) {
          L.set(this, "rel", e);
        }
        get type() {
          return L.get(this, "type");
        }
        set type(e) {
          L.set(this, "type", e);
        }
      });
    X(gy, Xi);
  });
var yy,
  Ji,
  xy = b(() => {
    M();
    ve();
    (yy = "slot"),
      (Ji = class extends S {
        constructor(e, r = yy) {
          super(e, r);
        }
        get name() {
          return this.getAttribute("name");
        }
        set name(e) {
          this.setAttribute("name", e);
        }
        assign() {}
        assignedNodes(e) {
          let r = !!this.name,
            n = this.getRootNode().host?.childNodes ?? [],
            s;
          if (
            (r
              ? (s = [...n].filter((i) => i.slot === this.name))
              : (s = [...n].filter((i) => !i.slot)),
            e?.flatten)
          ) {
            let i = [];
            for (let o of s)
              o.localName === "slot"
                ? i.push(...o.assignedNodes({flatten: !0}))
                : i.push(o);
            s = i;
          }
          return s.length ? s : [...this.childNodes];
        }
        assignedElements(e) {
          let r = this.assignedNodes(e).filter((n) => n.nodeType === 1);
          return r.length ? r : [...this.children];
        }
      });
    X(yy, Ji);
  });
var tc,
  vy = b(() => {
    M();
    tc = class extends S {
      constructor(e, r = "form") {
        super(e, r);
      }
    };
  });
var wy,
  On,
  a0 = b(() => {
    ve();
    Fe();
    M();
    (wy = "img"),
      (On = class extends S {
        constructor(e, r = wy) {
          super(e, r);
        }
        get alt() {
          return L.get(this, "alt");
        }
        set alt(e) {
          L.set(this, "alt", e);
        }
        get sizes() {
          return L.get(this, "sizes");
        }
        set sizes(e) {
          L.set(this, "sizes", e);
        }
        get src() {
          return L.get(this, "src");
        }
        set src(e) {
          L.set(this, "src", e);
        }
        get srcset() {
          return L.get(this, "srcset");
        }
        set srcset(e) {
          L.set(this, "srcset", e);
        }
        get title() {
          return L.get(this, "title");
        }
        set title(e) {
          L.set(this, "title", e);
        }
        get width() {
          return Ft.get(this, "width");
        }
        set width(e) {
          Ft.set(this, "width", e);
        }
        get height() {
          return Ft.get(this, "height");
        }
        set height(e) {
          Ft.set(this, "height", e);
        }
      });
    X(wy, On);
  });
var rc,
  Sy = b(() => {
    M();
    rc = class extends S {
      constructor(e, r = "pre") {
        super(e, r);
      }
    };
  });
var nc,
  Ey = b(() => {
    M();
    nc = class extends S {
      constructor(e, r = "ul") {
        super(e, r);
      }
    };
  });
var Ty,
  Zi,
  Ay = b(() => {
    M();
    ve();
    Fe();
    (Ty = "meta"),
      (Zi = class extends S {
        constructor(e, r = Ty) {
          super(e, r);
        }
        get name() {
          return L.get(this, "name");
        }
        set name(e) {
          L.set(this, "name", e);
        }
        get httpEquiv() {
          return L.get(this, "http-equiv");
        }
        set httpEquiv(e) {
          L.set(this, "http-equiv", e);
        }
        get content() {
          return L.get(this, "content");
        }
        set content(e) {
          L.set(this, "content", e);
        }
        get charset() {
          return L.get(this, "charset");
        }
        set charset(e) {
          L.set(this, "charset", e);
        }
        get media() {
          return L.get(this, "media");
        }
        set media(e) {
          L.set(this, "media", e);
        }
      });
    X(Ty, Zi);
  });
var sc,
  Cy = b(() => {
    M();
    sc = class extends S {
      constructor(e, r = "picture") {
        super(e, r);
      }
    };
  });
var ic,
  Ry = b(() => {
    M();
    ic = class extends S {
      constructor(e, r = "area") {
        super(e, r);
      }
    };
  });
var oc,
  Ny = b(() => {
    M();
    oc = class extends S {
      constructor(e, r = "ol") {
        super(e, r);
      }
    };
  });
var ac,
  Ly = b(() => {
    M();
    ac = class extends S {
      constructor(e, r = "caption") {
        super(e, r);
      }
    };
  });
var Py,
  Qi,
  Iy = b(() => {
    ve();
    Fe();
    M();
    (Py = "a"),
      (Qi = class extends S {
        constructor(e, r = Py) {
          super(e, r);
        }
        get href() {
          return encodeURI(decodeURI(L.get(this, "href")));
        }
        set href(e) {
          L.set(this, "href", decodeURI(e));
        }
        get download() {
          return encodeURI(decodeURI(L.get(this, "download")));
        }
        set download(e) {
          L.set(this, "download", decodeURI(e));
        }
        get target() {
          return L.get(this, "target");
        }
        set target(e) {
          L.set(this, "target", e);
        }
        get type() {
          return L.get(this, "type");
        }
        set type(e) {
          L.set(this, "type", e);
        }
      });
    X(Py, Qi);
  });
var uc,
  ky = b(() => {
    M();
    uc = class extends S {
      constructor(e, r = "label") {
        super(e, r);
      }
    };
  });
var cc,
  Oy = b(() => {
    M();
    cc = class extends S {
      constructor(e, r = "unknown") {
        super(e, r);
      }
    };
  });
var lc,
  Dy = b(() => {
    M();
    lc = class extends S {
      constructor(e, r = "mod") {
        super(e, r);
      }
    };
  });
var dc,
  My = b(() => {
    M();
    dc = class extends S {
      constructor(e, r = "details") {
        super(e, r);
      }
    };
  });
var _y,
  eo,
  $y = b(() => {
    ve();
    Fe();
    M();
    (_y = "source"),
      (eo = class extends S {
        constructor(e, r = _y) {
          super(e, r);
        }
        get src() {
          return L.get(this, "src");
        }
        set src(e) {
          L.set(this, "src", e);
        }
        get srcset() {
          return L.get(this, "srcset");
        }
        set srcset(e) {
          L.set(this, "srcset", e);
        }
        get sizes() {
          return L.get(this, "sizes");
        }
        set sizes(e) {
          L.set(this, "sizes", e);
        }
        get type() {
          return L.get(this, "type");
        }
        set type(e) {
          L.set(this, "type", e);
        }
      });
    X(_y, eo);
  });
var fc,
  Fy = b(() => {
    M();
    fc = class extends S {
      constructor(e, r = "track") {
        super(e, r);
      }
    };
  });
var pc,
  Hy = b(() => {
    M();
    pc = class extends S {
      constructor(e, r = "marquee") {
        super(e, r);
      }
    };
  });
var jy,
  u0 = b(() => {
    M();
    _b();
    $b();
    Hb();
    jb();
    qb();
    Ub();
    Bb();
    Vb();
    y1();
    x1();
    v1();
    w1();
    S1();
    E1();
    T1();
    A1();
    C1();
    R1();
    N1();
    L1();
    I1();
    k1();
    O1();
    D1();
    _1();
    $1();
    F1();
    B1();
    V1();
    W1();
    G1();
    Y1();
    X1();
    J1();
    Q1();
    ey();
    ty();
    ry();
    ny();
    iy();
    oy();
    uy();
    cy();
    ly();
    dy();
    py();
    hy();
    my();
    by();
    xy();
    vy();
    a0();
    Sy();
    Ey();
    Ay();
    Cy();
    Ry();
    Ny();
    Ly();
    Iy();
    ky();
    Oy();
    Dy();
    My();
    $y();
    Fy();
    Hy();
    jy = {
      HTMLElement: S,
      HTMLTemplateElement: Mi,
      HTMLHtmlElement: cu,
      HTMLScriptElement: $i,
      HTMLFrameElement: lu,
      HTMLIFrameElement: Fi,
      HTMLObjectElement: du,
      HTMLHeadElement: fu,
      HTMLBodyElement: pu,
      HTMLStyleElement: zi,
      HTMLTimeElement: Tu,
      HTMLFieldSetElement: Au,
      HTMLEmbedElement: Cu,
      HTMLHRElement: Ru,
      HTMLProgressElement: Nu,
      HTMLParagraphElement: Lu,
      HTMLTableElement: Pu,
      HTMLFrameSetElement: Iu,
      HTMLLIElement: ku,
      HTMLBaseElement: Ou,
      HTMLDataListElement: Du,
      HTMLInputElement: qi,
      HTMLParamElement: Mu,
      HTMLMediaElement: _u,
      HTMLAudioElement: $u,
      HTMLHeadingElement: Ui,
      HTMLDirectoryElement: Fu,
      HTMLQuoteElement: Hu,
      HTMLCanvasElement: Bi,
      HTMLLegendElement: ju,
      HTMLOptionElement: Vi,
      HTMLSpanElement: zu,
      HTMLMeterElement: qu,
      HTMLVideoElement: Uu,
      HTMLTableCellElement: Bu,
      HTMLTitleElement: Ki,
      HTMLOutputElement: Vu,
      HTMLTableRowElement: Ku,
      HTMLDataElement: Wu,
      HTMLMenuElement: Gu,
      HTMLSelectElement: Wi,
      HTMLBRElement: Yu,
      HTMLButtonElement: Gi,
      HTMLMapElement: Xu,
      HTMLOptGroupElement: Ju,
      HTMLDListElement: Zu,
      HTMLTextAreaElement: Yi,
      HTMLFontElement: Qu,
      HTMLDivElement: ec,
      HTMLLinkElement: Xi,
      HTMLSlotElement: Ji,
      HTMLFormElement: tc,
      HTMLImageElement: On,
      HTMLPreElement: rc,
      HTMLUListElement: nc,
      HTMLMetaElement: Zi,
      HTMLPictureElement: sc,
      HTMLAreaElement: ic,
      HTMLOListElement: oc,
      HTMLTableCaptionElement: ac,
      HTMLAnchorElement: Qi,
      HTMLLabelElement: uc,
      HTMLUnknownElement: cc,
      HTMLModElement: lc,
      HTMLDetailsElement: dc,
      HTMLSourceElement: eo,
      HTMLTrackElement: fc,
      HTMLMarqueeElement: pc,
    };
  });
var hc,
  zy,
  qy = b(() => {
    (hc = {test: () => !0}),
      (zy = {
        "text/html": {
          docType: "<!DOCTYPE html>",
          ignoreCase: !0,
          voidElements:
            /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,
        },
        "image/svg+xml": {
          docType: '<?xml version="1.0" encoding="utf-8"?>',
          ignoreCase: !1,
          voidElements: hc,
        },
        "text/xml": {
          docType: '<?xml version="1.0" encoding="utf-8"?>',
          ignoreCase: !1,
          voidElements: hc,
        },
        "application/xml": {
          docType: '<?xml version="1.0" encoding="utf-8"?>',
          ignoreCase: !1,
          voidElements: hc,
        },
        "application/xhtml+xml": {
          docType: '<?xml version="1.0" encoding="utf-8"?>',
          ignoreCase: !1,
          voidElements: hc,
        },
      });
  });
var As,
  c0 = b(() => {
    Ln();
    As = class extends Ze {
      constructor(e, r = {}) {
        super(e, r), (this.detail = r.detail);
      }
    };
  });
var to,
  l0 = b(() => {
    Ln();
    to = class extends Ze {
      constructor(e, r = {}) {
        super(e, r),
          (this.inputType = r.inputType),
          (this.data = r.data),
          (this.dataTransfer = r.dataTransfer),
          (this.isComposing = r.isComposing || !1),
          (this.ranges = r.ranges);
      }
    };
  });
var Uy,
  By = b(() => {
    a0();
    Uy = (t) =>
      class extends On {
        constructor(r, n) {
          switch ((super(t), arguments.length)) {
            case 1:
              (this.height = r), (this.width = r);
              break;
            case 2:
              (this.height = n), (this.width = r);
              break;
          }
        }
      };
  });
var Vy,
  mc,
  Ky = b(() => {
    ee();
    Oi();
    Ve();
    (Vy = ({[Oe]: t, [_]: e}, r = null) => {
      La(t[ie], e[I]);
      do {
        let n = $e(t),
          s = n === e ? n : n[I];
        r ? r.insertBefore(t, r[_]) : t.remove(), (t = s);
      } while (t !== e);
    }),
      (mc = class t {
        constructor() {
          (this[Oe] = null),
            (this[_] = null),
            (this.commonAncestorContainer = null);
        }
        insertNode(e) {
          this[_].parentNode.insertBefore(e, this[Oe]);
        }
        selectNode(e) {
          (this[Oe] = e), (this[_] = $e(e));
        }
        selectNodeContents(e) {
          this.selectNode(e), (this.commonAncestorContainer = e);
        }
        surroundContents(e) {
          e.replaceChildren(this.extractContents());
        }
        setStartBefore(e) {
          this[Oe] = e;
        }
        setStartAfter(e) {
          this[Oe] = e.nextSibling;
        }
        setEndBefore(e) {
          this[_] = $e(e.previousSibling);
        }
        setEndAfter(e) {
          this[_] = $e(e);
        }
        cloneContents() {
          let {[Oe]: e, [_]: r} = this,
            n = e.ownerDocument.createDocumentFragment();
          for (; e !== r; )
            n.insertBefore(e.cloneNode(!0), n[_]),
              (e = $e(e)),
              e !== r && (e = e[I]);
          return n;
        }
        deleteContents() {
          Vy(this);
        }
        extractContents() {
          let e = this[Oe].ownerDocument.createDocumentFragment();
          return Vy(this, e), e;
        }
        createContextualFragment(e) {
          let {commonAncestorContainer: r} = this,
            n = "ownerSVGElement" in r,
            s = n ? r.ownerDocument : r,
            i = s.createElement("template");
          i.innerHTML = e;
          let {content: o} = i;
          if (n) {
            let a = [...o.childNodes];
            (o = s.createDocumentFragment()),
              Object.setPrototypeOf(o, Ut.prototype),
              (o.ownerSVGElement = s);
            for (let u of a)
              Object.setPrototypeOf(u, Ut.prototype),
                (u.ownerSVGElement = s),
                o.appendChild(u);
          } else this.selectNode(o);
          return o;
        }
        cloneRange() {
          let e = new t();
          return (e[Oe] = this[Oe]), (e[_] = this[_]), e;
        }
      });
  });
var QT,
  gc,
  Wy = b(() => {
    fe();
    ee();
    (QT = ({nodeType: t}, e) => {
      switch (t) {
        case 1:
          return e & Kd;
        case 3:
          return e & Wd;
        case 8:
          return e & Yd;
        case 4:
          return e & Gd;
      }
      return 0;
    }),
      (gc = class {
        constructor(e, r = Vd) {
          (this.root = e), (this.currentNode = e), (this.whatToShow = r);
          let {[I]: n, [_]: s} = e;
          if (e.nodeType === 9) {
            let {documentElement: o} = e;
            (n = o), (s = o[_]);
          }
          let i = [];
          for (; n !== s; ) QT(n, r) && i.push(n), (n = n[I]);
          this[Re] = {i: 0, nodes: i};
        }
        nextNode() {
          let e = this[Re];
          return (
            (this.currentNode = e.i < e.nodes.length ? e.nodes[e.i++] : null),
            this.currentNode
          );
        }
      });
  });
var Yy,
  Gy,
  Xy,
  bc,
  bt,
  ro = b(() => {
    Yy = Ot(jg(), 1);
    fe();
    ee();
    uu();
    u0();
    qy();
    Ve();
    wn();
    Qa();
    Oi();
    ms();
    Ba();
    Va();
    vr();
    c0();
    kf();
    eu();
    ki();
    Ln();
    Ma();
    l0();
    By();
    An();
    $f();
    Yr();
    Ky();
    xs();
    Wy();
    (Gy = (t, e, r) => {
      let {[I]: n, [_]: s} = e;
      return t.call({ownerDocument: e, [I]: n, [_]: s}, r);
    }),
      (Xy = Lg({}, Db, jy, {
        CustomEvent: As,
        Event: Ze,
        EventTarget: Gr,
        InputEvent: to,
        NamedNodeMap: Ss,
        NodeList: ke,
      })),
      (bc = new WeakMap()),
      (bt = class extends Zr {
        constructor(e) {
          super(null, "#document", 9),
            (this[Je] = {active: !1, registry: null}),
            (this[Qt] = {active: !1, class: null}),
            (this[_t] = zy[e]),
            (this[qr] = null),
            (this[Qs] = null),
            (this[rs] = null),
            (this[ft] = null),
            (this[Ur] = null);
        }
        get defaultView() {
          return (
            bc.has(this) ||
              bc.set(
                this,
                new Proxy(globalThis, {
                  set: (e, r, n) => {
                    switch (r) {
                      case "addEventListener":
                      case "removeEventListener":
                      case "dispatchEvent":
                        this[ts][r] = n;
                        break;
                      default:
                        e[r] = n;
                        break;
                    }
                    return !0;
                  },
                  get: (e, r) => {
                    switch (r) {
                      case "addEventListener":
                      case "removeEventListener":
                      case "dispatchEvent":
                        if (!this[ts]) {
                          let n = (this[ts] = new Gr());
                          (n.dispatchEvent = n.dispatchEvent.bind(n)),
                            (n.addEventListener = n.addEventListener.bind(n)),
                            (n.removeEventListener =
                              n.removeEventListener.bind(n));
                        }
                        return this[ts][r];
                      case "document":
                        return this;
                      case "navigator":
                        return {
                          userAgent:
                            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
                        };
                      case "window":
                        return bc.get(this);
                      case "customElements":
                        return (
                          this[Je].registry || (this[Je] = new Pa(this)),
                          this[Je]
                        );
                      case "performance":
                        return Yy.performance;
                      case "DOMParser":
                        return this[Qs];
                      case "Image":
                        return this[ft] || (this[ft] = Uy(this)), this[ft];
                      case "MutationObserver":
                        return (
                          this[Qt].class || (this[Qt] = new Oa(this)),
                          this[Qt].class
                        );
                    }
                    return (this[rs] && this[rs][r]) || Xy[r] || e[r];
                  },
                })
              ),
            bc.get(this)
          );
        }
        get doctype() {
          let e = this[qr];
          if (e) return e;
          let {firstChild: r} = this;
          return r && r.nodeType === 10 ? (this[qr] = r) : null;
        }
        set doctype(e) {
          if (
            /^([a-z:]+)(\s+system|\s+public(\s+"([^"]+)")?)?(\s+"([^"]+)")?/i.test(
              e
            )
          ) {
            let {$1: r, $4: n, $6: s} = RegExp;
            (this[qr] = new Er(this, r, n, s)), yr(this, this[qr], this[I]);
          }
        }
        get documentElement() {
          return this.firstElementChild;
        }
        get isConnected() {
          return !0;
        }
        _getParent() {
          return this[ts];
        }
        createAttribute(e) {
          return new Ct(this, e);
        }
        createCDATASection(e) {
          return new Xr(this, e);
        }
        createComment(e) {
          return new Jr(this, e);
        }
        createDocumentFragment() {
          return new Nn(this);
        }
        createDocumentType(e, r, n) {
          return new Er(this, e, r, n);
        }
        createElement(e) {
          return new qt(this, e);
        }
        createRange() {
          let e = new mc();
          return (e.commonAncestorContainer = this), e;
        }
        createTextNode(e) {
          return new Nt(this, e);
        }
        createTreeWalker(e, r = -1) {
          return new gc(e, r);
        }
        createNodeIterator(e, r = -1) {
          return this.createTreeWalker(e, r);
        }
        createEvent(e) {
          let r = Pg(e === "Event" ? new Ze("") : new As(""));
          return (
            (r.initEvent = r.initCustomEvent =
              (n, s = !1, i = !1, o) => {
                (r.bubbles = !!s),
                  Ig(r, {
                    type: {value: n},
                    canBubble: {value: s},
                    cancelable: {value: i},
                    detail: {value: o},
                  });
              }),
            r
          );
        }
        cloneNode(e = !1) {
          let {constructor: r, [Je]: n, [qr]: s} = this,
            i = new r();
          if (((i[Je] = n), e)) {
            let o = i[_],
              {childNodes: a} = this;
            for (let {length: u} = a, c = 0; c < u; c++)
              i.insertBefore(a[c].cloneNode(!0), o);
            s && (i[qr] = a[0]);
          }
          return i;
        }
        importNode(e) {
          let r = 1 < arguments.length && !!arguments[1],
            n = e.cloneNode(r),
            {[Je]: s} = this,
            {active: i} = s,
            o = (a) => {
              let {ownerDocument: u, nodeType: c} = a;
              (a.ownerDocument = this),
                i && u !== this && c === 1 && s.upgrade(a);
            };
          if ((o(n), r))
            switch (n.nodeType) {
              case 1:
              case 11: {
                let {[I]: a, [_]: u} = n;
                for (; a !== u; ) a.nodeType === 1 && o(a), (a = a[I]);
                break;
              }
            }
          return n;
        }
        toString() {
          return this.childNodes.join("");
        }
        querySelector(e) {
          return Gy(super.querySelector, this, e);
        }
        querySelectorAll(e) {
          return Gy(super.querySelectorAll, this, e);
        }
        getElementsByTagNameNS(e, r) {
          return this.getElementsByTagName(r);
        }
        createAttributeNS(e, r) {
          return this.createAttribute(r);
        }
        createElementNS(e, r, n) {
          return e === vn ? new Ut(this, r, null) : this.createElement(r, n);
        }
      });
    Ne(
      (Xy.Document = function () {
        Qe();
      }),
      bt
    ).prototype = bt.prototype;
  });
var eA,
  no,
  d0 = b(() => {
    fe();
    ee();
    ve();
    ro();
    Yr();
    vr();
    M();
    (eA = (t, e, r, n) => {
      if (!e && ds.has(r)) {
        let o = ds.get(r);
        return new o(t, r);
      }
      let {
        [Je]: {active: s, registry: i},
      } = t;
      if (s) {
        let o = e ? n.is : r;
        if (i.has(o)) {
          let {Class: a} = i.get(o),
            u = new a(t, r);
          return xr.set(u, {connected: !1}), u;
        }
      }
      return new S(t, r);
    }),
      (no = class extends bt {
        constructor() {
          super("text/html");
        }
        get all() {
          let e = new ke(),
            {[I]: r, [_]: n} = this;
          for (; r !== n; ) {
            switch (r.nodeType) {
              case 1:
                e.push(r);
                break;
            }
            r = r[I];
          }
          return e;
        }
        get head() {
          let {documentElement: e} = this,
            {firstElementChild: r} = e;
          return (
            (!r || r.tagName !== "HEAD") &&
              ((r = this.createElement("head")), e.prepend(r)),
            r
          );
        }
        get body() {
          let {head: e} = this,
            {nextElementSibling: r} = e;
          return (
            (!r || r.tagName !== "BODY") &&
              ((r = this.createElement("body")), e.after(r)),
            r
          );
        }
        get title() {
          let {head: e} = this;
          return e.getElementsByTagName("title").at(0)?.textContent || "";
        }
        set title(e) {
          let {head: r} = this,
            n = r.getElementsByTagName("title").at(0);
          n
            ? (n.textContent = e)
            : (r.insertBefore(
                this.createElement("title"),
                r.firstChild
              ).textContent = e);
        }
        createElement(e, r) {
          let n = !!(r && r.is),
            s = eA(this, n, e, r);
          return n && s.setAttribute("is", r.is), s;
        }
      });
  });
var yc,
  Jy = b(() => {
    ee();
    ro();
    yc = class extends bt {
      constructor() {
        super("image/svg+xml");
      }
      toString() {
        return this[_t].docType + super.toString();
      }
    };
  });
var xc,
  Zy = b(() => {
    ee();
    ro();
    xc = class extends bt {
      constructor() {
        super("text/xml");
      }
      toString() {
        return this[_t].docType + super.toString();
      }
    };
  });
var Qr,
  Qy = b(() => {
    ee();
    Qd();
    d0();
    Jy();
    Zy();
    Qr = class t {
      parseFromString(e, r, n = null) {
        let s = !1,
          i;
        return (
          r === "text/html"
            ? ((s = !0), (i = new no()))
            : r === "image/svg+xml"
            ? (i = new yc())
            : (i = new xc()),
          (i[Qs] = t),
          n && (i[rs] = n),
          s &&
            e === "..." &&
            (e = "<!doctype html><html><head></head><body></body></html>"),
          e ? ka(i, s, e) : i
        );
      }
    };
  });
var yH,
  e2 = b(() => {
    fe();
    ee();
    ve();
    Ve();
    ms();
    Ba();
    Va();
    eu();
    xs();
    d0();
    M();
    Oi();
    ({parse: yH} = JSON);
  });
var t2 = b(() => {
  fe();
});
function tA() {
  Qe();
}
var r2 = b(() => {
  Qy();
  ro();
  uu();
  wn();
  e2();
  uu();
  u0();
  c0();
  Ln();
  Ma();
  l0();
  Yr();
  t2();
  Ne(tA, bt).prototype = bt.prototype;
});
function wc(t, e, r) {
  return et(t, cr(e, r));
}
function en(t, e) {
  return typeof t == "function" ? t(e) : t;
}
function Lr(t) {
  return t.split("-")[0];
}
function Dn(t) {
  return t.split("-")[1];
}
function f0(t) {
  return t === "x" ? "y" : "x";
}
function Sc(t) {
  return t === "y" ? "height" : "width";
}
function Cs(t) {
  return ["top", "bottom"].includes(Lr(t)) ? "y" : "x";
}
function Ec(t) {
  return f0(Cs(t));
}
function s2(t, e, r) {
  r === void 0 && (r = !1);
  let n = Dn(t),
    s = Ec(t),
    i = Sc(s),
    o =
      s === "x"
        ? n === (r ? "end" : "start")
          ? "right"
          : "left"
        : n === "start"
        ? "bottom"
        : "top";
  return e.reference[i] > e.floating[i] && (o = so(o)), [o, so(o)];
}
function i2(t) {
  let e = so(t);
  return [vc(t), e, vc(e)];
}
function vc(t) {
  return t.replace(/start|end/g, (e) => nA[e]);
}
function sA(t, e, r) {
  let n = ["left", "right"],
    s = ["right", "left"],
    i = ["top", "bottom"],
    o = ["bottom", "top"];
  switch (t) {
    case "top":
    case "bottom":
      return r ? (e ? s : n) : e ? n : s;
    case "left":
    case "right":
      return e ? i : o;
    default:
      return [];
  }
}
function o2(t, e, r, n) {
  let s = Dn(t),
    i = sA(Lr(t), r === "start", n);
  return (
    s && ((i = i.map((o) => o + "-" + s)), e && (i = i.concat(i.map(vc)))), i
  );
}
function so(t) {
  return t.replace(/left|right|bottom|top/g, (e) => rA[e]);
}
function iA(t) {
  return {top: 0, right: 0, bottom: 0, left: 0, ...t};
}
function p0(t) {
  return typeof t != "number" ? iA(t) : {top: t, right: t, bottom: t, left: t};
}
function Mn(t) {
  let {x: e, y: r, width: n, height: s} = t;
  return {
    width: n,
    height: s,
    top: r,
    left: e,
    right: e + n,
    bottom: r + s,
    x: e,
    y: r,
  };
}
var n2,
  cr,
  et,
  io,
  oo,
  Nr,
  rA,
  nA,
  Tc = b(() => {
    (n2 = ["top", "right", "bottom", "left"]),
      (cr = Math.min),
      (et = Math.max),
      (io = Math.round),
      (oo = Math.floor),
      (Nr = (t) => ({x: t, y: t})),
      (rA = {left: "right", right: "left", bottom: "top", top: "bottom"}),
      (nA = {start: "end", end: "start"});
  });
function a2(t, e, r) {
  let {reference: n, floating: s} = t,
    i = Cs(e),
    o = Ec(e),
    a = Sc(o),
    u = Lr(e),
    c = i === "y",
    l = n.x + n.width / 2 - s.width / 2,
    d = n.y + n.height / 2 - s.height / 2,
    f = n[a] / 2 - s[a] / 2,
    h;
  switch (u) {
    case "top":
      h = {x: l, y: n.y - s.height};
      break;
    case "bottom":
      h = {x: l, y: n.y + n.height};
      break;
    case "right":
      h = {x: n.x + n.width, y: d};
      break;
    case "left":
      h = {x: n.x - s.width, y: d};
      break;
    default:
      h = {x: n.x, y: n.y};
  }
  switch (Dn(e)) {
    case "start":
      h[o] -= f * (r && c ? -1 : 1);
      break;
    case "end":
      h[o] += f * (r && c ? -1 : 1);
      break;
  }
  return h;
}
async function Rs(t, e) {
  var r;
  e === void 0 && (e = {});
  let {x: n, y: s, platform: i, rects: o, elements: a, strategy: u} = t,
    {
      boundary: c = "clippingAncestors",
      rootBoundary: l = "viewport",
      elementContext: d = "floating",
      altBoundary: f = !1,
      padding: h = 0,
    } = en(e, t),
    p = p0(h),
    g = a[f ? (d === "floating" ? "reference" : "floating") : d],
    x = Mn(
      await i.getClippingRect({
        element:
          (r = await (i.isElement == null ? void 0 : i.isElement(g))) == null ||
          r
            ? g
            : g.contextElement ||
              (await (i.getDocumentElement == null
                ? void 0
                : i.getDocumentElement(a.floating))),
        boundary: c,
        rootBoundary: l,
        strategy: u,
      })
    ),
    y =
      d === "floating"
        ? {x: n, y: s, width: o.floating.width, height: o.floating.height}
        : o.reference,
    A = await (i.getOffsetParent == null
      ? void 0
      : i.getOffsetParent(a.floating)),
    T = (await (i.isElement == null ? void 0 : i.isElement(A)))
      ? (await (i.getScale == null ? void 0 : i.getScale(A))) || {x: 1, y: 1}
      : {x: 1, y: 1},
    O = Mn(
      i.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
            elements: a,
            rect: y,
            offsetParent: A,
            strategy: u,
          })
        : y
    );
  return {
    top: (x.top - O.top + p.top) / T.y,
    bottom: (O.bottom - x.bottom + p.bottom) / T.y,
    left: (x.left - O.left + p.left) / T.x,
    right: (O.right - x.right + p.right) / T.x,
  };
}
function u2(t, e) {
  return {
    top: t.top - e.height,
    right: t.right - e.width,
    bottom: t.bottom - e.height,
    left: t.left - e.width,
  };
}
function c2(t) {
  return n2.some((e) => t[e] >= 0);
}
async function oA(t, e) {
  let {placement: r, platform: n, elements: s} = t,
    i = await (n.isRTL == null ? void 0 : n.isRTL(s.floating)),
    o = Lr(r),
    a = Dn(r),
    u = Cs(r) === "y",
    c = ["left", "top"].includes(o) ? -1 : 1,
    l = i && u ? -1 : 1,
    d = en(e, t),
    {
      mainAxis: f,
      crossAxis: h,
      alignmentAxis: p,
    } = typeof d == "number"
      ? {mainAxis: d, crossAxis: 0, alignmentAxis: null}
      : {mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...d};
  return (
    a && typeof p == "number" && (h = a === "end" ? p * -1 : p),
    u ? {x: h * l, y: f * c} : {x: f * c, y: h * l}
  );
}
var l2,
  d2,
  f2,
  p2,
  h2,
  m2,
  g2,
  b2 = b(() => {
    Tc();
    Tc();
    l2 = async (t, e, r) => {
      let {
          placement: n = "bottom",
          strategy: s = "absolute",
          middleware: i = [],
          platform: o,
        } = r,
        a = i.filter(Boolean),
        u = await (o.isRTL == null ? void 0 : o.isRTL(e)),
        c = await o.getElementRects({reference: t, floating: e, strategy: s}),
        {x: l, y: d} = a2(c, n, u),
        f = n,
        h = {},
        p = 0;
      for (let m = 0; m < a.length; m++) {
        let {name: g, fn: x} = a[m],
          {
            x: y,
            y: A,
            data: T,
            reset: O,
          } = await x({
            x: l,
            y: d,
            initialPlacement: n,
            placement: f,
            strategy: s,
            middlewareData: h,
            rects: c,
            platform: o,
            elements: {reference: t, floating: e},
          });
        (l = y ?? l),
          (d = A ?? d),
          (h = {...h, [g]: {...h[g], ...T}}),
          O &&
            p <= 50 &&
            (p++,
            typeof O == "object" &&
              (O.placement && (f = O.placement),
              O.rects &&
                (c =
                  O.rects === !0
                    ? await o.getElementRects({
                        reference: t,
                        floating: e,
                        strategy: s,
                      })
                    : O.rects),
              ({x: l, y: d} = a2(c, f, u))),
            (m = -1));
      }
      return {x: l, y: d, placement: f, strategy: s, middlewareData: h};
    };
    (d2 = (t) => ({
      name: "arrow",
      options: t,
      async fn(e) {
        let {
            x: r,
            y: n,
            placement: s,
            rects: i,
            platform: o,
            elements: a,
            middlewareData: u,
          } = e,
          {element: c, padding: l = 0} = en(t, e) || {};
        if (c == null) return {};
        let d = p0(l),
          f = {x: r, y: n},
          h = Ec(s),
          p = Sc(h),
          m = await o.getDimensions(c),
          g = h === "y",
          x = g ? "top" : "left",
          y = g ? "bottom" : "right",
          A = g ? "clientHeight" : "clientWidth",
          T = i.reference[p] + i.reference[h] - f[h] - i.floating[p],
          O = f[h] - i.reference[h],
          C = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c)),
          w = C ? C[A] : 0;
        (!w || !(await (o.isElement == null ? void 0 : o.isElement(C)))) &&
          (w = a.floating[A] || i.floating[p]);
        let k = T / 2 - O / 2,
          D = w / 2 - m[p] / 2 - 1,
          te = cr(d[x], D),
          F = cr(d[y], D),
          K = te,
          le = w - m[p] - F,
          G = w / 2 - m[p] / 2 + k,
          ne = wc(K, G, le),
          Le =
            !u.arrow &&
            Dn(s) != null &&
            G !== ne &&
            i.reference[p] / 2 - (G < K ? te : F) - m[p] / 2 < 0,
          He = Le ? (G < K ? G - K : G - le) : 0;
        return {
          [h]: f[h] + He,
          data: {
            [h]: ne,
            centerOffset: G - ne - He,
            ...(Le && {alignmentOffset: He}),
          },
          reset: Le,
        };
      },
    })),
      (f2 = function (t) {
        return (
          t === void 0 && (t = {}),
          {
            name: "flip",
            options: t,
            async fn(e) {
              var r, n;
              let {
                  placement: s,
                  middlewareData: i,
                  rects: o,
                  initialPlacement: a,
                  platform: u,
                  elements: c,
                } = e,
                {
                  mainAxis: l = !0,
                  crossAxis: d = !0,
                  fallbackPlacements: f,
                  fallbackStrategy: h = "bestFit",
                  fallbackAxisSideDirection: p = "none",
                  flipAlignment: m = !0,
                  ...g
                } = en(t, e);
              if ((r = i.arrow) != null && r.alignmentOffset) return {};
              let x = Lr(s),
                y = Lr(a) === a,
                A = await (u.isRTL == null ? void 0 : u.isRTL(c.floating)),
                T = f || (y || !m ? [so(a)] : i2(a));
              !f && p !== "none" && T.push(...o2(a, m, p, A));
              let O = [a, ...T],
                C = await Rs(e, g),
                w = [],
                k = ((n = i.flip) == null ? void 0 : n.overflows) || [];
              if ((l && w.push(C[x]), d)) {
                let K = s2(s, o, A);
                w.push(C[K[0]], C[K[1]]);
              }
              if (
                ((k = [...k, {placement: s, overflows: w}]),
                !w.every((K) => K <= 0))
              ) {
                var D, te;
                let K = (((D = i.flip) == null ? void 0 : D.index) || 0) + 1,
                  le = O[K];
                if (le)
                  return {
                    data: {index: K, overflows: k},
                    reset: {placement: le},
                  };
                let G =
                  (te = k
                    .filter((ne) => ne.overflows[0] <= 0)
                    .sort((ne, Le) => ne.overflows[1] - Le.overflows[1])[0]) ==
                  null
                    ? void 0
                    : te.placement;
                if (!G)
                  switch (h) {
                    case "bestFit": {
                      var F;
                      let ne =
                        (F = k
                          .map((Le) => [
                            Le.placement,
                            Le.overflows
                              .filter((He) => He > 0)
                              .reduce((He, Xc) => He + Xc, 0),
                          ])
                          .sort((Le, He) => Le[1] - He[1])[0]) == null
                          ? void 0
                          : F[0];
                      ne && (G = ne);
                      break;
                    }
                    case "initialPlacement":
                      G = a;
                      break;
                  }
                if (s !== G) return {reset: {placement: G}};
              }
              return {};
            },
          }
        );
      });
    p2 = function (t) {
      return (
        t === void 0 && (t = {}),
        {
          name: "hide",
          options: t,
          async fn(e) {
            let {rects: r} = e,
              {strategy: n = "referenceHidden", ...s} = en(t, e);
            switch (n) {
              case "referenceHidden": {
                let i = await Rs(e, {...s, elementContext: "reference"}),
                  o = u2(i, r.reference);
                return {
                  data: {referenceHiddenOffsets: o, referenceHidden: c2(o)},
                };
              }
              case "escaped": {
                let i = await Rs(e, {...s, altBoundary: !0}),
                  o = u2(i, r.floating);
                return {data: {escapedOffsets: o, escaped: c2(o)}};
              }
              default:
                return {};
            }
          },
        }
      );
    };
    (h2 = function (t) {
      return (
        t === void 0 && (t = 0),
        {
          name: "offset",
          options: t,
          async fn(e) {
            var r, n;
            let {x: s, y: i, placement: o, middlewareData: a} = e,
              u = await oA(e, t);
            return o === ((r = a.offset) == null ? void 0 : r.placement) &&
              (n = a.arrow) != null &&
              n.alignmentOffset
              ? {}
              : {x: s + u.x, y: i + u.y, data: {...u, placement: o}};
          },
        }
      );
    }),
      (m2 = function (t) {
        return (
          t === void 0 && (t = {}),
          {
            name: "shift",
            options: t,
            async fn(e) {
              let {x: r, y: n, placement: s} = e,
                {
                  mainAxis: i = !0,
                  crossAxis: o = !1,
                  limiter: a = {
                    fn: (g) => {
                      let {x, y} = g;
                      return {x, y};
                    },
                  },
                  ...u
                } = en(t, e),
                c = {x: r, y: n},
                l = await Rs(e, u),
                d = Cs(Lr(s)),
                f = f0(d),
                h = c[f],
                p = c[d];
              if (i) {
                let g = f === "y" ? "top" : "left",
                  x = f === "y" ? "bottom" : "right",
                  y = h + l[g],
                  A = h - l[x];
                h = wc(y, h, A);
              }
              if (o) {
                let g = d === "y" ? "top" : "left",
                  x = d === "y" ? "bottom" : "right",
                  y = p + l[g],
                  A = p - l[x];
                p = wc(y, p, A);
              }
              let m = a.fn({...e, [f]: h, [d]: p});
              return {...m, data: {x: m.x - r, y: m.y - n}};
            },
          }
        );
      }),
      (g2 = function (t) {
        return (
          t === void 0 && (t = {}),
          {
            name: "size",
            options: t,
            async fn(e) {
              let {placement: r, rects: n, platform: s, elements: i} = e,
                {apply: o = () => {}, ...a} = en(t, e),
                u = await Rs(e, a),
                c = Lr(r),
                l = Dn(r),
                d = Cs(r) === "y",
                {width: f, height: h} = n.floating,
                p,
                m;
              c === "top" || c === "bottom"
                ? ((p = c),
                  (m =
                    l ===
                    ((await (s.isRTL == null ? void 0 : s.isRTL(i.floating)))
                      ? "start"
                      : "end")
                      ? "left"
                      : "right"))
                : ((m = c), (p = l === "end" ? "top" : "bottom"));
              let g = h - u[p],
                x = f - u[m],
                y = !e.middlewareData.shift,
                A = g,
                T = x;
              if (d) {
                let C = f - u.left - u.right;
                T = l || y ? cr(x, C) : C;
              } else {
                let C = h - u.top - u.bottom;
                A = l || y ? cr(g, C) : C;
              }
              if (y && !l) {
                let C = et(u.left, 0),
                  w = et(u.right, 0),
                  k = et(u.top, 0),
                  D = et(u.bottom, 0);
                d
                  ? (T =
                      f -
                      2 * (C !== 0 || w !== 0 ? C + w : et(u.left, u.right)))
                  : (A =
                      h -
                      2 * (k !== 0 || D !== 0 ? k + D : et(u.top, u.bottom)));
              }
              await o({...e, availableWidth: T, availableHeight: A});
              let O = await s.getDimensions(i.floating);
              return f !== O.width || h !== O.height
                ? {reset: {rects: !0}}
                : {};
            },
          }
        );
      });
  });
function Pr(t) {
  return x2(t) ? (t.nodeName || "").toLowerCase() : "#document";
}
function ut(t) {
  var e;
  return (
    (t == null || (e = t.ownerDocument) == null ? void 0 : e.defaultView) ||
    window
  );
}
function lr(t) {
  var e;
  return (e = (x2(t) ? t.ownerDocument : t.document) || window.document) == null
    ? void 0
    : e.documentElement;
}
function x2(t) {
  return t instanceof Node || t instanceof ut(t).Node;
}
function dr(t) {
  return t instanceof Element || t instanceof ut(t).Element;
}
function Kt(t) {
  return t instanceof HTMLElement || t instanceof ut(t).HTMLElement;
}
function y2(t) {
  return typeof ShadowRoot > "u"
    ? !1
    : t instanceof ShadowRoot || t instanceof ut(t).ShadowRoot;
}
function Ls(t) {
  let {overflow: e, overflowX: r, overflowY: n, display: s} = yt(t);
  return (
    /auto|scroll|overlay|hidden|clip/.test(e + n + r) &&
    !["inline", "contents"].includes(s)
  );
}
function v2(t) {
  return ["table", "td", "th"].includes(Pr(t));
}
function Ac(t) {
  let e = Cc(),
    r = yt(t);
  return (
    r.transform !== "none" ||
    r.perspective !== "none" ||
    (r.containerType ? r.containerType !== "normal" : !1) ||
    (!e && (r.backdropFilter ? r.backdropFilter !== "none" : !1)) ||
    (!e && (r.filter ? r.filter !== "none" : !1)) ||
    ["transform", "perspective", "filter"].some((n) =>
      (r.willChange || "").includes(n)
    ) ||
    ["paint", "layout", "strict", "content"].some((n) =>
      (r.contain || "").includes(n)
    )
  );
}
function w2(t) {
  let e = _n(t);
  for (; Kt(e) && !ao(e); ) {
    if (Ac(e)) return e;
    e = _n(e);
  }
  return null;
}
function Cc() {
  return typeof CSS > "u" || !CSS.supports
    ? !1
    : CSS.supports("-webkit-backdrop-filter", "none");
}
function ao(t) {
  return ["html", "body", "#document"].includes(Pr(t));
}
function yt(t) {
  return ut(t).getComputedStyle(t);
}
function uo(t) {
  return dr(t)
    ? {scrollLeft: t.scrollLeft, scrollTop: t.scrollTop}
    : {scrollLeft: t.pageXOffset, scrollTop: t.pageYOffset};
}
function _n(t) {
  if (Pr(t) === "html") return t;
  let e = t.assignedSlot || t.parentNode || (y2(t) && t.host) || lr(t);
  return y2(e) ? e.host : e;
}
function S2(t) {
  let e = _n(t);
  return ao(e)
    ? t.ownerDocument
      ? t.ownerDocument.body
      : t.body
    : Kt(e) && Ls(e)
    ? e
    : S2(e);
}
function Ns(t, e, r) {
  var n;
  e === void 0 && (e = []), r === void 0 && (r = !0);
  let s = S2(t),
    i = s === ((n = t.ownerDocument) == null ? void 0 : n.body),
    o = ut(s);
  return i
    ? e.concat(
        o,
        o.visualViewport || [],
        Ls(s) ? s : [],
        o.frameElement && r ? Ns(o.frameElement) : []
      )
    : e.concat(s, Ns(s, [], r));
}
var E2 = b(() => {});
function C2(t) {
  let e = yt(t),
    r = parseFloat(e.width) || 0,
    n = parseFloat(e.height) || 0,
    s = Kt(t),
    i = s ? t.offsetWidth : r,
    o = s ? t.offsetHeight : n,
    a = io(r) !== i || io(n) !== o;
  return a && ((r = i), (n = o)), {width: r, height: n, $: a};
}
function h0(t) {
  return dr(t) ? t : t.contextElement;
}
function Ps(t) {
  let e = h0(t);
  if (!Kt(e)) return Nr(1);
  let r = e.getBoundingClientRect(),
    {width: n, height: s, $: i} = C2(e),
    o = (i ? io(r.width) : r.width) / n,
    a = (i ? io(r.height) : r.height) / s;
  return (
    (!o || !Number.isFinite(o)) && (o = 1),
    (!a || !Number.isFinite(a)) && (a = 1),
    {x: o, y: a}
  );
}
function R2(t) {
  let e = ut(t);
  return !Cc() || !e.visualViewport
    ? aA
    : {x: e.visualViewport.offsetLeft, y: e.visualViewport.offsetTop};
}
function uA(t, e, r) {
  return e === void 0 && (e = !1), !r || (e && r !== ut(t)) ? !1 : e;
}
function $n(t, e, r, n) {
  e === void 0 && (e = !1), r === void 0 && (r = !1);
  let s = t.getBoundingClientRect(),
    i = h0(t),
    o = Nr(1);
  e && (n ? dr(n) && (o = Ps(n)) : (o = Ps(t)));
  let a = uA(i, r, n) ? R2(i) : Nr(0),
    u = (s.left + a.x) / o.x,
    c = (s.top + a.y) / o.y,
    l = s.width / o.x,
    d = s.height / o.y;
  if (i) {
    let f = ut(i),
      h = n && dr(n) ? ut(n) : n,
      p = f,
      m = p.frameElement;
    for (; m && n && h !== p; ) {
      let g = Ps(m),
        x = m.getBoundingClientRect(),
        y = yt(m),
        A = x.left + (m.clientLeft + parseFloat(y.paddingLeft)) * g.x,
        T = x.top + (m.clientTop + parseFloat(y.paddingTop)) * g.y;
      (u *= g.x),
        (c *= g.y),
        (l *= g.x),
        (d *= g.y),
        (u += A),
        (c += T),
        (p = ut(m)),
        (m = p.frameElement);
    }
  }
  return Mn({width: l, height: d, x: u, y: c});
}
function N2(t) {
  return cA.some((e) => {
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  });
}
function lA(t) {
  let {elements: e, rect: r, offsetParent: n, strategy: s} = t,
    i = s === "fixed",
    o = lr(n),
    a = e ? N2(e.floating) : !1;
  if (n === o || (a && i)) return r;
  let u = {scrollLeft: 0, scrollTop: 0},
    c = Nr(1),
    l = Nr(0),
    d = Kt(n);
  if (
    (d || (!d && !i)) &&
    ((Pr(n) !== "body" || Ls(o)) && (u = uo(n)), Kt(n))
  ) {
    let f = $n(n);
    (c = Ps(n)), (l.x = f.x + n.clientLeft), (l.y = f.y + n.clientTop);
  }
  return {
    width: r.width * c.x,
    height: r.height * c.y,
    x: r.x * c.x - u.scrollLeft * c.x + l.x,
    y: r.y * c.y - u.scrollTop * c.y + l.y,
  };
}
function dA(t) {
  return Array.from(t.getClientRects());
}
function L2(t) {
  return $n(lr(t)).left + uo(t).scrollLeft;
}
function fA(t) {
  let e = lr(t),
    r = uo(t),
    n = t.ownerDocument.body,
    s = et(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth),
    i = et(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight),
    o = -r.scrollLeft + L2(t),
    a = -r.scrollTop;
  return (
    yt(n).direction === "rtl" && (o += et(e.clientWidth, n.clientWidth) - s),
    {width: s, height: i, x: o, y: a}
  );
}
function pA(t, e) {
  let r = ut(t),
    n = lr(t),
    s = r.visualViewport,
    i = n.clientWidth,
    o = n.clientHeight,
    a = 0,
    u = 0;
  if (s) {
    (i = s.width), (o = s.height);
    let c = Cc();
    (!c || (c && e === "fixed")) && ((a = s.offsetLeft), (u = s.offsetTop));
  }
  return {width: i, height: o, x: a, y: u};
}
function hA(t, e) {
  let r = $n(t, !0, e === "fixed"),
    n = r.top + t.clientTop,
    s = r.left + t.clientLeft,
    i = Kt(t) ? Ps(t) : Nr(1),
    o = t.clientWidth * i.x,
    a = t.clientHeight * i.y,
    u = s * i.x,
    c = n * i.y;
  return {width: o, height: a, x: u, y: c};
}
function T2(t, e, r) {
  let n;
  if (e === "viewport") n = pA(t, r);
  else if (e === "document") n = fA(lr(t));
  else if (dr(e)) n = hA(e, r);
  else {
    let s = R2(t);
    n = {...e, x: e.x - s.x, y: e.y - s.y};
  }
  return Mn(n);
}
function P2(t, e) {
  let r = _n(t);
  return r === e || !dr(r) || ao(r)
    ? !1
    : yt(r).position === "fixed" || P2(r, e);
}
function mA(t, e) {
  let r = e.get(t);
  if (r) return r;
  let n = Ns(t, [], !1).filter((a) => dr(a) && Pr(a) !== "body"),
    s = null,
    i = yt(t).position === "fixed",
    o = i ? _n(t) : t;
  for (; dr(o) && !ao(o); ) {
    let a = yt(o),
      u = Ac(o);
    !u && a.position === "fixed" && (s = null),
      (
        i
          ? !u && !s
          : (!u &&
              a.position === "static" &&
              !!s &&
              ["absolute", "fixed"].includes(s.position)) ||
            (Ls(o) && !u && P2(t, o))
      )
        ? (n = n.filter((l) => l !== o))
        : (s = a),
      (o = _n(o));
  }
  return e.set(t, n), n;
}
function gA(t) {
  let {element: e, boundary: r, rootBoundary: n, strategy: s} = t,
    o = [...(r === "clippingAncestors" ? mA(e, this._c) : [].concat(r)), n],
    a = o[0],
    u = o.reduce((c, l) => {
      let d = T2(e, l, s);
      return (
        (c.top = et(d.top, c.top)),
        (c.right = cr(d.right, c.right)),
        (c.bottom = cr(d.bottom, c.bottom)),
        (c.left = et(d.left, c.left)),
        c
      );
    }, T2(e, a, s));
  return {
    width: u.right - u.left,
    height: u.bottom - u.top,
    x: u.left,
    y: u.top,
  };
}
function bA(t) {
  let {width: e, height: r} = C2(t);
  return {width: e, height: r};
}
function yA(t, e, r) {
  let n = Kt(e),
    s = lr(e),
    i = r === "fixed",
    o = $n(t, !0, i, e),
    a = {scrollLeft: 0, scrollTop: 0},
    u = Nr(0);
  if (n || (!n && !i))
    if (((Pr(e) !== "body" || Ls(s)) && (a = uo(e)), n)) {
      let d = $n(e, !0, i, e);
      (u.x = d.x + e.clientLeft), (u.y = d.y + e.clientTop);
    } else s && (u.x = L2(s));
  let c = o.left + a.scrollLeft - u.x,
    l = o.top + a.scrollTop - u.y;
  return {x: c, y: l, width: o.width, height: o.height};
}
function A2(t, e) {
  return !Kt(t) || yt(t).position === "fixed"
    ? null
    : e
    ? e(t)
    : t.offsetParent;
}
function I2(t, e) {
  let r = ut(t);
  if (!Kt(t) || N2(t)) return r;
  let n = A2(t, e);
  for (; n && v2(n) && yt(n).position === "static"; ) n = A2(n, e);
  return n &&
    (Pr(n) === "html" ||
      (Pr(n) === "body" && yt(n).position === "static" && !Ac(n)))
    ? r
    : n || w2(t) || r;
}
function vA(t) {
  return yt(t).direction === "rtl";
}
function wA(t, e) {
  let r = null,
    n,
    s = lr(t);
  function i() {
    var a;
    clearTimeout(n), (a = r) == null || a.disconnect(), (r = null);
  }
  function o(a, u) {
    a === void 0 && (a = !1), u === void 0 && (u = 1), i();
    let {left: c, top: l, width: d, height: f} = t.getBoundingClientRect();
    if ((a || e(), !d || !f)) return;
    let h = oo(l),
      p = oo(s.clientWidth - (c + d)),
      m = oo(s.clientHeight - (l + f)),
      g = oo(c),
      y = {
        rootMargin: -h + "px " + -p + "px " + -m + "px " + -g + "px",
        threshold: et(0, cr(1, u)) || 1,
      },
      A = !0;
    function T(O) {
      let C = O[0].intersectionRatio;
      if (C !== u) {
        if (!A) return o();
        C
          ? o(!1, C)
          : (n = setTimeout(() => {
              o(!1, 1e-7);
            }, 1e3));
      }
      A = !1;
    }
    try {
      r = new IntersectionObserver(T, {...y, root: s.ownerDocument});
    } catch {
      r = new IntersectionObserver(T, y);
    }
    r.observe(t);
  }
  return o(!0), i;
}
function k2(t, e, r, n) {
  n === void 0 && (n = {});
  let {
      ancestorScroll: s = !0,
      ancestorResize: i = !0,
      elementResize: o = typeof ResizeObserver == "function",
      layoutShift: a = typeof IntersectionObserver == "function",
      animationFrame: u = !1,
    } = n,
    c = h0(t),
    l = s || i ? [...(c ? Ns(c) : []), ...Ns(e)] : [];
  l.forEach((x) => {
    s && x.addEventListener("scroll", r, {passive: !0}),
      i && x.addEventListener("resize", r);
  });
  let d = c && a ? wA(c, r) : null,
    f = -1,
    h = null;
  o &&
    ((h = new ResizeObserver((x) => {
      let [y] = x;
      y &&
        y.target === c &&
        h &&
        (h.unobserve(e),
        cancelAnimationFrame(f),
        (f = requestAnimationFrame(() => {
          var A;
          (A = h) == null || A.observe(e);
        }))),
        r();
    })),
    c && !u && h.observe(c),
    h.observe(e));
  let p,
    m = u ? $n(t) : null;
  u && g();
  function g() {
    let x = $n(t);
    m &&
      (x.x !== m.x ||
        x.y !== m.y ||
        x.width !== m.width ||
        x.height !== m.height) &&
      r(),
      (m = x),
      (p = requestAnimationFrame(g));
  }
  return (
    r(),
    () => {
      var x;
      l.forEach((y) => {
        s && y.removeEventListener("scroll", r),
          i && y.removeEventListener("resize", r);
      }),
        d?.(),
        (x = h) == null || x.disconnect(),
        (h = null),
        u && cancelAnimationFrame(p);
    }
  );
}
var aA,
  cA,
  xA,
  m0,
  O2,
  D2,
  M2,
  _2,
  $2,
  F2,
  H2,
  j2 = b(() => {
    b2();
    Tc();
    E2();
    aA = Nr(0);
    cA = [":popover-open", ":modal"];
    xA = async function (t) {
      let e = this.getOffsetParent || I2,
        r = this.getDimensions,
        n = await r(t.floating);
      return {
        reference: yA(t.reference, await e(t.floating), t.strategy),
        floating: {x: 0, y: 0, width: n.width, height: n.height},
      };
    };
    m0 = {
      convertOffsetParentRelativeRectToViewportRelativeRect: lA,
      getDocumentElement: lr,
      getClippingRect: gA,
      getOffsetParent: I2,
      getElementRects: xA,
      getClientRects: dA,
      getDimensions: bA,
      getScale: Ps,
      isElement: dr,
      isRTL: vA,
    };
    (O2 = h2),
      (D2 = m2),
      (M2 = f2),
      (_2 = g2),
      ($2 = p2),
      (F2 = d2),
      (H2 = (t, e, r) => {
        let n = new Map(),
          s = {platform: m0, ...r},
          i = {...s.platform, _c: n};
        return l2(t, e, {...s, platform: i});
      });
  });
function b0(t, e, r) {
  if (ze) return V(t, r);
  if (pe.context) {
    let [n, s] = V(t, r);
    return [n, s];
  }
  return V(e(), r);
}
var z2,
  q2,
  g0,
  U2 = b(() => {
    Bn();
    Vn();
    (z2 = !ze), (q2 = z2 && !!Lo), (g0 = q2 ? (t) => (sn() ? se(t) : t) : se);
  });
var y0 = b(() => {
  U2();
});
function V2(t, e, r, n) {
  return (
    t.addEventListener(e, r, n), g0(t.removeEventListener.bind(t, e, r, n))
  );
}
var K2 = b(() => {
  y0();
});
function NA(t, e = sn()) {
  let r = 0,
    n,
    s;
  return () => (
    r++,
    se(() => {
      r--,
        queueMicrotask(() => {
          !r && s && (s(), (s = n = void 0));
        });
    }),
    s || qn((i) => (n = t((s = i))), e),
    n
  );
}
function W2(t) {
  let e = sn(),
    r = NA(t, e);
  return () => (ze || pe.context ? qn(t, e) : r());
}
var G2 = b(() => {
  Bn();
  Vn();
});
function co(t, e = !1) {
  if (ze) return () => e;
  let r = window.matchMedia(t),
    [n, s] = b0(e, () => r.matches);
  return V2(r, "change", () => s(r.matches)), n;
}
function LA(t) {
  return co("(prefers-color-scheme: dark)", t);
}
var _j,
  Y2 = b(() => {
    Vn();
    K2();
    y0();
    G2();
    _j = W2(LA.bind(void 0, !1));
  });
var iv = {};
vt(iv, {
  $: () => Os,
  H: () => rv,
  _: () => SR,
  a: () => mo,
  b: () => k0,
  c: () => FA,
  d: () => Ax,
  e: () => Tx,
  f: () => jA,
  g: () => Cx,
  h: () => E0,
  i: () => _A,
  j: () => MA,
  k: () => $A,
  l: () => DA,
  m: () => Lx,
  n: () => H0,
  o: () => j0,
});
function kA(t) {
  let e = new Map();
  return (
    t.items.forEach((r) => {
      e.set(r.ID, r);
    }),
    t.items.forEach((r) => {
      if (Number(r.menu_item_parent) != 0) {
        let n = e.get(Number(r.menu_item_parent));
        n && (n.children || (n.children = []), n.children.push(r));
      }
    }),
    (t.featured_items = t.items.filter((r) => r.is_featured)),
    (t.non_featured_items = t.items.filter((r) => !r.is_featured)),
    (t.items = t.items.filter((r) => Number(r.menu_item_parent) == 0)),
    t
  );
}
function mo(t) {
  let e = `<div id="absolutizeWrapper">${t}</div>`,
    r = new Qr().parseFromString(e, "text/html"),
    n = Array.from(r.querySelectorAll("img")),
    s = "https://bieldev.wpengine.com";
  return (
    n.forEach((a) => {
      s.split("//")?.[1];
      let u = a.src,
        c = a.srcset;
      function l(f) {
        return !1;
      }
      function d(f) {
        return f.startsWith("/wp-content");
      }
      (l(a.src) || d(a.src)) &&
        (a.setAttribute("loading", "lazy"),
        a.setAttribute("src", `${u}`),
        a.setAttribute("srcset", c.replaceAll("https", "http")));
    }),
    OA(r),
    r.querySelector("#absolutizeWrapper")?.innerHTML || ""
  );
}
function OA(t) {
  let e = "https://bieldev.wpengine.com";
  t.querySelectorAll("a[href]"),
    t.querySelectorAll(`a[href^="${e}"]`).forEach((n) => {
      let s = n.href.replace(e, "");
      n.setAttribute("href", s);
    });
}
function DA({targetLang: t, sectionToAdd: e}) {
  let r = null;
  return (
    e &&
      (t == "en"
        ? (r = e)
        : (r = e.translations.find((n) => n.languageCode == t) || e)),
    r
  );
}
function MA({dom: t, additionalStyles: e}) {
  let n = [
    "generateblocks-inline-css",
    "global-styles-inline-css",
    "generate-style-inline-css",
  ].map((s) => {
    let i = t.querySelector(`#${s}`);
    return i ? i.innerHTML : "";
  });
  return (
    e &&
      e.forEach((s) => {
        s && n.push(...s);
      }),
    n
  );
}
function _A({nonHiddenLanguages: t, pagesByLangCode: e}) {
  return Object.keys(e).reduce((n, s) => {
    if (t.has(s)) {
      let o = e[s];
      o && (n[s] = o);
    }
    return n;
  }, {});
}
function $A({otherLanguages: t, englishPagesDict: e}) {
  return Object.values(t)
    .map((n) =>
      Object.values(n).map((i) => {
        let o = e[i.translationOfId];
        return (
          o?.inlineStyles && (i.inlineStyles = o.inlineStyles),
          {pageId: i.databaseId, page: i}
        );
      })
    )
    .flat();
}
async function FA() {
  let t = `
    query homePage {
      page(id: "/", idType: URI) {
        title
        link
        editorBlocks(flat:true) {
          ${go}
         }
      }
    }
  `;
  return (
    await (
      await fetch("https://bieldev.wpengine.com/index.php?graphql", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({query: t}),
      })
    ).json()
  ).data;
}
async function HA(t, e) {
  let r = `
    query allPagesThisLang($lang: String!) {
      pages(where: {language: $lang}, first: 100) {
        nodes {
          databaseId
          uri
        }
      }
    }
  `;
  t.includes("home") && (t = "/");
  let n = "https://bieldev.wpengine.com/index.php?graphql",
    o = (
      await (
        await fetch(n, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({query: r, variables: {lang: e}}),
        })
      ).json()
    ).data.pages.nodes.find((f) => f.uri == (t == "/" ? "/" : `/${t}/`));
  if (!o) return;
  let a = `
    query pageQuery($id: ID!) {
      page(id: $id, idType: DATABASE_ID) {
        databaseId
        slug
        title
        modified
        status
        parentDatabaseId
        link
        languageCode
        uri
        pageOptions {
          topBlurb
        }
        editorBlocks(flat:true) {
         ${go}
        }
        translations {
          editorBlocks(flat:true) {
            ${go}
           }
          title(format: RENDERED)
          databaseId
          slug
          status
          link
          languageCode
          uri
          modified
          parentDatabaseId
        }
      }
    }
  `,
    c = await (
      await fetch(n, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({query: a, variables: {id: o.databaseId}}),
      })
    ).json(),
    {page: l} = c.data;
  (l.isHomePage = l.uri == "/"),
    (l.isTranslationPage =
      l.title.toLowerCase() == "translations" ||
      l.translations.some((f) => f.title.toLowerCase() == "translations"));
  let d = {};
  return (
    l.translations.forEach((f) => {
      d[f.languageCode] = f.uri;
    }),
    (l.otherVersions = d),
    l.translations.forEach((f) => {
      let h = {};
      l.translations.forEach((p) => {
        h[p.languageCode] = p.uri;
      }),
        (h.en = l.uri),
        (f.translationOfId = l.databaseId),
        (f.otherVersions = h),
        (f.isHomePage = l.uri == "/"),
        (f.isTranslationPage = l.isTranslationPage),
        l.isTranslationPage;
    }),
    l
  );
}
async function jA() {
  let t = `
    query allPages {
      pages(first: 100, where: {language: "en"}) {
        nodes {
          databaseId
          slug
          title
          modified
          status
          parentDatabaseId
          link
          languageCode
          uri
          pageOptions {
            topBlurb
          }
          editorBlocks(flat:true) {
           ${go}
          }
          translations {
            editorBlocks(flat:true) {
              ${go}
             }
            title(format: RENDERED)
            databaseId
            slug
            status
            link
            languageCode
            uri
            modified
            parentDatabaseId
          }
        }
      }
    }
  `,
    n = await (
      await fetch("https://bieldev.wpengine.com/index.php?graphql", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({query: t}),
      })
    ).json(),
    {pages: s} = n.data;
  if (!n) throw new Error("could not fetch");
  let i = {en: {}};
  for (let o = 0; o < s.nodes.length; o++) {
    let a = s.nodes[o];
    if (!a) continue;
    (a.isHomePage = a.uri == "/"),
      (a.isTranslationPage = a.title.toLowerCase() == "translations");
    let u = {};
    a.translations.forEach((d) => {
      u[d.languageCode] = String(d.databaseId);
    }),
      (a.otherVersions = u);
    let {translations: c, ...l} = a;
    i.en && (i.en[l.databaseId] = l),
      c.forEach((d) => {
        let f = {};
        c.forEach((p) => {
          f[p.languageCode] = String(p.databaseId);
        }),
          (f.en = String(l.databaseId)),
          (d.translationOfId = l.databaseId),
          (d.otherVersions = f),
          i[d.languageCode] || (i[d.languageCode] = {}),
          (d.isHomePage = l.uri == "/"),
          (d.isTranslationPage = l.isTranslationPage),
          l.uri == "/" && (d.uri = `/${d.languageCode}`);
        let h = i[d.languageCode];
        h && (h[d.databaseId] = d);
      });
  }
  return {pagesByLangCode: i};
}
async function Tx() {
  return (
    await (
      await fetch("https://bieldev.wpengine.com/index.php?graphql", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          query: `
    query langs {
      languages {
        code
        country_flag_url
        language_code
        native_name
        translated_name
      }
    }
  `,
        }),
      })
    ).json()
  ).data.languages.reduce((i, o) => ((i[o.code] = o), i), {});
}
async function Ax() {
  let r = await (
    await fetch(
      "https://bieldev.wpengine.com/wp-json/custom/v1/menus?menus_to_fetch[]=header-menu",
      {headers: {"Content-Type": "application/json"}}
    )
  ).json();
  return (
    Object.keys(r).forEach((n) => {
      let s = r[n];
      s &&
        Object.keys(s).forEach((i) => {
          let o = s[i];
          if (o) {
            let a = kA(o);
            s[i] = a;
          }
        });
    }),
    r
  );
}
async function E0(t, e) {
  let r = `
    query getGlobal {
      global(id: "${t}", idType: SLUG) {
        content(format: RENDERED)
        uri
        link
        translations {
          languageCode
          content(format: RENDERED)
        }
      }
    }
  `,
    n = "https://bieldev.wpengine.com/index.php?graphql";
  try {
    let i = await (
        await fetch(n, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({query: r}),
        })
      ).json(),
      o = i.data.global.link,
      u = await (await fetch(o)).text(),
      c = new Qr().parseFromString(u, "text/html"),
      d = [
        "generateblocks-inline-css",
        "global-styles-inline-css",
        "generate-style-inline-css",
      ].map((h) => {
        let p = c.querySelector(`#${h}`);
        return p ? p.innerHTML : "";
      }),
      f =
        e == "en"
          ? i.data.global
          : i.data.global.translations.find((h) => h.languageCode == e) ||
            i.data.global;
    return {
      inlineStyles: d,
      global: f,
      content: f.content,
      allLangsGlobal: i.data.global,
    };
  } catch (s) {
    console.error("footer fetch failed"), console.error(s);
  }
}
async function Cx(t) {
  let r = `
    query getFooter {
      global(id: "footer-new", idType: SLUG) {
        content(format: RENDERED)
        uri
        link
        translations {
          languageCode
          content(format: RENDERED)
        }
      }
    }
  `,
    n = "https://bieldev.wpengine.com/index.php?graphql";
  try {
    let i = await (
        await fetch(n, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({query: r}),
        })
      ).json(),
      o = i.data.global.link,
      u = await (await fetch(o)).text(),
      c = new Qr().parseFromString(u, "text/html"),
      d = [
        "generateblocks-inline-css",
        "global-styles-inline-css",
        "generate-style-inline-css",
      ].map((h) => {
        let p = c.querySelector(`#${h}`);
        return p ? p.innerHTML : "";
      }),
      f =
        t == "en"
          ? i.data.global
          : i.data.global.translations.find((h) => h.languageCode == t) ||
            i.data.global;
    return {footerInlineStyles: d, footer: f};
  } catch (s) {
    console.error("footer fetch failed"), console.error(s);
  }
}
function Nx(t) {
  return new RegExp("^(?:[a-z+]+:)?//", "i").test(t);
}
function Lx(t) {
  return t.length === 0;
}
function Px(t) {
  return Zt(
    "svg",
    oe(
      {
        width: "61",
        height: "40",
        viewBox: "0 0 61 40",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
      },
      t
    ),
    () => [H(BA), H(VA), H(KA), H(WA)],
    !0
  );
}
function bo(t) {
  return Zt(
    "svg",
    oe(
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 12 12",
      },
      t
    ),
    () => H(GA),
    !0
  );
}
function Ix(t) {
  return Zt(
    "svg",
    oe(
      {
        width: "8",
        height: "5",
        viewBox: "0 0 8 5",
        xmlns: "http://www.w3.org/2000/svg",
      },
      t
    ),
    () => H(YA),
    !0
  );
}
function tC(t) {
  return Zt(
    "svg",
    oe(
      {
        width: "18",
        height: "12",
        viewBox: "0 0 18 12",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
      },
      t
    ),
    () => H(XA),
    !0
  );
}
function rC(t) {
  return Zt(
    "svg",
    oe(
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
      },
      t
    ),
    () => H(JA),
    !0
  );
}
function nC(t) {
  return Zt(
    "svg",
    oe(
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "1em",
        height: "1em",
        viewBox: "0 0 24 24",
      },
      t
    ),
    () => H(ZA),
    !0
  );
}
function sC(t) {
  return Zt(
    "svg",
    oe(
      {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
      },
      t
    ),
    () => H(QA),
    !0
  );
}
function kx(t) {
  return Zt(
    "svg",
    oe(
      {
        width: "20",
        height: "20",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        xmlns: "http://www.w3.org/2000/svg",
      },
      t
    ),
    () => H(eC),
    !0
  );
}
function aC(t) {
  return (...e) => {
    for (let r of t) r && r(...e);
  };
}
function uC(t) {
  return (...e) => {
    for (let r = t.length - 1; r >= 0; r--) {
      let n = t[r];
      n && n(...e);
    }
  };
}
function cC(t, ...e) {
  return typeof t == "function" ? t(...e) : t;
}
function dC(t, e, r, n) {
  return (
    t.addEventListener(e, r, n), lC(t.removeEventListener.bind(t, e, r, n))
  );
}
function fC(t, e, r, n) {
  if (ze) return;
  let s = () => {
    X2(P(t)).forEach((i) => {
      i && X2(P(e)).forEach((o) => dC(i, o, r, n));
    });
  };
  typeof t == "function" ? void 0 : dp(s);
}
function Rc() {
  return !0;
}
function J2(t) {
  let e = {},
    r;
  for (; (r = hC.exec(t)); ) e[r[1]] = r[2];
  return e;
}
function mC(t, e) {
  if (typeof t == "string") {
    if (typeof e == "string") return `${t};${e}`;
    t = J2(t);
  } else typeof e == "string" && (e = J2(e));
  return {...t, ...e};
}
function gC(...t) {
  let e = Array.isArray(t[0]),
    r = e ? t[0] : t;
  if (r.length === 1) return r[0];
  let n = e && t[1]?.reverseEventHandlers ? uC : aC,
    s = {};
  for (let o of r) {
    let a = P(o);
    for (let u in a)
      if (u[0] === "o" && u[1] === "n" && u[2]) {
        let c = a[u],
          l = u.toLowerCase(),
          d =
            typeof c == "function"
              ? c
              : Array.isArray(c)
              ? c.length === 1
                ? c[0]
                : c[0].bind(void 0, c[1])
              : void 0;
        d ? (s[l] ? s[l].push(d) : (s[l] = [d])) : delete s[l];
      }
  }
  let i = oe(...r);
  return new Proxy(
    {
      get(o) {
        if (typeof o != "string") return Reflect.get(i, o);
        if (o === "style") return x0(r, "style", mC);
        if (o === "ref") {
          let a = [];
          for (let u of r) {
            let c = P(u)[o];
            typeof c == "function" && a.push(c);
          }
          return n(a);
        }
        if (o[0] === "o" && o[1] === "n" && o[2]) {
          let a = s[o.toLowerCase()];
          return a ? n(a) : Reflect.get(i, o);
        }
        return o === "class" || o === "className"
          ? x0(r, o, (a, u) => `${a} ${u}`)
          : o === "classList"
          ? x0(r, o, (a, u) => ({...a, ...u}))
          : Reflect.get(i, o);
      },
      has(o) {
        return Reflect.has(i, o);
      },
      keys() {
        return Object.keys(i);
      },
    },
    pC
  );
}
function bC(t, e, r = -1) {
  return r in t ? [...t.slice(0, r), e, ...t.slice(r)] : [...t, e];
}
function T0(t, e) {
  let r = [...t],
    n = r.indexOf(e);
  return n !== -1 && r.splice(n, 1), r;
}
function yC(t) {
  return typeof t == "number";
}
function xC(t) {
  return Array.isArray(t);
}
function Is(t) {
  return Object.prototype.toString.call(t) === "[object String]";
}
function vC(t) {
  return typeof t == "function";
}
function Ox(t) {
  return (e) => `${t()}-${e}`;
}
function tn(t, e) {
  return t ? t === e || t.contains(e) : !1;
}
function po(t, e = !1) {
  let {activeElement: r} = Ir(t);
  if (!r?.nodeName) return null;
  if (Dx(r) && r.contentDocument) return po(r.contentDocument.body, e);
  if (e) {
    let n = r.getAttribute("aria-activedescendant");
    if (n) {
      let s = Ir(r).getElementById(n);
      if (s) return s;
    }
  }
  return r;
}
function Ir(t) {
  return t ? t.ownerDocument || t : document;
}
function Dx(t) {
  return t.tagName === "IFRAME";
}
function O0(t) {
  return typeof window < "u" && window.navigator != null
    ? t.test(
        window.navigator.userAgentData?.platform || window.navigator.platform
      )
    : !1;
}
function Mc() {
  return O0(/^Mac/i);
}
function wC() {
  return O0(/^iPhone/i);
}
function SC() {
  return O0(/^iPad/i) || (Mc() && navigator.maxTouchPoints > 1);
}
function EC() {
  return wC() || SC();
}
function TC() {
  return Mc() || EC();
}
function xt(t, e) {
  return e && (vC(e) ? e(t) : e[0](e[1], t)), t?.defaultPrevented;
}
function It(t) {
  return (e) => {
    for (let r of t) xt(e, r);
  };
}
function AC(t) {
  return Mc() ? t.metaKey && !t.ctrlKey : t.ctrlKey && !t.metaKey;
}
function ct(t) {
  if (t)
    if (CC()) t.focus({preventScroll: !0});
    else {
      let e = RC(t);
      t.focus(), NC(e);
    }
}
function CC() {
  if (Nc == null) {
    Nc = !1;
    try {
      document.createElement("div").focus({
        get preventScroll() {
          return (Nc = !0), !0;
        },
      });
    } catch {}
  }
  return Nc;
}
function RC(t) {
  let e = t.parentNode,
    r = [],
    n = document.scrollingElement || document.documentElement;
  for (; e instanceof HTMLElement && e !== n; )
    (e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth) &&
      r.push({element: e, scrollTop: e.scrollTop, scrollLeft: e.scrollLeft}),
      (e = e.parentNode);
  return (
    n instanceof HTMLElement &&
      r.push({element: n, scrollTop: n.scrollTop, scrollLeft: n.scrollLeft}),
    r
  );
}
function NC(t) {
  for (let {element: e, scrollTop: r, scrollLeft: n} of t)
    (e.scrollTop = r), (e.scrollLeft = n);
}
function $x(t, e) {
  let n = Array.from(t.querySelectorAll(D0)).filter(Z2);
  return (
    e && Z2(t) && n.unshift(t),
    n.forEach((s, i) => {
      if (Dx(s) && s.contentDocument) {
        let o = s.contentDocument.body,
          a = $x(o, !1);
        n.splice(i, 1, ...a);
      }
    }),
    n
  );
}
function Z2(t) {
  return Fx(t) && !IC(t);
}
function Fx(t) {
  return t.matches(D0) && M0(t);
}
function IC(t) {
  return parseInt(t.getAttribute("tabindex") || "0", 10) < 0;
}
function M0(t, e) {
  return (
    t.nodeName !== "#comment" &&
    kC(t) &&
    OC(t, e) &&
    (!t.parentElement || M0(t.parentElement, t))
  );
}
function kC(t) {
  if (!(t instanceof HTMLElement) && !(t instanceof SVGElement)) return !1;
  let {display: e, visibility: r} = t.style,
    n = e !== "none" && r !== "hidden" && r !== "collapse";
  if (n) {
    if (!t.ownerDocument.defaultView) return n;
    let {getComputedStyle: s} = t.ownerDocument.defaultView,
      {display: i, visibility: o} = s(t);
    n = i !== "none" && o !== "hidden" && o !== "collapse";
  }
  return n;
}
function OC(t, e) {
  return (
    !t.hasAttribute("hidden") &&
    (t.nodeName === "DETAILS" && e && e.nodeName !== "SUMMARY"
      ? t.hasAttribute("open")
      : !0)
  );
}
function DC(t, e) {
  return e.some((r) => r.contains(t));
}
function MC(t, e, r) {
  let n = e?.tabbable ? PC : D0,
    s = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, {
      acceptNode(i) {
        return e?.from?.contains(i)
          ? NodeFilter.FILTER_REJECT
          : i.matches(n) &&
            M0(i) &&
            (!r || DC(i, r)) &&
            (!e?.accept || e.accept(i))
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    });
  return e?.from && (s.currentNode = e.from), s;
}
function Q2(t) {
  for (; t && !_C(t); ) t = t.parentElement;
  return t || document.scrollingElement || document.documentElement;
}
function _C(t) {
  let e = window.getComputedStyle(t);
  return /(auto|scroll)/.test(e.overflow + e.overflowX + e.overflowY);
}
function $C() {}
function FC(t, e) {
  let [r, n] = t,
    s = !1,
    i = e.length;
  for (let o = i, a = 0, u = o - 1; a < o; u = a++) {
    let [c, l] = e[a],
      [d, f] = e[u],
      [, h] = e[u === 0 ? o - 1 : u - 1] || [0, 0],
      p = (l - f) * (r - c) - (c - d) * (n - l);
    if (f < l) {
      if (n >= f && n < l) {
        if (p === 0) return !0;
        p > 0 && (n === f ? n > h && (s = !s) : (s = !s));
      }
    } else if (l < f) {
      if (n > l && n <= f) {
        if (p === 0) return !0;
        p < 0 && (n === f ? n < h && (s = !s) : (s = !s));
      }
    } else if (n == l && ((r >= d && r <= c) || (r >= c && r <= d))) return !0;
  }
  return s;
}
function Xt(t, e) {
  return oe(t, e);
}
function tx() {
  if (typeof window > "u") return;
  let t = (r) => {
      if (!r.target) return;
      let n = lo.get(r.target);
      n ||
        ((n = new Set()),
        lo.set(r.target, n),
        r.target.addEventListener("transitioncancel", e)),
        n.add(r.propertyName);
    },
    e = (r) => {
      if (!r.target) return;
      let n = lo.get(r.target);
      if (
        n &&
        (n.delete(r.propertyName),
        n.size === 0 &&
          (r.target.removeEventListener("transitioncancel", e),
          lo.delete(r.target)),
        lo.size === 0)
      ) {
        for (let s of ex) s();
        ex.clear();
      }
    };
  document.body.addEventListener("transitionrun", t),
    document.body.addEventListener("transitionend", e);
}
function A0(t, e) {
  let r = rx(t, e, "left"),
    n = rx(t, e, "top"),
    s = e.offsetWidth,
    i = e.offsetHeight,
    o = t.scrollLeft,
    a = t.scrollTop,
    u = o + t.offsetWidth,
    c = a + t.offsetHeight;
  r <= o ? (o = r) : r + s > u && (o += r + s - u),
    n <= a ? (a = n) : n + i > c && (a += n + i - c),
    (t.scrollLeft = o),
    (t.scrollTop = a);
}
function rx(t, e, r) {
  let n = r === "left" ? "offsetLeft" : "offsetTop",
    s = 0;
  for (; e.offsetParent && ((s += e[n]), e.offsetParent !== t); ) {
    if (e.offsetParent.contains(t)) {
      s -= t[n];
      break;
    }
    e = e.offsetParent;
  }
  return s;
}
function HC(t, e) {
  if (document.contains(t)) {
    let r = document.scrollingElement || document.documentElement;
    if (window.getComputedStyle(r).overflow === "hidden") {
      let s = Q2(t);
      for (; t && s && t !== r && s !== r; ) A0(s, t), (t = s), (s = Q2(t));
    } else {
      let {left: s, top: i} = t.getBoundingClientRect();
      t?.scrollIntoView?.({block: "nearest"});
      let {left: o, top: a} = t.getBoundingClientRect();
      (Math.abs(s - o) > 1 || Math.abs(i - a) > 1) &&
        (e?.containingElement?.scrollIntoView?.({
          block: "center",
          inline: "center",
        }),
        t.scrollIntoView?.({block: "nearest"}));
    }
  }
}
function C0(t) {
  let e = t.startIndex ?? 0,
    r = t.startLevel ?? 0,
    n = [],
    s = (u) => {
      if (u == null) return "";
      let c = t.getKey ?? "key",
        l = Is(c) ? u[c] : c(u);
      return l != null ? String(l) : "";
    },
    i = (u) => {
      if (u == null) return "";
      let c = t.getTextValue ?? "textValue",
        l = Is(c) ? u[c] : c(u);
      return l != null ? String(l) : "";
    },
    o = (u) => {
      if (u == null) return !1;
      let c = t.getDisabled ?? "disabled";
      return (Is(c) ? u[c] : c(u)) ?? !1;
    },
    a = (u) => {
      if (u != null)
        return Is(t.getSectionChildren)
          ? u[t.getSectionChildren]
          : t.getSectionChildren?.(u);
    };
  for (let u of t.dataSource) {
    if (Is(u) || yC(u)) {
      n.push({
        type: "item",
        rawValue: u,
        key: String(u),
        textValue: String(u),
        disabled: o(u),
        level: r,
        index: e,
      }),
        e++;
      continue;
    }
    if (a(u) != null) {
      n.push({
        type: "section",
        rawValue: u,
        key: "",
        textValue: "",
        disabled: !1,
        level: r,
        index: e,
      }),
        e++;
      let c = a(u) ?? [];
      if (c.length > 0) {
        let l = C0({
          dataSource: c,
          getKey: t.getKey,
          getTextValue: t.getTextValue,
          getDisabled: t.getDisabled,
          getSectionChildren: t.getSectionChildren,
          startIndex: e,
          startLevel: r + 1,
        });
        n.push(...l), (e += l.length);
      }
    } else
      n.push({
        type: "item",
        rawValue: u,
        key: s(u),
        textValue: i(u),
        disabled: o(u),
        level: r,
        index: e,
      }),
        e++;
  }
  return n;
}
function zC(t, e = []) {
  let r = C0({
      dataSource: P(t.dataSource),
      getKey: P(t.getKey),
      getTextValue: P(t.getTextValue),
      getDisabled: P(t.getDisabled),
      getSectionChildren: P(t.getSectionChildren),
    }),
    [n, s] = V(t.factory(r));
  return (
    Dr(
      [
        () => P(t.dataSource),
        () => P(t.getKey),
        () => P(t.getTextValue),
        () => P(t.getDisabled),
        () => P(t.getSectionChildren),
        () => t.factory,
        ...e,
      ],
      ([i, o, a, u, c, l]) => {
        let d = C0({
          dataSource: i,
          getKey: o,
          getTextValue: a,
          getDisabled: u,
          getSectionChildren: c,
        });
        s(() => l(d));
      },
      {defer: !0}
    ),
    n
  );
}
function _0(t) {
  let [e, r] = V(t.defaultValue?.()),
    n = Ae(() => t.value?.() !== void 0),
    s = Ae(() => (n() ? t.value?.() : e()));
  return [
    s,
    (o) => {
      nl(() => {
        let a = cC(o, s());
        return Object.is(a, s()) || (n() || r(a), t.onChange?.(a)), a;
      });
    },
  ];
}
function qC(t) {
  let [e, r] = _0(t);
  return [() => e() ?? !1, r];
}
function UC(t) {
  let [e, r] = _0(t);
  return [() => e() ?? [], r];
}
function Hx(t = {}) {
  let [e, r] = qC({
      value: () => P(t.open),
      defaultValue: () => !!P(t.defaultOpen),
      onChange: (o) => t.onOpenChange?.(o),
    }),
    n = () => {
      r(!0);
    },
    s = () => {
      r(!1);
    };
  return {
    isOpen: e,
    setIsOpen: r,
    open: n,
    close: s,
    toggle: () => {
      e() ? s() : n();
    },
  };
}
function BC(t) {
  let e = (r) => {
    r.key === Mx.Escape && t.onEscapeKeyDown?.(r);
  };
}
function yo(t) {
  return kr.findIndex((e) => e.node === t);
}
function VC(t) {
  return kr[yo(t)];
}
function KC(t) {
  return kr[kr.length - 1].node === t;
}
function zx() {
  return kr.filter((t) => t.isPointerBlocking);
}
function WC() {
  return [...zx()].slice(-1)[0];
}
function $0() {
  return zx().length > 0;
}
function qx(t) {
  let e = yo(WC()?.node);
  return yo(t) < e;
}
function GC(t) {
  kr.push(t);
}
function YC(t) {
  let e = yo(t);
  e < 0 || kr.splice(e, 1);
}
function XC() {
  for (let {node: t} of kr) t.style.pointerEvents = qx(t) ? "none" : "auto";
}
function JC(t) {
  if ($0() && !R0) {
    let e = Ir(t);
    (jx = document.body.style.pointerEvents),
      (e.body.style.pointerEvents = "none"),
      (R0 = !0);
  }
}
function ZC(t) {
  if ($0()) return;
  let e = Ir(t);
  (e.body.style.pointerEvents = jx),
    e.body.style.length === 0 && e.body.removeAttribute("style"),
    (R0 = !1);
}
function QC(t, e) {
  let [r, n] = V(!1),
    s = {
      pause() {
        n(!0);
      },
      resume() {
        n(!1);
      },
    },
    i = null,
    o = (p) => t.onMountAutoFocus?.(p),
    a = (p) => t.onUnmountAutoFocus?.(p),
    u = () => Ir(e()),
    c = () => {
      let p = u().createElement("span");
      return (
        p.setAttribute("data-focus-trap", ""),
        (p.tabIndex = 0),
        Object.assign(p.style, jC),
        p
      );
    },
    l = () => {
      let p = e();
      return p
        ? $x(p, !0).filter((m) => !m.hasAttribute("data-focus-trap"))
        : [];
    },
    d = () => {
      let p = l();
      return p.length > 0 ? p[0] : null;
    },
    f = () => {
      let p = l();
      return p.length > 0 ? p[p.length - 1] : null;
    },
    h = () => {
      let p = e();
      if (!p) return !1;
      let m = po(p);
      return !m || tn(p, m) ? !1 : Fx(m);
    };
}
function t8(t) {}
function r8(t, e = document.body) {
  let r = new Set(t),
    n = new Set(),
    s = (u) => {
      for (let f of u.querySelectorAll(`[${e8}], [${kc}]`)) r.add(f);
      let c = (f) => {
          if (
            r.has(f) ||
            (f.parentElement &&
              n.has(f.parentElement) &&
              f.parentElement.getAttribute("role") !== "row")
          )
            return NodeFilter.FILTER_REJECT;
          for (let h of r) if (f.contains(h)) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        },
        l = document.createTreeWalker(u, NodeFilter.SHOW_ELEMENT, {
          acceptNode: c,
        }),
        d = c(u);
      if (
        (d === NodeFilter.FILTER_ACCEPT && i(u), d !== NodeFilter.FILTER_REJECT)
      ) {
        let f = l.nextNode();
        for (; f != null; ) i(f), (f = l.nextNode());
      }
    },
    i = (u) => {
      let c = fo.get(u) ?? 0;
      (u.getAttribute("aria-hidden") === "true" && c === 0) ||
        (c === 0 && u.setAttribute("aria-hidden", "true"),
        n.add(u),
        fo.set(u, c + 1));
    };
  Pt.length && Pt[Pt.length - 1].disconnect(), s(e);
  let o = new MutationObserver((u) => {
    for (let c of u)
      if (
        !(c.type !== "childList" || c.addedNodes.length === 0) &&
        ![...r, ...n].some((l) => l.contains(c.target))
      ) {
        for (let l of c.removedNodes)
          l instanceof Element && (r.delete(l), n.delete(l));
        for (let l of c.addedNodes)
          (l instanceof HTMLElement || l instanceof SVGElement) &&
          (l.dataset.liveAnnouncer === "true" ||
            l.dataset.reactAriaTopLayer === "true")
            ? r.add(l)
            : l instanceof Element && s(l);
      }
  });
  o.observe(e, {childList: !0, subtree: !0});
  let a = {
    observe() {
      o.observe(e, {childList: !0, subtree: !0});
    },
    disconnect() {
      o.disconnect();
    },
  };
  return (
    Pt.push(a),
    () => {
      o.disconnect();
      for (let u of n) {
        let c = fo.get(u);
        if (c == null) return;
        c === 1
          ? (u.removeAttribute("aria-hidden"), fo.delete(u))
          : fo.set(u, c - 1);
      }
      a === Pt[Pt.length - 1]
        ? (Pt.pop(), Pt.length && Pt[Pt.length - 1].observe())
        : Pt.splice(Pt.indexOf(a), 1);
    }
  );
}
function n8(t, e) {
  let r,
    n = $C,
    s = () => Ir(e()),
    i = (d) => t.onPointerDownOutside?.(d),
    o = (d) => t.onFocusOutside?.(d),
    a = (d) => t.onInteractOutside?.(d),
    u = (d) => {
      let f = d.target;
      return !(f instanceof HTMLElement) ||
        f.closest(`[${kc}]`) ||
        !tn(s(), f) ||
        tn(e(), f)
        ? !1
        : !t.shouldExcludeElement?.(f);
    },
    c = (d) => {
      function f() {
        let h = e(),
          p = d.target;
        if (!h || !p || !u(d)) return;
        let m = It([i, a]);
        p.addEventListener(ix, m, {once: !0});
        let g = new CustomEvent(ix, {
          bubbles: !1,
          cancelable: !0,
          detail: {
            originalEvent: d,
            isContextMenu: d.button === 2 || (AC(d) && d.button === 0),
          },
        });
        p.dispatchEvent(g);
      }
      d.pointerType === "touch"
        ? (s().removeEventListener("click", f),
          (n = f),
          s().addEventListener("click", f, {once: !0}))
        : f();
    },
    l = (d) => {
      let f = e(),
        h = d.target;
      if (!f || !h || !u(d)) return;
      let p = It([o, a]);
      h.addEventListener(ox, p, {once: !0});
      let m = new CustomEvent(ox, {
        bubbles: !1,
        cancelable: !0,
        detail: {originalEvent: d, isContextMenu: !1},
      });
      h.dispatchEvent(m);
    };
}
function s8(t) {
  let [e, r] = V(),
    n = {},
    s = t(),
    i = "none",
    [o, a] = i8(t() ? "mounted" : "unmounted", {
      mounted: {UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended"},
      unmountSuspended: {MOUNT: "mounted", ANIMATION_END: "unmounted"},
      unmounted: {MOUNT: "mounted"},
    });
  return (
    Dr(o, (u) => {
      let c = Pc(n);
      i = u === "mounted" ? c : "none";
    }),
    Dr(t, (u) => {
      if (s === u) return;
      let c = Pc(n);
      u
        ? a("MOUNT")
        : n?.display === "none"
        ? a("UNMOUNT")
        : a(s && i !== c ? "ANIMATION_OUT" : "UNMOUNT"),
        (s = u);
    }),
    Dr(e, (u) => {
      if (u) {
        let c = (d) => {
            let h = Pc(n).includes(d.animationName);
            d.target === u && h && a("ANIMATION_END");
          },
          l = (d) => {
            d.target === u && (i = Pc(n));
          };
        u.addEventListener("animationstart", l),
          u.addEventListener("animationcancel", c),
          u.addEventListener("animationend", c),
          se(() => {
            u.removeEventListener("animationstart", l),
              u.removeEventListener("animationcancel", c),
              u.removeEventListener("animationend", c);
          });
      } else a("ANIMATION_END");
    }),
    {
      isPresent: () => ["mounted", "unmountSuspended"].includes(o()),
      setRef: (u) => {
        u && (n = getComputedStyle(u)), r(u);
      },
    }
  );
}
function Pc(t) {
  return t?.animationName || "none";
}
function i8(t, e) {
  let r = (o, a) => e[o][a] ?? o,
    [n, s] = V(t);
  return [
    n,
    (o) => {
      s((a) => r(a, o));
    },
  ];
}
function Oc(t) {
  return (e) => (t(e), () => t(void 0));
}
function o8(t, e) {
  let [r, n] = V(ax(e?.()));
  return r;
}
function ax(t) {
  return Is(t) ? t : void 0;
}
function xo(t) {
  let [e, r] = tt(t, ["asChild", "as", "children"]);
  if (!e.asChild)
    return E(
      Ho,
      oe(
        {
          get component() {
            return e.as;
          },
        },
        r,
        {
          get children() {
            return e.children;
          },
        }
      )
    );
  let n = il(() => e.children);
  if (ux(n())) {
    let s = cx(r, n()?.props ?? {});
    return E(Ho, s);
  }
  if (xC(n())) {
    let s = n().find(ux);
    if (s) {
      let i = () =>
          E(Pe, {
            get each() {
              return n();
            },
            children: (a) =>
              E(Ce, {
                when: a === s,
                fallback: a,
                get children() {
                  return s.props.children;
                },
              }),
          }),
        o = cx(r, s?.props ?? {});
      return E(Ho, oe(o, {children: i}));
    }
  }
  throw new Error(
    "[kobalte]: Component is expected to render `asChild` but no children `As` component was found."
  );
}
function ux(t) {
  return t?.[a8] === !0;
}
function cx(t, e) {
  return gC([t, e], {reverseEventHandlers: !0});
}
function l8(t) {
  if (Intl.Locale) {
    let r = new Intl.Locale(t).maximize().script ?? "";
    return u8.has(r);
  }
  let e = t.split("-")[0];
  return c8.has(e);
}
function d8(t) {
  return l8(t) ? "rtl" : "ltr";
}
function Ux() {
  let t =
    (typeof navigator < "u" &&
      (navigator.language || navigator.userLanguage)) ||
    "en-US";
  try {
    Intl.DateTimeFormat.supportedLocalesOf([t]);
  } catch {
    t = "en-US";
  }
  return {locale: t, direction: d8(t)};
}
function lx() {
  N0 = Ux();
  for (let t of ho) t(N0);
}
function f8() {
  let t = {locale: "en-US", direction: "ltr"},
    [e, r] = V(N0),
    n = Ae(() => (ze ? t : e()));
  return {locale: () => n().locale, direction: () => n().direction};
}
function F0() {
  let t = f8();
  return Mr(p8) || t;
}
function h8(t) {
  let {locale: e} = F0(),
    r = Ae(
      () =>
        e() +
        (t
          ? Object.entries(t)
              .sort((n, s) => (n[0] < s[0] ? -1 : 1))
              .join()
          : "")
    );
  return Ae(() => {
    let n = r(),
      s;
    return (
      S0.has(n) && (s = S0.get(n)),
      s || ((s = new Intl.Collator(e(), t)), S0.set(n, s)),
      s
    );
  });
}
function m8(t) {
  let [e, r] = _0(t);
  return [() => e() ?? new Gt(), r];
}
function Bx(t) {
  return TC() ? t.altKey : t.ctrlKey;
}
function ks(t) {
  return Mc() ? t.metaKey : t.ctrlKey;
}
function dx(t) {
  return new Gt(t);
}
function g8(t, e) {
  if (t.size !== e.size) return !1;
  for (let r of t) if (!e.has(r)) return !1;
  return !0;
}
function b8(t) {
  let e = Xt({selectionMode: "none", selectionBehavior: "toggle"}, t),
    [r, n] = V(!1),
    [s, i] = V(),
    o = Ae(() => {
      let m = P(e.selectedKeys);
      return m != null ? dx(m) : m;
    }),
    a = Ae(() => {
      let m = P(e.defaultSelectedKeys);
      return m != null ? dx(m) : new Gt();
    }),
    [u, c] = m8({
      value: o,
      defaultValue: a,
      onChange: (m) => e.onSelectionChange?.(m),
    }),
    [l, d] = V(P(e.selectionBehavior)),
    f = () => P(e.selectionMode),
    h = () => P(e.disallowEmptySelection) ?? !1,
    p = (m) => {
      (P(e.allowDuplicateSelectionEvents) || !g8(m, u())) && c(m);
    };
  return {
    selectionMode: f,
    disallowEmptySelection: h,
    selectionBehavior: l,
    setSelectionBehavior: d,
    isFocused: r,
    setFocused: n,
    focusedKey: s,
    setFocusedKey: i,
    selectedKeys: u,
    setSelectedKeys: p,
  };
}
function y8(t) {
  let [e, r] = V(""),
    [n, s] = V(-1);
  return {
    typeSelectHandlers: {
      onKeyDown: (o) => {
        if (P(t.isDisabled)) return;
        let a = P(t.keyboardDelegate),
          u = P(t.selectionManager);
        if (!a.getKeyForSearch) return;
        let c = x8(o.key);
        if (!c || o.ctrlKey || o.metaKey) return;
        c === " " &&
          e().trim().length > 0 &&
          (o.preventDefault(), o.stopPropagation());
        let l = r((f) => f + c),
          d = a.getKeyForSearch(l, u.focusedKey()) ?? a.getKeyForSearch(l);
        d == null &&
          v8(l) &&
          ((l = l[0]),
          (d = a.getKeyForSearch(l, u.focusedKey()) ?? a.getKeyForSearch(l))),
          d != null && (u.setFocusedKey(d), t.onTypeSelect?.(d)),
          clearTimeout(n()),
          s(window.setTimeout(() => r(""), 500));
      },
    },
  };
}
function x8(t) {
  return t.length === 1 || !/^[A-Z]/i.test(t) ? t : "";
}
function v8(t) {
  return t.split("").every((e) => e === t[0]);
}
function w8(t, e, r) {
  let s = oe(
      {
        selectOnFocus: () =>
          P(t.selectionManager).selectionBehavior() === "replace",
      },
      t
    ),
    i = () => r?.() ?? e(),
    {direction: o} = F0(),
    a = {top: 0, left: 0};
  fC(
    () => (P(s.isVirtualized) ? void 0 : i()),
    "scroll",
    () => {
      let m = i();
      m && (a = {top: m.scrollTop, left: m.scrollLeft});
    }
  );
  let {typeSelectHandlers: u} = y8({
      isDisabled: () => P(s.disallowTypeAhead),
      keyboardDelegate: () => P(s.keyboardDelegate),
      selectionManager: () => P(s.selectionManager),
    }),
    c = (m) => {
      xt(m, u.onKeyDown), m.altKey && m.key === "Tab" && m.preventDefault();
      let g = e();
      if (!g?.contains(m.target)) return;
      let x = P(s.selectionManager),
        y = P(s.selectOnFocus),
        A = (w) => {
          w != null &&
            (x.setFocusedKey(w),
            m.shiftKey && x.selectionMode() === "multiple"
              ? x.extendSelection(w)
              : y && !Bx(m) && x.replaceSelection(w));
        },
        T = P(s.keyboardDelegate),
        O = P(s.shouldFocusWrap),
        C = x.focusedKey();
      switch (m.key) {
        case "ArrowDown": {
          if (T.getKeyBelow) {
            m.preventDefault();
            let w;
            C != null ? (w = T.getKeyBelow(C)) : (w = T.getFirstKey?.()),
              w == null && O && (w = T.getFirstKey?.(C)),
              A(w);
          }
          break;
        }
        case "ArrowUp": {
          if (T.getKeyAbove) {
            m.preventDefault();
            let w;
            C != null ? (w = T.getKeyAbove(C)) : (w = T.getLastKey?.()),
              w == null && O && (w = T.getLastKey?.(C)),
              A(w);
          }
          break;
        }
        case "ArrowLeft": {
          if (T.getKeyLeftOf) {
            m.preventDefault();
            let w = o() === "rtl",
              k;
            C != null
              ? (k = T.getKeyLeftOf(C))
              : (k = w ? T.getFirstKey?.() : T.getLastKey?.()),
              A(k);
          }
          break;
        }
        case "ArrowRight": {
          if (T.getKeyRightOf) {
            m.preventDefault();
            let w = o() === "rtl",
              k;
            C != null
              ? (k = T.getKeyRightOf(C))
              : (k = w ? T.getLastKey?.() : T.getFirstKey?.()),
              A(k);
          }
          break;
        }
        case "Home":
          if (T.getFirstKey) {
            m.preventDefault();
            let w = T.getFirstKey(C, ks(m));
            w != null &&
              (x.setFocusedKey(w),
              ks(m) && m.shiftKey && x.selectionMode() === "multiple"
                ? x.extendSelection(w)
                : y && x.replaceSelection(w));
          }
          break;
        case "End":
          if (T.getLastKey) {
            m.preventDefault();
            let w = T.getLastKey(C, ks(m));
            w != null &&
              (x.setFocusedKey(w),
              ks(m) && m.shiftKey && x.selectionMode() === "multiple"
                ? x.extendSelection(w)
                : y && x.replaceSelection(w));
          }
          break;
        case "PageDown":
          if (T.getKeyPageBelow && C != null) {
            m.preventDefault();
            let w = T.getKeyPageBelow(C);
            A(w);
          }
          break;
        case "PageUp":
          if (T.getKeyPageAbove && C != null) {
            m.preventDefault();
            let w = T.getKeyPageAbove(C);
            A(w);
          }
          break;
        case "a":
          ks(m) &&
            x.selectionMode() === "multiple" &&
            P(s.disallowSelectAll) !== !0 &&
            (m.preventDefault(), x.selectAll());
          break;
        case "Escape":
          m.defaultPrevented ||
            (m.preventDefault(),
            P(s.disallowEmptySelection) || x.clearSelection());
          break;
        case "Tab":
          if (!P(s.allowsTabNavigation)) {
            if (m.shiftKey) g.focus();
            else {
              let w = MC(g, {tabbable: !0}),
                k,
                D;
              do (D = w.lastChild()), D && (k = D);
              while (D);
              k && !k.contains(document.activeElement) && ct(k);
            }
            break;
          }
      }
    },
    l = (m) => {
      let g = P(s.selectionManager),
        x = P(s.keyboardDelegate),
        y = P(s.selectOnFocus);
      if (g.isFocused()) {
        m.currentTarget.contains(m.target) || g.setFocused(!1);
        return;
      }
      if (m.currentTarget.contains(m.target)) {
        if ((g.setFocused(!0), g.focusedKey() == null)) {
          let A = (O) => {
              O != null && (g.setFocusedKey(O), y && g.replaceSelection(O));
            },
            T = m.relatedTarget;
          T &&
          m.currentTarget.compareDocumentPosition(T) &
            Node.DOCUMENT_POSITION_FOLLOWING
            ? A(g.lastSelectedKey() ?? x.getLastKey?.())
            : A(g.firstSelectedKey() ?? x.getFirstKey?.());
        } else if (!P(s.isVirtualized)) {
          let A = i();
          if (A) {
            (A.scrollTop = a.top), (A.scrollLeft = a.left);
            let T = A.querySelector(`[data-key="${g.focusedKey()}"]`);
            T && (ct(T), A0(A, T));
          }
        }
      }
    },
    d = (m) => {
      let g = P(s.selectionManager);
      m.currentTarget.contains(m.relatedTarget) || g.setFocused(!1);
    },
    f = (m) => {
      i() === m.target && m.preventDefault();
    },
    h = () => {
      let m = P(s.autoFocus);
      if (!m) return;
      let g = P(s.selectionManager),
        x = P(s.keyboardDelegate),
        y;
      m === "first" && (y = x.getFirstKey?.()),
        m === "last" && (y = x.getLastKey?.());
      let A = g.selectedKeys();
      A.size && (y = A.values().next().value),
        g.setFocused(!0),
        g.setFocusedKey(y);
      let T = e();
      T && y == null && !P(s.shouldUseVirtualFocus) && ct(T);
    };
  return (
    Dr(
      [i, () => P(s.isVirtualized), () => P(s.selectionManager).focusedKey()],
      (m) => {
        let [g, x, y] = m;
        if (x) y && s.scrollToKey?.(y);
        else if (y && g) {
          let A = g.querySelector(`[data-key="${y}"]`);
          A && A0(g, A);
        }
      }
    ),
    {
      tabIndex: Ae(() => {
        if (!P(s.shouldUseVirtualFocus))
          return P(s.selectionManager).focusedKey() == null ? 0 : -1;
      }),
      onKeyDown: c,
      onMouseDown: f,
      onFocusIn: l,
      onFocusOut: d,
    }
  );
}
function S8(t, e) {
  let r = () => P(t.selectionManager),
    n = () => P(t.key),
    s = () => P(t.shouldUseVirtualFocus),
    i = (y) => {
      r().selectionMode() !== "none" &&
        (r().selectionMode() === "single"
          ? r().isSelected(n()) && !r().disallowEmptySelection()
            ? r().toggleSelection(n())
            : r().replaceSelection(n())
          : y?.shiftKey
          ? r().extendSelection(n())
          : r().selectionBehavior() === "toggle" ||
            ks(y) ||
            ("pointerType" in y && y.pointerType === "touch")
          ? r().toggleSelection(n())
          : r().replaceSelection(n()));
    },
    o = () => r().isSelected(n()),
    a = () => P(t.disabled) || r().isDisabled(n()),
    u = () => !a() && r().canSelectItem(n()),
    c = null,
    l = (y) => {
      u() &&
        ((c = y.pointerType),
        y.pointerType === "mouse" &&
          y.button === 0 &&
          !P(t.shouldSelectOnPressUp) &&
          i(y));
    },
    d = (y) => {
      u() &&
        y.pointerType === "mouse" &&
        y.button === 0 &&
        P(t.shouldSelectOnPressUp) &&
        P(t.allowsDifferentPressOrigin) &&
        i(y);
    },
    f = (y) => {
      u() &&
        ((P(t.shouldSelectOnPressUp) && !P(t.allowsDifferentPressOrigin)) ||
          c !== "mouse") &&
        i(y);
    },
    h = (y) => {
      !u() ||
        !["Enter", " "].includes(y.key) ||
        (Bx(y) ? r().toggleSelection(n()) : i(y));
    },
    p = (y) => {
      a() && y.preventDefault();
    },
    m = (y) => {
      let A = e();
      s() || a() || !A || (y.target === A && r().setFocusedKey(n()));
    },
    g = Ae(() => {
      if (!(s() || a())) return n() === r().focusedKey() ? 0 : -1;
    }),
    x = Ae(() => (P(t.virtualized) ? void 0 : n()));
  return (
    Dr(
      [e, n, s, () => r().focusedKey(), () => r().isFocused()],
      ([y, A, T, O, C]) => {
        y &&
          A === O &&
          C &&
          !T &&
          document.activeElement !== y &&
          (t.focus ? t.focus() : ct(y));
      }
    ),
    {
      isSelected: o,
      isDisabled: a,
      allowsSelection: u,
      tabIndex: g,
      dataKey: x,
      onPointerDown: l,
      onPointerUp: d,
      onClick: f,
      onKeyDown: h,
      onMouseDown: p,
      onFocus: m,
    }
  );
}
function E8(t) {
  let e = b8(t),
    n = zC(
      {
        dataSource: () => P(t.dataSource),
        getKey: () => P(t.getKey),
        getTextValue: () => P(t.getTextValue),
        getDisabled: () => P(t.getDisabled),
        getSectionChildren: () => P(t.getSectionChildren),
        factory: (i) => (t.filter ? new Dc(t.filter(i)) : new Dc(i)),
      },
      [() => t.filter]
    ),
    s = new L0(n, e);
  return (
    rl(() => {
      let i = e.focusedKey();
      i != null && !n().getItem(i) && e.setFocusedKey(void 0);
    }),
    {collection: n, selectionManager: () => s}
  );
}
function T8(t, e, r) {
  let n = h8({usage: "search", sensitivity: "base"}),
    s = Ae(() => {
      let i = P(t.keyboardDelegate);
      return i || new P0(t.collection, e, n);
    });
  return w8(
    {
      selectionManager: () => P(t.selectionManager),
      keyboardDelegate: s,
      autoFocus: () => P(t.autoFocus),
      deferAutoFocus: () => P(t.deferAutoFocus),
      shouldFocusWrap: () => P(t.shouldFocusWrap),
      disallowEmptySelection: () => P(t.disallowEmptySelection),
      selectOnFocus: () => P(t.selectOnFocus),
      disallowTypeAhead: () => P(t.disallowTypeAhead),
      shouldUseVirtualFocus: () => P(t.shouldUseVirtualFocus),
      allowsTabNavigation: () => P(t.allowsTabNavigation),
      isVirtualized: () => P(t.isVirtualized),
      scrollToKey: (i) => P(t.scrollToKey)?.(i),
    },
    e,
    r
  );
}
function C8(t) {
  let e = t.tagName.toLowerCase();
  return e === "button"
    ? !0
    : e === "input" && t.type
    ? A8.indexOf(t.type) !== -1
    : !1;
}
function R8(t) {
  let e,
    r = Xt({type: "button"}, t),
    [n, s] = tt(r, ["ref", "type", "disabled"]),
    i = o8(
      () => e,
      () => "button"
    ),
    o = Ae(() => {
      let c = i();
      return c == null ? !1 : C8({tagName: c, type: n.type});
    }),
    a = Ae(() => i() === "input"),
    u = Ae(() => i() === "a" && e?.getAttribute("href") != null);
  return E(
    xo,
    oe(
      {
        as: "button",
        get type() {
          return o() || a() ? n.type : void 0;
        },
        get role() {
          return !o() && !u() ? "button" : void 0;
        },
        get tabIndex() {
          return !o() && !u() && !n.disabled ? 0 : void 0;
        },
        get disabled() {
          return o() || a() ? n.disabled : void 0;
        },
        get "aria-disabled"() {
          return !o() && !a() && n.disabled ? !0 : void 0;
        },
        get "data-disabled"() {
          return n.disabled ? "" : void 0;
        },
      },
      s
    )
  );
}
function Kx() {
  return Mr(Vx);
}
function N8() {
  let t = Kx();
  if (t === void 0)
    throw new Error(
      "[kobalte]: `useDomCollectionContext` must be used within a `DomCollectionProvider` component"
    );
  return t;
}
function Wx(t, e) {
  return !!(e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING);
}
function L8(t, e) {
  let r = e.ref();
  if (!r) return -1;
  let n = t.length;
  if (!n) return -1;
  for (; n--; ) {
    let s = t[n]?.ref();
    if (s && Wx(s, r)) return n + 1;
  }
  return 0;
}
function P8(t) {
  let e = t.map((n, s) => [s, n]),
    r = !1;
  return (
    e.sort(([n, s], [i, o]) => {
      let a = s.ref(),
        u = o.ref();
      return a === u || !a || !u
        ? 0
        : Wx(a, u)
        ? (n > i && (r = !0), -1)
        : (n < i && (r = !0), 1);
    }),
    r ? e.map(([n, s]) => s) : t
  );
}
function Gx(t, e) {
  let r = P8(t);
  t !== r && e(r);
}
function I8(t) {
  let e = t[0],
    r = t[t.length - 1]?.ref(),
    n = e?.ref()?.parentElement;
  for (; n; ) {
    if (r && n.contains(r)) return n;
    n = n.parentElement;
  }
  return Ir(n).body;
}
function k8(t, e) {}
function O8(t, e) {
  if (typeof IntersectionObserver != "function") {
    k8(t, e);
    return;
  }
  let r = [];
}
function D8(t = {}) {
  let [e, r] = UC({
    value: () => P(t.items),
    onChange: (i) => t.onItemsChange?.(i),
  });
  O8(e, r);
  let n = (i) => (
    r((o) => {
      let a = L8(o, i);
      return bC(o, i, a);
    }),
    () => {
      r((o) => {
        let a = o.filter((u) => u.ref() !== i.ref());
        return o.length === a.length ? o : a;
      });
    }
  );
  return {
    DomCollectionProvider: (i) =>
      E(Vx.Provider, {
        value: {registerItem: n},
        get children() {
          return i.children;
        },
      }),
  };
}
function M8(t) {
  let e = N8(),
    r = Xt({shouldRegisterItem: !0}, t);
}
function V8() {
  return Mr(Yx);
}
function K8(t) {
  let e,
    r = V8(),
    [n, s] = tt(t, [
      "ref",
      "disableOutsidePointerEvents",
      "excludedElements",
      "onEscapeKeyDown",
      "onPointerDownOutside",
      "onFocusOutside",
      "onInteractOutside",
      "onDismiss",
      "bypassTopMostLayerCheck",
    ]),
    i = new Set([]),
    o = (d) => {
      i.add(d);
      let f = r?.registerNestedLayer(d);
      return () => {
        i.delete(d), f?.();
      };
    };
  n8(
    {
      shouldExcludeElement: (d) => !1,
      onPointerDownOutside: (d) => {},
      onFocusOutside: (d) => {
        n.onFocusOutside?.(d),
          n.onInteractOutside?.(d),
          d.defaultPrevented || n.onDismiss?.();
      },
    },
    () => e
  ),
    BC({ownerDocument: () => Ir(e), onEscapeKeyDown: (d) => {}}),
    Dr(
      [() => e, () => n.disableOutsidePointerEvents],
      ([d, f]) => {
        if (!d) return;
        let h = Lc.find(d);
        h &&
          h.isPointerBlocking !== f &&
          ((h.isPointerBlocking = f), Lc.assignPointerEventToLayers()),
          f && Lc.disableBodyPointerEvents(d),
          se(() => {
            Lc.restoreBodyPointerEvents(d);
          });
      },
      {defer: !0}
    );
  let l = {registerNestedLayer: o};
  return E(Yx.Provider, {
    value: l,
    get children() {
      return E(xo, oe({as: "div"}, s));
    },
  });
}
function W8() {
  let t = Mr(Xx);
  if (t === void 0)
    throw new Error(
      "[kobalte]: `usePopperContext` must be used within a `Popper` component"
    );
  return t;
}
function G8(t) {
  W8();
  let [e, r] = tt(t, ["ref", "style"]);
  return E(
    xo,
    oe(
      {
        as: "div",
        "data-popper-positioner": "",
        get style() {
          return {
            position: "absolute",
            top: 0,
            left: 0,
            "min-width": "max-content",
            ...e.style,
          };
        },
      },
      r
    )
  );
}
function bx(t) {
  let {x: e = 0, y: r = 0, width: n = 0, height: s = 0} = t ?? {};
  if (typeof DOMRect == "function") return new DOMRect(e, r, n, s);
  let i = {
    x: e,
    y: r,
    width: n,
    height: s,
    top: r,
    right: e + n,
    bottom: r + s,
    left: e,
  };
  return {...i, toJSON: () => i};
}
function Y8(t, e) {
  return {
    contextElement: t,
    getBoundingClientRect: () => {
      let n = e(t);
      return n ? bx(n) : t ? t.getBoundingClientRect() : bx();
    },
  };
}
function X8(t) {
  return /^(?:top|bottom|left|right)(?:-(?:start|end))?$/.test(t);
}
function Z8(t, e) {
  let [r, n] = t.split("-"),
    s = J8[r];
  return n
    ? r === "left" || r === "right"
      ? `${s} ${n === "start" ? "top" : "bottom"}`
      : n === "start"
      ? `${s} ${e === "rtl" ? "right" : "left"}`
      : `${s} ${e === "rtl" ? "left" : "right"}`
    : `${s} center`;
}
function Q8(t) {
  let e = Xt(
      {
        getAnchorRect: (f) => f?.getBoundingClientRect(),
        placement: "bottom",
        gutter: 0,
        shift: 0,
        flip: !0,
        slide: !0,
        overlap: !1,
        sameWidth: !1,
        fitViewport: !1,
        hideWhenDetached: !1,
        detachedPadding: 0,
        arrowPadding: 4,
        overflowPadding: 8,
      },
      t
    ),
    [r, n] = V(),
    [s, i] = V(),
    [o, a] = V(e.placement),
    u = () => Y8(e.anchorRef(), e.getAnchorRect),
    {direction: c} = F0();
  async function l() {
    let f = u(),
      h = r(),
      p = s();
    if (!f || !h) return;
    let m = (p?.clientHeight || 0) / 2,
      g = typeof e.gutter == "number" ? e.gutter + m : e.gutter ?? m;
    h.style.setProperty(
      "--kb-popper-content-overflow-padding",
      `${e.overflowPadding}px`
    ),
      f.getBoundingClientRect();
    let x = [
      O2(({placement: C}) => {
        let w = !!C.split("-")[1];
        return {
          mainAxis: g,
          crossAxis: w ? void 0 : e.shift,
          alignmentAxis: e.shift,
        };
      }),
    ];
    if (e.flip !== !1) {
      let C = typeof e.flip == "string" ? e.flip.split(" ") : void 0;
      if (C !== void 0 && !C.every(X8))
        throw new Error("`flip` expects a spaced-delimited list of placements");
      x.push(M2({padding: e.overflowPadding, fallbackPlacements: C}));
    }
    (e.slide || e.overlap) &&
      x.push(
        D2({
          mainAxis: e.slide,
          crossAxis: e.overlap,
          padding: e.overflowPadding,
        })
      ),
      x.push(
        _2({
          padding: e.overflowPadding,
          apply({availableWidth: C, availableHeight: w, rects: k}) {
            let D = Math.round(k.reference.width);
            (C = Math.floor(C)),
              (w = Math.floor(w)),
              h.style.setProperty("--kb-popper-anchor-width", `${D}px`),
              h.style.setProperty(
                "--kb-popper-content-available-width",
                `${C}px`
              ),
              h.style.setProperty(
                "--kb-popper-content-available-height",
                `${w}px`
              ),
              e.sameWidth && (h.style.width = `${D}px`),
              e.fitViewport &&
                ((h.style.maxWidth = `${C}px`), (h.style.maxHeight = `${w}px`));
          },
        })
      ),
      e.hideWhenDetached && x.push($2({padding: e.detachedPadding})),
      p && x.push(F2({element: p, padding: e.arrowPadding}));
    let y = await H2(f, h, {
      placement: e.placement,
      strategy: "absolute",
      middleware: x,
      platform: {...m0, isRTL: () => c() === "rtl"},
    });
    if ((a(y.placement), e.onCurrentPlacementChange?.(y.placement), !h)) return;
    h.style.setProperty(
      "--kb-popper-content-transform-origin",
      Z8(y.placement, c())
    );
    let A = Math.round(y.x),
      T = Math.round(y.y),
      O;
    if (
      (e.hideWhenDetached &&
        (O = y.middlewareData.hide?.referenceHidden ? "hidden" : "visible"),
      Object.assign(h.style, {
        top: "0",
        left: "0",
        transform: `translate3d(${A}px, ${T}px, 0)`,
        visibility: O,
      }),
      p && y.middlewareData.arrow)
    ) {
      let {x: C, y: w} = y.middlewareData.arrow,
        k = y.placement.split("-")[0];
      Object.assign(p.style, {
        left: C != null ? `${C}px` : "",
        top: w != null ? `${w}px` : "",
        [k]: "100%",
      });
    }
  }
  let d = {
    currentPlacement: o,
    contentRef: () => e.contentRef(),
    setPositionerRef: n,
    setArrowRef: i,
  };
  return E(Xx.Provider, {
    value: d,
    get children() {
      return e.children;
    },
  });
}
function Zx() {
  return Mr(Jx);
}
function Fn() {
  let t = Zx();
  if (t === void 0)
    throw new Error(
      "[kobalte]: `useMenuContext` must be used within a `Menu` component"
    );
  return t;
}
function Ds() {
  let t = Mr(Qx);
  if (t === void 0)
    throw new Error(
      "[kobalte]: `useMenuRootContext` must be used within a `MenuRoot` component"
    );
  return t;
}
function e5(t, e) {
  return e ? FC([t.clientX, t.clientY], e) : !1;
}
function t5(t) {
  let e = Ds(),
    r = Kx(),
    n = Zx(),
    s = Xt({placement: "bottom-start"}, t),
    [i, o] = tt(s, ["open", "defaultOpen", "onOpenChange"]),
    a = 0,
    u = null,
    c = "right",
    [l, d] = V(),
    [f, h] = V(),
    [p, m] = V(),
    [g, x] = V(),
    [y, A] = V(!0),
    [T, O] = V(o.placement),
    [C, w] = V([]),
    [k, D] = V([]),
    {DomCollectionProvider: te} = D8({items: k, onItemsChange: D}),
    F = Hx({
      open: () => i.open,
      defaultOpen: () => i.defaultOpen,
      onOpenChange: (Q) => i.onOpenChange?.(Q),
    }),
    K = s8(() => e.forceMount() || F.isOpen()),
    le = E8({selectionMode: "none", dataSource: k}),
    G = (Q) => {
      A(Q), F.open();
    },
    ne = (Q = !1) => {
      F.close(), Q && n && n.close(!0);
    },
    Le = (Q) => {
      A(Q), F.toggle();
    },
    He = () => {
      let Q = g();
      Q &&
        (ct(Q),
        le.selectionManager().setFocused(!0),
        le.selectionManager().setFocusedKey(void 0));
    },
    Xc = (Q) => {
      w((Zc) => [...Zc, Q]);
      let Ro = n?.registerNestedMenu(Q);
      return () => {
        w((Zc) => T0(Zc, Q)), Ro?.();
      };
    },
    Jc = (Q) => c === u?.side && e5(Q, u?.area),
    $v = (Q) => {
      Jc(Q) && Q.preventDefault();
    },
    Fv = (Q) => {
      Jc(Q) || He();
    },
    Hv = (Q) => {
      Jc(Q) && Q.preventDefault();
    };
  t8({
    isDisabled: () => !(n == null && F.isOpen() && e.isModal()),
    targets: () => [g(), ...C()].filter(Boolean),
  });
  let jv = {
    dataset: Ae(() => ({
      "data-expanded": F.isOpen() ? "" : void 0,
      "data-closed": F.isOpen() ? void 0 : "",
    })),
    isOpen: F.isOpen,
    contentPresence: K,
    nestedMenus: C,
    currentPlacement: T,
    pointerGraceTimeoutId: () => a,
    autoFocus: y,
    listState: () => le,
    parentMenuContext: () => n,
    triggerRef: p,
    contentRef: g,
    triggerId: l,
    contentId: f,
    setTriggerRef: m,
    setContentRef: x,
    open: G,
    close: ne,
    toggle: Le,
    focusContent: He,
    onItemEnter: $v,
    onItemLeave: Fv,
    onTriggerLeave: Hv,
    setPointerDir: (Q) => (c = Q),
    setPointerGraceTimeoutId: (Q) => (a = Q),
    setPointerGraceIntent: (Q) => (u = Q),
    registerNestedMenu: Xc,
    registerItemToParentDomCollection: r?.registerItem,
    registerTriggerId: Oc(d),
    registerContentId: Oc(h),
  };
  return E(te, {
    get children() {
      return E(Jx.Provider, {
        value: jv,
        get children() {
          return E(
            Q8,
            oe({anchorRef: p, contentRef: g, onCurrentPlacementChange: O}, o)
          );
        },
      });
    },
  });
}
function n5(t) {
  let e,
    r = Ds(),
    n = Fn(),
    s = Xt({id: r.generateId(`item-${Un()}`)}, t),
    [i, o] = tt(s, [
      "ref",
      "textValue",
      "disabled",
      "closeOnSelect",
      "checked",
      "indeterminate",
      "onSelect",
      "onPointerMove",
      "onPointerLeave",
      "onPointerDown",
      "onPointerUp",
      "onClick",
      "onKeyDown",
      "onMouseDown",
      "onFocus",
    ]),
    [a, u] = V(),
    [c, l] = V(),
    [d, f] = V(),
    h = () => n.listState().selectionManager(),
    p = () => o.id,
    m = () => h().focusedKey() === p(),
    g = () => {
      i.onSelect?.(), i.closeOnSelect && n.close(!0);
    };
  M8({
    getItem: () => ({
      ref: () => e,
      type: "item",
      key: p(),
      textValue: i.textValue ?? d()?.textContent ?? e?.textContent ?? "",
      disabled: i.disabled ?? !1,
    }),
  });
  let x = S8(
      {
        key: p,
        selectionManager: h,
        shouldSelectOnPressUp: !0,
        allowsDifferentPressOrigin: !0,
        disabled: () => i.disabled,
      },
      () => e
    ),
    y = (D) => {
      xt(D, i.onPointerMove),
        D.pointerType === "mouse" &&
          (i.disabled
            ? n.onItemLeave(D)
            : (n.onItemEnter(D),
              D.defaultPrevented ||
                (ct(D.currentTarget),
                n.listState().selectionManager().setFocused(!0),
                n.listState().selectionManager().setFocusedKey(p()))));
    },
    A = (D) => {
      xt(D, i.onPointerLeave), D.pointerType === "mouse" && n.onItemLeave(D);
    },
    T = (D) => {
      xt(D, i.onPointerUp), !i.disabled && D.button === 0 && g();
    },
    O = (D) => {
      if ((xt(D, i.onKeyDown), !D.repeat && !i.disabled))
        switch (D.key) {
          case "Enter":
          case " ":
            g();
            break;
        }
    },
    C = Ae(() => {
      if (i.indeterminate) return "mixed";
      if (i.checked != null) return i.checked;
    }),
    w = Ae(() => ({
      "data-indeterminate": i.indeterminate ? "" : void 0,
      "data-checked": i.checked && !i.indeterminate ? "" : void 0,
      "data-disabled": i.disabled ? "" : void 0,
      "data-highlighted": m() ? "" : void 0,
    })),
    k = {
      isChecked: () => i.checked,
      dataset: w,
      setLabelRef: f,
      generateId: Ox(() => o.id),
      registerLabel: Oc(u),
      registerDescription: Oc(l),
    };
  return E(r5.Provider, {
    value: k,
    get children() {
      return E(
        xo,
        oe(
          {
            as: "div",
            get tabIndex() {
              return x.tabIndex();
            },
            get "aria-checked"() {
              return C();
            },
            get "aria-disabled"() {
              return i.disabled;
            },
            get "aria-labelledby"() {
              return a();
            },
            get "aria-describedby"() {
              return c();
            },
            get "data-key"() {
              return x.dataKey();
            },
            get onPointerDown() {
              return It([i.onPointerDown, x.onPointerDown]);
            },
            get onPointerUp() {
              return It([T, x.onPointerUp]);
            },
            get onClick() {
              return It([i.onClick, x.onClick]);
            },
            get onKeyDown() {
              return It([O, x.onKeyDown]);
            },
            get onMouseDown() {
              return It([i.onMouseDown, x.onMouseDown]);
            },
            get onFocus() {
              return It([i.onFocus, x.onFocus]);
            },
            onPointerMove: y,
            onPointerLeave: A,
          },
          w,
          o
        )
      );
    },
  });
}
function ev() {
  return Mr(s5);
}
function i5(t) {
  let e,
    r = Ds(),
    n = Fn(),
    s = ev(),
    i = Xt({id: r.generateId(`content-${Un()}`)}, t),
    [o, a] = tt(i, [
      "ref",
      "id",
      "style",
      "onOpenAutoFocus",
      "onCloseAutoFocus",
      "onEscapeKeyDown",
      "onFocusOutside",
      "onPointerEnter",
      "onPointerMove",
      "onKeyDown",
      "onMouseDown",
      "onFocusIn",
      "onFocusOut",
    ]),
    u = 0,
    c = () => n.parentMenuContext() == null && s === void 0 && r.isModal(),
    l = T8(
      {
        selectionManager: n.listState().selectionManager,
        collection: n.listState().collection,
        autoFocus: n.autoFocus,
        deferAutoFocus: !0,
        shouldFocusWrap: !0,
        disallowTypeAhead: () => !n.listState().selectionManager().isFocused(),
      },
      () => e
    );
  QC(
    {
      trapFocus: () => c() && n.isOpen(),
      onMountAutoFocus: (g) => {
        s === void 0 && o.onOpenAutoFocus?.(g);
      },
      onUnmountAutoFocus: o.onCloseAutoFocus,
    },
    () => e
  );
  let d = (g) => {
      if (
        tn(g.currentTarget, g.target) &&
        (g.key === "Tab" && n.isOpen() && g.preventDefault(),
        s !== void 0 &&
          g.currentTarget.getAttribute("aria-haspopup") !== "true")
      )
        switch (g.key) {
          case "ArrowRight":
            g.stopPropagation(),
              g.preventDefault(),
              n.close(!0),
              s.setAutoFocusMenu(!0),
              s.nextMenu();
            break;
          case "ArrowLeft":
            if (g.currentTarget.hasAttribute("data-closed")) break;
            g.stopPropagation(),
              g.preventDefault(),
              n.close(!0),
              s.setAutoFocusMenu(!0),
              s.previousMenu();
            break;
        }
    },
    f = (g) => {
      o.onEscapeKeyDown?.(g), s?.setAutoFocusMenu(!1), n.close(!0);
    },
    h = (g) => {
      o.onFocusOutside?.(g), r.isModal() && g.preventDefault();
    },
    p = (g) => {
      xt(g, o.onPointerEnter),
        n.isOpen() &&
          (n.parentMenuContext()?.listState().selectionManager().setFocused(!1),
          n
            .parentMenuContext()
            ?.listState()
            .selectionManager()
            .setFocusedKey(void 0));
    },
    m = (g) => {
      if ((xt(g, o.onPointerMove), g.pointerType !== "mouse")) return;
      let x = g.target,
        y = u !== g.clientX;
      tn(g.currentTarget, x) &&
        y &&
        (n.setPointerDir(g.clientX > u ? "right" : "left"), (u = g.clientX));
    };
  return E(Ce, {
    get when() {
      return n.contentPresence.isPresent();
    },
    get children() {
      return E(G8, {
        get children() {
          return E(
            K8,
            oe(
              {
                role: "menu",
                get id() {
                  return o.id;
                },
                get tabIndex() {
                  return l.tabIndex();
                },
                get disableOutsidePointerEvents() {
                  return c() && n.isOpen();
                },
                get excludedElements() {
                  return [n.triggerRef];
                },
                bypassTopMostLayerCheck: !0,
                get style() {
                  return {
                    "--kb-menu-content-transform-origin":
                      "var(--kb-popper-content-transform-origin)",
                    position: "relative",
                    ...o.style,
                  };
                },
                get "aria-labelledby"() {
                  return n.triggerId();
                },
                onEscapeKeyDown: f,
                onFocusOutside: h,
                get onDismiss() {
                  return n.close;
                },
                get onKeyDown() {
                  return It([o.onKeyDown, l.onKeyDown, d]);
                },
                get onMouseDown() {
                  return It([o.onMouseDown, l.onMouseDown]);
                },
                get onFocusIn() {
                  return It([o.onFocusIn, l.onFocusIn]);
                },
                get onFocusOut() {
                  return It([o.onFocusOut, l.onFocusOut]);
                },
                onPointerEnter: p,
                onPointerMove: m,
              },
              () => n.dataset(),
              a
            )
          );
        },
      });
    },
  });
}
function o5(t) {
  let e = Ds(),
    r = Fn(),
    [n, s] = tt(t, ["ref"]);
  return (
    B8({element: () => null, enabled: () => r.isOpen() && e.preventScroll()}),
    E(i5, s)
  );
}
function a5(t) {
  let e = Fn(),
    r = Xt({children: "\u25BC"}, t);
  return E(
    xo,
    oe({as: "span", "aria-hidden": "true"}, () => e.dataset(), r)
  );
}
function u5(t) {
  return E(n5, oe({role: "menuitem", closeOnSelect: !0}, t));
}
function c5(t) {
  let e = Fn();
  return E(Ce, {
    get when() {
      return e.contentPresence.isPresent();
    },
    get children() {
      return E(Jp, t);
    },
  });
}
function l5(t) {
  let e = `menu-${Un()}`,
    r = Xt({id: e, modal: !0}, t),
    [n, s] = tt(r, [
      "id",
      "modal",
      "preventScroll",
      "forceMount",
      "open",
      "defaultOpen",
      "onOpenChange",
      "value",
    ]),
    i = Hx({
      open: () => n.open,
      defaultOpen: () => n.defaultOpen,
      onOpenChange: (a) => n.onOpenChange?.(a),
    }),
    o = {
      isModal: () => n.modal ?? !0,
      preventScroll: () => n.preventScroll ?? o.isModal(),
      forceMount: () => n.forceMount ?? !1,
      generateId: Ox(() => n.id),
      value: () => n.value,
    };
  return E(Qx.Provider, {
    value: o,
    get children() {
      return E(
        t5,
        oe(
          {
            get open() {
              return i.isOpen();
            },
            get onOpenChange() {
              return i.setIsOpen;
            },
          },
          s
        )
      );
    },
  });
}
function d5(t) {
  let e = Ds(),
    r = Fn(),
    n = ev(),
    s = Xt({id: e.generateId("trigger")}, t),
    [i, o] = tt(s, [
      "ref",
      "id",
      "disabled",
      "onPointerDown",
      "onClick",
      "onKeyDown",
      "onMouseOver",
      "onFocus",
    ]),
    a;
  n !== void 0 &&
    ((a = e.value() ?? i.id),
    se(() => {
      n.unregisterMenu(a);
    }),
    n.lastValue() === void 0 && n.setLastValue(a));
  let u = () => {
      n?.setAutoFocusMenu(!0),
        n !== void 0 ? r.toggle(!1) : r.toggle(!0),
        n !== void 0 && !r.isOpen() && n.value() === a && n.closeMenu();
    },
    c = (p) => {
      xt(p, i.onPointerDown),
        (p.currentTarget.dataset.pointerType = p.pointerType),
        !i.disabled && p.pointerType !== "touch" && p.button === 0 && u();
    },
    l = (p) => {
      xt(p, i.onClick),
        i.disabled || (p.currentTarget.dataset.pointerType === "touch" && u());
    },
    d = (p) => {
      if ((xt(p, i.onKeyDown), !i.disabled))
        switch (p.key) {
          case "Enter":
          case " ":
          case "ArrowDown":
            p.stopPropagation(),
              p.preventDefault(),
              HC(p.currentTarget),
              r.toggle("first");
            break;
          case "ArrowUp":
            p.stopPropagation(), p.preventDefault(), r.toggle("last");
            break;
          case "ArrowRight":
            if (n === void 0) break;
            p.stopPropagation(), p.preventDefault(), n.nextMenu();
            break;
          case "ArrowLeft":
            if (n === void 0) break;
            p.stopPropagation(), p.preventDefault(), n.previousMenu();
            break;
        }
    },
    f = (p) => {
      xt(p, i.onMouseOver),
        !i.disabled && n !== void 0 && n.value() !== void 0 && n.setValue(a);
    },
    h = (p) => {
      xt(p, i.onFocus), n !== void 0 && n.setValue(a);
    };
  return E(
    R8,
    oe(
      {
        get id() {
          return i.id;
        },
        get disabled() {
          return i.disabled;
        },
        "aria-haspopup": "true",
        get "aria-expanded"() {
          return r.isOpen();
        },
        get "aria-controls"() {
          return r.isOpen() ? r.contentId() : void 0;
        },
        get "data-highlighted"() {
          return a !== void 0 && n?.value() === a ? !0 : void 0;
        },
        get tabIndex() {
          return n !== void 0
            ? n.value() === a || n.lastValue() === a
              ? 0
              : -1
            : void 0;
        },
        onPointerDown: c,
        onMouseOver: f,
        onClick: l,
        onKeyDown: d,
        onFocus: h,
        role: n !== void 0 ? "menuitem" : void 0,
      },
      () => r.dataset(),
      o
    )
  );
}
function f5(t) {
  let e = Ds(),
    r = Fn(),
    [n, s] = tt(t, ["onCloseAutoFocus", "onInteractOutside"]),
    i = !1;
  return E(
    o5,
    oe(
      {
        onCloseAutoFocus: (u) => {
          n.onCloseAutoFocus?.(u),
            i || ct(r.triggerRef()),
            (i = !1),
            u.preventDefault();
        },
        onInteractOutside: (u) => {
          n.onInteractOutside?.(u),
            (!e.isModal() || u.detail.isContextMenu) && (i = !0);
        },
      },
      s
    )
  );
}
function p5(t) {
  let e = `dropdownmenu-${Un()}`,
    r = Xt({id: e}, t);
  return E(l5, r);
}
function y5(t) {
  return E(p5, {
    get children() {
      return [
        E(d5, {
          class:
            "flex  gap-2 items-center p-3 border-1 border-surface-border rounded-2xl text-onSurface-secondary fill-onSurface-secondary data-[expanded]:bg-surface-invert! data-[expanded]:text-onSurface-invert! data-[expanded]:fill-onSurface-invert",
          get children() {
            return [
              E(a5, {
                class: "flex gap-2 items-center ",
                get children() {
                  return E(kx, {class: "fill-inherit"});
                },
              }),
              H(h5, B(), R(t.currentLang.native_name)),
              E(Ix, {class: "fill-inherit"}),
            ];
          },
        }),
        E(c5, {
          get children() {
            return E(f5, {
              class:
                "bg-white z-10 right-0 min-w-80 shadow-dark shadow-xl rounded-xl overflow-hidden",
              get children() {
                return E(Pe, {
                  get each() {
                    return t.allLangs;
                  },
                  children: (e) =>
                    E(u5, {
                      get children() {
                        return H(
                          m5,
                          B(),
                          je(
                            "href",
                            R(e.localizedUrl, !0) ||
                              `${e.code == "en" ? "/" : `/${R(e.code, !0)}`}`,
                            !1
                          ),
                          R(e.native_name),
                          R(e.translated_name)
                        );
                      },
                    }),
                });
              },
            });
          },
        }),
      ];
    },
  });
}
function x5(t) {
  return H(
    g5,
    B(),
    R(
      E(Pe, {
        get each() {
          return t.allLangs;
        },
        children: (e) =>
          H(
            b5,
            B(),
            je(
              "href",
              R(e.localizedUrl, !0) ||
                `${e.code == "en" ? "/" : `/${R(e.code, !0)}`}`,
              !1
            ),
            R(e.native_name),
            R(e.translated_name)
          ),
      })
    )
  );
}
function H0(t) {
  switch (t) {
    case "es":
      return w5;
    case "pt-br":
      return v5;
    case "fr":
      return S5;
    case "id":
      return E5;
    case "en":
      return yx;
    default:
      return yx;
  }
}
function tv(t) {
  let [e, r] = V(""),
    [n, s] = V([]),
    i = "mobile",
    o =
      "absolute top-full  z-10 bg-white p-3 max-h-500px overflow-auto w-[clamp(min(99vw,270px),50vw,500px)] right-0 border border-#aaa";
  return (
    se(() => {
      typeof window < "u" &&
        window.pagefind &&
        (console.log("Cleaning up pagefind"), window.pagefind.destroy());
    }),
    [
      H(
        T5,
        B(),
        je("placeholder", R(H0(t.langCode).search, !0), !1) +
          je("value", R(e(), !0), !1),
        R(E(sC, {class: "absolute start-2 top-2"}))
      ),
      E(Ce, {
        get when() {
          return n()?.length;
        },
        get children() {
          return H(
            A5,
            B() + je("class", t.isBig ? R(o, !0) : R(i, !0), !1),
            R(
              E(Pe, {
                get each() {
                  return n();
                },
                children: (a) =>
                  H(
                    C5,
                    B(),
                    je("href", R(a.url, !0), !1),
                    R(a.meta.title),
                    a.excerpt
                  ),
              })
            )
          );
        },
      }),
    ]
  );
}
function M5(t) {
  let [e, r] = V(!1),
    [n, s] = V(),
    [i, o] = V();
  function a(c) {
    return c == n();
  }
  function u(c) {
    let l = c.attached_post?.uri || c.url;
    return Nx(l)
      ? l
      : t.currentLang.language_code == "en"
      ? l.startsWith("/")
        ? l
        : `/${l}`
      : l.startsWith("/")
      ? `/${t.currentLang.language_code}${l}`
      : `/${t.currentLang.language_code}/${l}`;
  }
  return H(
    N5,
    B(),
    R(E(Px, {})),
    R(
      E(Ce, {
        get when() {
          return !e();
        },
        get fallback() {
          return E(rC, {});
        },
        get children() {
          return E(tC, {class: "fill-onSurface-secondary"});
        },
      })
    ),
    R(
      E(Ce, {
        get when() {
          return e();
        },
        get children() {
          return H(
            R5,
            B(),
            R(
              E(Pe, {
                get each() {
                  return t.menu.items;
                },
                children: (c, l) =>
                  H(
                    I5,
                    B(),
                    R(c.title),
                    R(E(bo, {})),
                    R(
                      E(Ce, {
                        get when() {
                          return a(l());
                        },
                        get children() {
                          return E(xx, {
                            get children() {
                              return [
                                E(vx, {
                                  get text() {
                                    return c.title;
                                  },
                                  paneSetter: () => s(null),
                                }),
                                E(Ce, {
                                  get when() {
                                    return t.menu.featured_items;
                                  },
                                  get children() {
                                    return H(
                                      L5,
                                      B(),
                                      R(
                                        E(Pe, {
                                          get each() {
                                            return t.menu.featured_items;
                                          },
                                          children: (d) =>
                                            E(nv, {featured: d, shapeLink: u}),
                                        })
                                      )
                                    );
                                  },
                                }),
                                E(Ce, {
                                  get when() {
                                    return t.menu.non_featured_items;
                                  },
                                  get children() {
                                    return H(
                                      P5,
                                      B(),
                                      R(
                                        E(Pe, {
                                          get each() {
                                            return t.menu.non_featured_items;
                                          },
                                          children: (d) =>
                                            H(
                                              k5,
                                              B(),
                                              je("href", R(u(d), !0), !1),
                                              R(d.title),
                                              R(E(bo, {}))
                                            ),
                                        })
                                      )
                                    );
                                  },
                                }),
                              ];
                            },
                          });
                        },
                      })
                    )
                  ),
              })
            ),
            R(E(kx, {})),
            R(t.currentLang.native_name),
            R(E(nC, {})),
            R(
              E(tv, {
                get langCode() {
                  return t.currentLang.language_code;
                },
              })
            ),
            R(
              E(Ce, {
                get when() {
                  return a("language");
                },
                get children() {
                  return E(xx, {
                    get children() {
                      return [
                        E(vx, {
                          paneSetter: () => s(null),
                          get text() {
                            return t.currentLang.native_name;
                          },
                        }),
                        E(x5, {
                          get allLangs() {
                            return t.allLangs;
                          },
                          get currentLang() {
                            return t.currentLang;
                          },
                        }),
                      ];
                    },
                  });
                },
              })
            )
          );
        },
      })
    )
  );
}
function xx(t) {
  return H(O5, B(), R(t.children));
}
function vx(t) {
  return H(D5, B(), R(E(bo, {})), R(t.text));
}
function rv(t) {
  let [e, r] = V(),
    n = co("(min-width: 900px)", !0),
    s = co("(hover: hover)", !0);
  function i(a) {
    let u = a.attached_post?.uri || a.url;
    return Nx(u)
      ? u
      : t.currentLang.language_code == "en"
      ? u.startsWith("/")
        ? u
        : `/${u}`
      : u.startsWith("/")
      ? `/${t.currentLang.language_code}${u}`
      : `/${t.currentLang.language_code}/${u}`;
  }
  function o(a) {
    return a == e();
  }
  return H(
    $5,
    B(),
    R(
      E(Ce, {
        get when() {
          return !s() || !n();
        },
        get children() {
          return E(M5, {
            get menu() {
              return t.menu;
            },
            get allLangs() {
              return t.allLangs;
            },
            get currentLang() {
              return t.currentLang;
            },
            get isBig() {
              return n();
            },
          });
        },
      })
    ),
    R(
      E(Ce, {
        get when() {
          return s() && n();
        },
        get children() {
          return H(
            _5,
            B(),
            R(E(Px, {})),
            R(
              E(Pe, {
                get each() {
                  return t.menu?.items;
                },
                children: (a, u) =>
                  H(
                    q5,
                    B(),
                    je("href", R(i(a), !0), !1),
                    R(a.title),
                    R(E(Ix, {})),
                    R(
                      E(Ce, {
                        get when() {
                          return a.children?.length && o(u());
                        },
                        get children() {
                          return H(
                            z5,
                            B(),
                            R(
                              E(Ce, {
                                get when() {
                                  return a.icon;
                                },
                                get children() {
                                  return H(F5, B(), a.icon);
                                },
                              })
                            ),
                            R(a.title),
                            R(a.parent_description),
                            R(
                              E(Ce, {
                                get when() {
                                  return t.menu.featured_items;
                                },
                                get children() {
                                  return H(
                                    H5,
                                    B(),
                                    R(
                                      E(Pe, {
                                        get each() {
                                          return t.menu.featured_items;
                                        },
                                        children: (c) =>
                                          E(nv, {featured: c, shapeLink: i}),
                                      })
                                    )
                                  );
                                },
                              })
                            ),
                            R(
                              E(Ce, {
                                get when() {
                                  return t.menu.non_featured_items;
                                },
                                get children() {
                                  return H(
                                    j5,
                                    B(),
                                    R(
                                      E(Pe, {
                                        get each() {
                                          return t.menu.non_featured_items;
                                        },
                                        children: (c) =>
                                          H(
                                            U5,
                                            B(),
                                            je("href", R(i(c), !0), !1),
                                            R(c.title),
                                            R(E(bo, {}))
                                          ),
                                      })
                                    )
                                  );
                                },
                              })
                            )
                          );
                        },
                      })
                    )
                  ),
              })
            ),
            R(
              E(tv, {
                get langCode() {
                  return t.currentLang.language_code;
                },
                get isBig() {
                  return n();
                },
              })
            ),
            R(
              E(y5, {
                get allLangs() {
                  return t.allLangs;
                },
                get currentLang() {
                  return t.currentLang;
                },
              })
            )
          );
        },
      })
    )
  );
}
function nv(t) {
  return H(
    B5,
    B(),
    je("href", R(t.shapeLink(t.featured), !0), !1),
    t.featured.icon,
    R(t.featured.title),
    R(t.featured.featured_description),
    R(E(bo, {}))
  );
}
function J5(t) {
  let e = co("(min-width: 768px)", !0),
    [r, n] = V(!1),
    [s, i] = V(""),
    [o, a] = V("all");
  function u(d) {
    return t.i18Strings[d.toLowerCase()] || d;
  }
  let c = Object.values(t.langs).reduce(
      (d, f) => (
        d.has("all") || d.add("all"),
        f.contents.forEach((h) => {
          let p = h.subject?.toLowerCase();
          p && d.add(p);
        }),
        d
      ),
      new Set()
    ),
    l = () => {
      if (!s() && o() == "All") return t.langs;
      let d = t.langs;
      return (
        s() &&
          (d = Object.values(t.langs).reduce((f, h) => {
            let p = h.englishName.includes(s().toLowerCase()),
              m = h.name.toLowerCase().includes(s().toLowerCase());
            return (p || m) && (f[h.code] = h), f;
          }, {})),
        o().toLowerCase() !== "all" &&
          (d = Object.values(d).reduce(
            (f, h) => (
              h.contents.some((p) => p.subject?.toLowerCase() == o()) &&
                (f[h.code] = h),
              f
            ),
            {}
          )),
        d
      );
    };
  return H(
    G5,
    B(),
    `absolute z-10 w-full ${e() && "static"} ${r() ? "bg-white" : ""}`,
    R(
      E(Ce, {
        get when() {
          return !e();
        },
        get children() {
          return H(K5, B());
        },
      })
    ),
    R(
      E(Ce, {
        get when() {
          return e() || r();
        },
        get children() {
          return H(
            W5,
            B(),
            R(t.i18Strings.languages),
            je("value", R(s(), !0), !1),
            "border:1px solid #ccc;display:block;width:100%",
            je("placeholder", R(t.i18Strings.searchLangs, !0), !1),
            je("value", R(o(), !0), !1),
            R(
              E(Pe, {
                get each() {
                  return [...c.values()];
                },
                children: (d) => H(Y5, B(), je("value", R(d, !0), !1), R(u(d))),
              })
            ),
            R(
              E(Pe, {
                get each() {
                  return Object.values(l());
                },
                children: (d) => H(X5, B(), R(d.englishName), R(d.code)),
              })
            )
          );
        },
      })
    )
  );
}
function lR(t) {
  let e = () => {
    let r = V5();
    return r || t.initialData;
  };
  return H(
    Z5,
    B(),
    R(E(dR, {selected: e})),
    R(
      E(fR, {
        selected: e,
        get i18Strings() {
          return t.i18Strings;
        },
      })
    )
  );
}
function dR(t) {
  return H(Q5, B(), R(t.selected().name));
}
function fR(t) {
  let r = {
      code: "wa-glp",
      name: "Greek Words for Translators",
      links: [
        {
          url: "https://gwt.bibleineverylanguage.org/",
          zipContent: "",
          quality: "",
          format: "Read on Web",
        },
      ],
      subcontents: [],
      checkingLevel: 0,
    },
    n = () =>
      t.selected().code == "en"
        ? [...t.selected().contents, r]
        : t.selected().contents;
  return H(
    eR,
    B(),
    R(
      E(Pe, {
        get each() {
          return n();
        },
        children: (s) =>
          H(
            tR,
            B(),
            R(s.name),
            R(
              E(gR, {
                get level() {
                  return s.checkingLevel;
                },
              })
            ),
            R(
              E(Pe, {
                get each() {
                  return s.links;
                },
                children: (i) =>
                  H(
                    rR,
                    B() + je("href", R(i.url, !0), !1),
                    "color:white",
                    R(i.format)
                  ),
              })
            ),
            R(
              E(pR, {
                get i18Strings() {
                  return t.i18Strings;
                },
                get subContents() {
                  return s.subcontents;
                },
              })
            )
          ),
      })
    )
  );
}
function pR(t) {
  let e = t.subContents.reduce((r, n) => {
    let s = n.category.trim();
    return s
      ? (r[s] ? r[s]?.push(n) : (r[s] = [n]), r)
      : (r.other ? r.other.push(n) : (r.other = [n]), r);
  }, {});
  return H(
    Ex,
    B(),
    R(
      E(Pe, {
        get each() {
          return Object.entries(e);
        },
        children: ([r, n]) =>
          H(
            Ex,
            B(),
            R(
              E(hR, {
                get i18nStrings() {
                  return t.i18Strings;
                },
                key: r,
                item: n,
              })
            )
          ),
      })
    )
  );
}
function hR(t) {
  function e(r) {
    return t.i18nStrings[r.toLowerCase()] || r;
  }
  return H(
    nR,
    B(),
    R(e(t.key)),
    R(
      E(Pe, {
        get each() {
          return t.item;
        },
        children: (r) => E(mR, {subContentLine: r}),
      })
    )
  );
}
function mR(t) {
  return H(
    sR,
    B(),
    R(t.subContentLine.name),
    R(
      E(Pe, {
        get each() {
          return t.subContentLine.links;
        },
        children: (e) => H(iR, B(), je("href", R(e.url, !0), !1), R(e.format)),
      })
    )
  );
}
function gR(t) {
  return E(ol, {
    get fallback() {
      return H(cR, B());
    },
    get children() {
      return [
        E($s, {
          get when() {
            return t.level == 3;
          },
          get children() {
            return H(oR, B());
          },
        }),
        E($s, {
          get when() {
            return t.level == 2;
          },
          get children() {
            return H(aR, B());
          },
        }),
        E($s, {
          get when() {
            return t.level == 1;
          },
          get children() {
            return H(uR, B());
          },
        }),
      ];
    },
  });
}
var PA,
  IA,
  Yt,
  go,
  zA,
  Os,
  qA,
  k0,
  UA,
  Rx,
  BA,
  VA,
  KA,
  WA,
  GA,
  YA,
  XA,
  JA,
  ZA,
  QA,
  eC,
  iC,
  oC,
  P,
  X2,
  lC,
  pC,
  hC,
  x0,
  Mx,
  Nc,
  _x,
  LC,
  D0,
  PC,
  lo,
  ex,
  jC,
  kc,
  jx,
  R0,
  kr,
  Lc,
  v0,
  w0,
  nx,
  sx,
  e8,
  fo,
  Pt,
  ix,
  ox,
  a8,
  u8,
  c8,
  N0,
  ho,
  p8,
  S0,
  Gt,
  L0,
  Dc,
  P0,
  A8,
  Vx,
  Wt,
  Ic,
  _8,
  fx,
  $8,
  F8,
  H8,
  px,
  hx,
  j8,
  z8,
  q8,
  mx,
  gx,
  I0,
  U8,
  B8,
  Yx,
  Xx,
  J8,
  Jx,
  Qx,
  r5,
  s5,
  h5,
  m5,
  g5,
  b5,
  yx,
  v5,
  w5,
  S5,
  E5,
  T5,
  A5,
  C5,
  R5,
  N5,
  L5,
  P5,
  I5,
  k5,
  O5,
  D5,
  _5,
  $5,
  F5,
  H5,
  j5,
  z5,
  q5,
  U5,
  B5,
  wx,
  V5,
  Sx,
  K5,
  W5,
  G5,
  Y5,
  X5,
  Z5,
  Q5,
  eR,
  tR,
  rR,
  Ex,
  nR,
  sR,
  iR,
  oR,
  aR,
  uR,
  cR,
  bR,
  j0,
  yR,
  xR,
  sv,
  vR,
  wR,
  SR,
  ov = b(() => {
    "use strict";
    Xn();
    r2();
    Kn();
    Vn();
    Bn();
    j2();
    Y2();
    (PA = Object.defineProperty),
      (IA = (t, e, r) =>
        e in t
          ? PA(t, e, {enumerable: !0, configurable: !0, writable: !0, value: r})
          : (t[e] = r)),
      (Yt = (t, e, r) => (IA(t, typeof e != "symbol" ? e + "" : e, r), r));
    go = `
parentClientId
name
renderedHtml
`;
    (zA = pr("https://localhost:4321")),
      (Os = fr(
        async (t, e, r) => {
          let n = t.createAstro(zA, e, r);
          n.self = Os;
          let {content: s} = n.props;
          return he`${dt(
            t,
            "Fragment",
            rd,
            {},
            {default: (i) => he`${dn(s)}`}
          )}`;
        },
        "/Users/willkelly/Documents/Work/Code/biel-frontend/src/components/Blocks.astro",
        void 0
      )),
      (qA = pr("https://localhost:4321")),
      (k0 = fr(
        async (t, e, r) => {
          let n = t.createAstro(qA, e, r);
          n.self = k0;
          let {fallback: s = "animate"} = n.props;
          return he`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${Xe(
            s,
            "content"
          )}>`;
        },
        "/Users/willkelly/Documents/Work/Code/biel-frontend/node_modules/.pnpm/astro@4.5.9_sass@1.72.0_typescript@5.4.3/node_modules/astro/components/ViewTransitions.astro",
        void 0
      )),
      (UA = pr("https://localhost:4321")),
      (Rx = fr(
        async (t, e, r) => {
          let n = t.createAstro(UA, e, r);
          n.self = Rx;
          let {title: s, inlineCss: i, langInfo: o, langSwitcher: a} = n.props,
            u = await Cx(o.code),
            {footerInlineStyles: c, footer: l} = u || {
              footerInlineStyles: "",
              footer: {content: ""},
            },
            d = [...i, ...c],
            h = [...new Set(d)].join(`
`);
          return he`<html lang="en"${Xe(
            o.code,
            "lang"
          )}> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- https://bible-in-every-language.local/wp-content/themes/generatepress/assets/css/main.min.css --><meta name="generator"${Xe(
            n.generator,
            "content"
          )}><meta name="robots" content="noindex, nofollow"><title>${s}</title>${
            i && he`<style id="headlessStyles">${dn(h)}</style>`
          }${a.map(
            (p) =>
              he`<link rel="alternate"${Xe(
                p.localizedUrl || `${p.code == "en" ? "/" : `/${p.code}`}`,
                "href"
              )}${Xe(p.code, "hreflang")}>`
          )}${he`${dt(
            t,
            "ViewTransitions",
            k0,
            {}
          )}`}${Kh()}</head> <body class="bg-surface-primary"> ${Yo(
            t,
            r.default
          )} <footer class="wp-blocks site-footer"> ${dt(t, "Blocks", Os, {
            content: mo(l.content),
          })} </footer> </body></html>`;
        },
        "/Users/willkelly/Documents/Work/Code/biel-frontend/src/layouts/LayoutServer.astro",
        void 0
      ));
    (BA =
      '<path d="M26.0219 40H17.1006L34.2255 0H43.1468L26.0219 40ZM60.584 0H51.6626L34.5499 40H43.4712L60.584 0Z" fill="#726658"></path>'),
      (VA =
        '<path d="M8.90916 0H0L17.1127 40H26.0219L8.90916 0Z" fill="#B85659"></path>'),
      (KA =
        '<path d="M26.3621 0H17.457L34.5698 40H43.4789L26.3621 0Z" fill="#82A93F"></path>'),
      (WA =
        '<path d="M43.1307 0H34.2256L51.3383 40H60.2475L43.1307 0Z" fill="#FAA83C"></path>');
    (GA =
      '<path fill="currentColor" d="M2.22 4.47a.75.75 0 0 1 1.06 0L6 7.19l2.72-2.72a.75.75 0 0 1 1.06 1.06L6.53 8.78a.75.75 0 0 1-1.06 0L2.22 5.53a.75.75 0 0 1 0-1.06"></path>'),
      (YA =
        '<path d="M0.296538 2.11756L2.88654 4.70756C2.97905 4.80026 3.08894 4.87381 3.20991 4.92399C3.33089 4.97417 3.46057 5 3.59154 5C3.72251 5 3.85219 4.97417 3.97316 4.92399C4.09414 4.87381 4.20402 4.80026 4.29654 4.70756L6.88654 2.11756C7.51654 1.48756 7.06654 0.407555 6.17654 0.407555L0.996538 0.407556C0.106538 0.407556 -0.333462 1.48756 0.296538 2.11756Z"></path>'),
      (XA =
        '<path d="M1 12C0.716667 12 0.479333 11.904 0.288 11.712C0.0966668 11.52 0.000666667 11.2827 0 11C0 10.7167 0.0960001 10.4793 0.288 10.288C0.48 10.0967 0.717333 10.0007 1 10H17C17.2833 10 17.521 10.096 17.713 10.288C17.905 10.48 18.0007 10.7173 18 11C18 11.2833 17.904 11.521 17.712 11.713C17.52 11.905 17.2827 12.0007 17 12H1ZM1 7C0.716667 7 0.479333 6.904 0.288 6.712C0.0966668 6.52 0.000666667 6.28267 0 6C0 5.71667 0.0960001 5.47933 0.288 5.288C0.48 5.09667 0.717333 5.00067 1 5H17C17.2833 5 17.521 5.096 17.713 5.288C17.905 5.48 18.0007 5.71733 18 6C18 6.28333 17.904 6.521 17.712 6.713C17.52 6.905 17.2827 7.00067 17 7H1ZM1 2C0.716667 2 0.479333 1.904 0.288 1.712C0.0966668 1.52 0.000666667 1.28267 0 1C0 0.716667 0.0960001 0.479333 0.288 0.288C0.48 0.0966668 0.717333 0.000666667 1 0H17C17.2833 0 17.521 0.0960001 17.713 0.288C17.905 0.48 18.0007 0.717333 18 1C18 1.28333 17.904 1.521 17.712 1.713C17.52 1.905 17.2827 2.00067 17 2H1Z"></path>'),
      (JA =
        '<path fill="currentColor" d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m3.59 5L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41z"></path>'),
      (ZA =
        '<path fill="currentColor" d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"></path>'),
      (QA =
        '<path d="M15.5014 14.0014H14.7114L14.4314 13.7314C15.0564 13.0054 15.5131 12.1502 15.769 11.2271C16.0248 10.3039 16.0735 9.33559 15.9114 8.39144C15.4414 5.61144 13.1214 3.39144 10.3214 3.05144C9.33706 2.92691 8.33723 3.02921 7.39846 3.35053C6.4597 3.67185 5.60688 4.20366 4.90527 4.90527C4.20366 5.60688 3.67185 6.4597 3.35053 7.39846C3.02921 8.33723 2.92691 9.33706 3.05144 10.3214C3.39144 13.1214 5.61144 15.4414 8.39144 15.9114C9.33559 16.0735 10.3039 16.0248 11.2271 15.769C12.1502 15.5131 13.0054 15.0564 13.7314 14.4314L14.0014 14.7114V15.5014L18.2514 19.7514C18.6614 20.1614 19.3314 20.1614 19.7414 19.7514C20.1514 19.3414 20.1514 18.6714 19.7414 18.2614L15.5014 14.0014ZM9.50144 14.0014C7.01144 14.0014 5.00144 11.9914 5.00144 9.50144C5.00144 7.01144 7.01144 5.00144 9.50144 5.00144C11.9914 5.00144 14.0014 7.01144 14.0014 9.50144C14.0014 11.9914 11.9914 14.0014 9.50144 14.0014Z" fill="#66768B"></path>'),
      (eC =
        '<path d="M14.3601 12C14.4401 11.34 14.5001 10.68 14.5001 10C14.5001 9.32 14.4401 8.66 14.3601 8H17.7401C17.9001 8.64 18.0001 9.31 18.0001 10C18.0001 10.69 17.9001 11.36 17.7401 12H14.3601ZM12.5901 17.56C13.1901 16.45 13.6501 15.25 13.9701 14H16.9201C15.9512 15.6683 14.4142 16.932 12.5901 17.56ZM12.3401 12H7.66006C7.56006 11.34 7.50006 10.68 7.50006 10C7.50006 9.32 7.56006 8.65 7.66006 8H12.3401C12.4301 8.65 12.5001 9.32 12.5001 10C12.5001 10.68 12.4301 11.34 12.3401 12ZM10.0001 17.96C9.17006 16.76 8.50006 15.43 8.09006 14H11.9101C11.5001 15.43 10.8301 16.76 10.0001 17.96ZM6.00006 6H3.08006C4.03892 4.32721 5.57486 3.06149 7.40006 2.44C6.80006 3.55 6.35006 4.75 6.00006 6ZM3.08006 14H6.00006C6.35006 15.25 6.80006 16.45 7.40006 17.56C5.57868 16.9317 4.04491 15.6677 3.08006 14ZM2.26006 12C2.10006 11.36 2.00006 10.69 2.00006 10C2.00006 9.31 2.10006 8.64 2.26006 8H5.64006C5.56006 8.66 5.50006 9.32 5.50006 10C5.50006 10.68 5.56006 11.34 5.64006 12H2.26006ZM10.0001 2.03C10.8301 3.23 11.5001 4.57 11.9101 6H8.09006C8.50006 4.57 9.17006 3.23 10.0001 2.03ZM16.9201 6H13.9701C13.6571 4.76146 13.1936 3.5659 12.5901 2.44C14.4301 3.07 15.9601 4.34 16.9201 6ZM10.0001 0C4.47006 0 6.10352e-05 4.5 6.10352e-05 10C6.10352e-05 12.6522 1.05363 15.1957 2.92899 17.0711C3.85758 17.9997 4.95997 18.7362 6.17323 19.2388C7.38648 19.7413 8.68684 20 10.0001 20C12.6522 20 15.1958 18.9464 17.0711 17.0711C18.9465 15.1957 20.0001 12.6522 20.0001 10C20.0001 8.68678 19.7414 7.38642 19.2389 6.17317C18.7363 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0402 1.26375 13.8269 0.761205C12.6136 0.258658 11.3133 0 10.0001 0Z"></path>');
    (iC = !ze), (oC = iC && !!Lo);
    (P = (t) => (typeof t == "function" && !t.length ? t() : t)),
      (X2 = (t) => (Array.isArray(t) ? t : t ? [t] : []));
    lC = oC ? (t) => (sn() ? se(t) : t) : se;
    (pC = {
      get(t, e, r) {
        return e === cp ? r : t.get(e);
      },
      has(t, e) {
        return t.has(e);
      },
      set: Rc,
      deleteProperty: Rc,
      getOwnPropertyDescriptor(t, e) {
        return {
          configurable: !0,
          enumerable: !0,
          get() {
            return t.get(e);
          },
          set: Rc,
          deleteProperty: Rc,
        };
      },
      ownKeys(t) {
        return t.keys();
      },
    }),
      (hC = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g);
    x0 = (t, e, r) => {
      let n;
      for (let s of t) {
        let i = P(s)[e];
        n ? i && (n = r(n, i)) : (n = i);
      }
      return n;
    };
    Mx = ((t) => (
      (t.Escape = "Escape"),
      (t.Enter = "Enter"),
      (t.Tab = "Tab"),
      (t.Space = " "),
      (t.ArrowDown = "ArrowDown"),
      (t.ArrowLeft = "ArrowLeft"),
      (t.ArrowRight = "ArrowRight"),
      (t.ArrowUp = "ArrowUp"),
      (t.End = "End"),
      (t.Home = "Home"),
      (t.PageDown = "PageDown"),
      (t.PageUp = "PageUp"),
      t
    ))(Mx || {});
    Nc = null;
    (_x = [
      "input:not([type='hidden']):not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "a[href]",
      "area[href]",
      "[tabindex]",
      "iframe",
      "object",
      "embed",
      "audio[controls]",
      "video[controls]",
      "[contenteditable]:not([contenteditable='false'])",
    ]),
      (LC = [..._x, '[tabindex]:not([tabindex="-1"]):not([disabled])']),
      (D0 =
        _x.join(":not([hidden]),") +
        ",[tabindex]:not([disabled]):not([hidden])"),
      (PC = LC.join(':not([hidden]):not([tabindex="-1"]),'));
    (lo = new Map()), (ex = new Set());
    typeof document < "u" &&
      (document.readyState !== "loading"
        ? tx()
        : document.addEventListener("DOMContentLoaded", tx));
    jC = {
      border: "0",
      clip: "rect(0 0 0 0)",
      "clip-path": "inset(50%)",
      height: "1px",
      margin: "0 -1px -1px 0",
      overflow: "hidden",
      padding: "0",
      position: "absolute",
      width: "1px",
      "white-space": "nowrap",
    };
    (kc = "data-kb-top-layer"), (R0 = !1), (kr = []);
    Lc = {
      layers: kr,
      isTopMostLayer: KC,
      hasPointerBlockingLayer: $0,
      isBelowPointerBlockingLayer: qx,
      addLayer: GC,
      removeLayer: YC,
      indexOf: yo,
      find: VC,
      assignPointerEventToLayers: XC,
      disableBodyPointerEvents: JC,
      restoreBodyPointerEvents: ZC,
    };
    (v0 = "focusScope.autoFocusOnMount"),
      (w0 = "focusScope.autoFocusOnUnmount"),
      (nx = {bubbles: !1, cancelable: !0}),
      (sx = {
        stack: [],
        active() {
          return this.stack[0];
        },
        add(t) {
          t !== this.active() && this.active()?.pause(),
            (this.stack = T0(this.stack, t)),
            this.stack.unshift(t);
        },
        remove(t) {
          (this.stack = T0(this.stack, t)), this.active()?.resume();
        },
      });
    e8 = "data-live-announcer";
    (fo = new WeakMap()), (Pt = []);
    (ix = "interactOutside.pointerDownOutside"),
      (ox = "interactOutside.focusOutside");
    a8 = Symbol("$$KobalteAsComponent");
    (u8 = new Set([
      "Avst",
      "Arab",
      "Armi",
      "Syrc",
      "Samr",
      "Mand",
      "Thaa",
      "Mend",
      "Nkoo",
      "Adlm",
      "Rohg",
      "Hebr",
    ])),
      (c8 = new Set([
        "ae",
        "ar",
        "arc",
        "bcc",
        "bqi",
        "ckb",
        "dv",
        "fa",
        "glk",
        "he",
        "ku",
        "mzn",
        "nqo",
        "pnb",
        "ps",
        "sd",
        "ug",
        "ur",
        "yi",
      ]));
    (N0 = Ux()), (ho = new Set());
    p8 = Jt();
    S0 = new Map();
    Gt = class t extends Set {
      constructor(e, r, n) {
        super(e),
          Yt(this, "anchorKey"),
          Yt(this, "currentKey"),
          e instanceof t
            ? ((this.anchorKey = r || e.anchorKey),
              (this.currentKey = n || e.currentKey))
            : ((this.anchorKey = r), (this.currentKey = n));
      }
    };
    L0 = class {
      constructor(e, r) {
        Yt(this, "collection"),
          Yt(this, "state"),
          (this.collection = e),
          (this.state = r);
      }
      selectionMode() {
        return this.state.selectionMode();
      }
      disallowEmptySelection() {
        return this.state.disallowEmptySelection();
      }
      selectionBehavior() {
        return this.state.selectionBehavior();
      }
      setSelectionBehavior(e) {
        this.state.setSelectionBehavior(e);
      }
      isFocused() {
        return this.state.isFocused();
      }
      setFocused(e) {
        this.state.setFocused(e);
      }
      focusedKey() {
        return this.state.focusedKey();
      }
      setFocusedKey(e) {
        (e == null || this.collection().getItem(e)) &&
          this.state.setFocusedKey(e);
      }
      selectedKeys() {
        return this.state.selectedKeys();
      }
      isSelected(e) {
        if (this.state.selectionMode() === "none") return !1;
        let r = this.getKey(e);
        return r == null ? !1 : this.state.selectedKeys().has(r);
      }
      isEmpty() {
        return this.state.selectedKeys().size === 0;
      }
      isSelectAll() {
        if (this.isEmpty()) return !1;
        let e = this.state.selectedKeys();
        return this.getAllSelectableKeys().every((r) => e.has(r));
      }
      firstSelectedKey() {
        let e;
        for (let r of this.state.selectedKeys()) {
          let n = this.collection().getItem(r),
            s = n?.index != null && e?.index != null && n.index < e.index;
          (!e || s) && (e = n);
        }
        return e?.key;
      }
      lastSelectedKey() {
        let e;
        for (let r of this.state.selectedKeys()) {
          let n = this.collection().getItem(r),
            s = n?.index != null && e?.index != null && n.index > e.index;
          (!e || s) && (e = n);
        }
        return e?.key;
      }
      extendSelection(e) {
        if (this.selectionMode() === "none") return;
        if (this.selectionMode() === "single") {
          this.replaceSelection(e);
          return;
        }
        let r = this.getKey(e);
        if (r == null) return;
        let n = this.state.selectedKeys(),
          s = n.anchorKey || r,
          i = new Gt(n, s, r);
        for (let o of this.getKeyRange(s, n.currentKey || r)) i.delete(o);
        for (let o of this.getKeyRange(r, s)) this.canSelectItem(o) && i.add(o);
        this.state.setSelectedKeys(i);
      }
      getKeyRange(e, r) {
        let n = this.collection().getItem(e),
          s = this.collection().getItem(r);
        return n && s
          ? n.index != null && s.index != null && n.index <= s.index
            ? this.getKeyRangeInternal(e, r)
            : this.getKeyRangeInternal(r, e)
          : [];
      }
      getKeyRangeInternal(e, r) {
        let n = [],
          s = e;
        for (; s != null; ) {
          let i = this.collection().getItem(s);
          if ((i && i.type === "item" && n.push(s), s === r)) return n;
          s = this.collection().getKeyAfter(s);
        }
        return [];
      }
      getKey(e) {
        let r = this.collection().getItem(e);
        return r ? (!r || r.type !== "item" ? null : r.key) : e;
      }
      toggleSelection(e) {
        if (this.selectionMode() === "none") return;
        if (this.selectionMode() === "single" && !this.isSelected(e)) {
          this.replaceSelection(e);
          return;
        }
        let r = this.getKey(e);
        if (r == null) return;
        let n = new Gt(this.state.selectedKeys());
        n.has(r)
          ? n.delete(r)
          : this.canSelectItem(r) &&
            (n.add(r), (n.anchorKey = r), (n.currentKey = r)),
          !(this.disallowEmptySelection() && n.size === 0) &&
            this.state.setSelectedKeys(n);
      }
      replaceSelection(e) {
        if (this.selectionMode() === "none") return;
        let r = this.getKey(e);
        if (r == null) return;
        let n = this.canSelectItem(r) ? new Gt([r], r, r) : new Gt();
        this.state.setSelectedKeys(n);
      }
      setSelectedKeys(e) {
        if (this.selectionMode() === "none") return;
        let r = new Gt();
        for (let n of e) {
          let s = this.getKey(n);
          if (s != null && (r.add(s), this.selectionMode() === "single")) break;
        }
        this.state.setSelectedKeys(r);
      }
      selectAll() {
        this.selectionMode() === "multiple" &&
          this.state.setSelectedKeys(new Set(this.getAllSelectableKeys()));
      }
      clearSelection() {
        let e = this.state.selectedKeys();
        !this.disallowEmptySelection() &&
          e.size > 0 &&
          this.state.setSelectedKeys(new Gt());
      }
      toggleSelectAll() {
        this.isSelectAll() ? this.clearSelection() : this.selectAll();
      }
      select(e, r) {
        this.selectionMode() !== "none" &&
          (this.selectionMode() === "single"
            ? this.isSelected(e) && !this.disallowEmptySelection()
              ? this.toggleSelection(e)
              : this.replaceSelection(e)
            : this.selectionBehavior() === "toggle" ||
              (r && r.pointerType === "touch")
            ? this.toggleSelection(e)
            : this.replaceSelection(e));
      }
      isSelectionEqual(e) {
        if (e === this.state.selectedKeys()) return !0;
        let r = this.selectedKeys();
        if (e.size !== r.size) return !1;
        for (let n of e) if (!r.has(n)) return !1;
        for (let n of r) if (!e.has(n)) return !1;
        return !0;
      }
      canSelectItem(e) {
        if (this.state.selectionMode() === "none") return !1;
        let r = this.collection().getItem(e);
        return r != null && !r.disabled;
      }
      isDisabled(e) {
        let r = this.collection().getItem(e);
        return !r || r.disabled;
      }
      getAllSelectableKeys() {
        let e = [];
        return (
          ((n) => {
            for (; n != null; ) {
              if (this.canSelectItem(n)) {
                let s = this.collection().getItem(n);
                if (!s) continue;
                s.type === "item" && e.push(n);
              }
              n = this.collection().getKeyAfter(n);
            }
          })(this.collection().getFirstKey()),
          e
        );
      }
    };
    Dc = class {
      constructor(e) {
        Yt(this, "keyMap", new Map()),
          Yt(this, "iterable"),
          Yt(this, "firstKey"),
          Yt(this, "lastKey"),
          (this.iterable = e);
        for (let s of e) this.keyMap.set(s.key, s);
        if (this.keyMap.size === 0) return;
        let r,
          n = 0;
        for (let [s, i] of this.keyMap)
          r
            ? ((r.nextKey = s), (i.prevKey = r.key))
            : ((this.firstKey = s), (i.prevKey = void 0)),
            i.type === "item" && (i.index = n++),
            (r = i),
            (r.nextKey = void 0);
        this.lastKey = r.key;
      }
      *[Symbol.iterator]() {
        yield* this.iterable;
      }
      getSize() {
        return this.keyMap.size;
      }
      getKeys() {
        return this.keyMap.keys();
      }
      getKeyBefore(e) {
        return this.keyMap.get(e)?.prevKey;
      }
      getKeyAfter(e) {
        return this.keyMap.get(e)?.nextKey;
      }
      getFirstKey() {
        return this.firstKey;
      }
      getLastKey() {
        return this.lastKey;
      }
      getItem(e) {
        return this.keyMap.get(e);
      }
      at(e) {
        let r = [...this.getKeys()];
        return this.getItem(r[e]);
      }
    };
    P0 = class {
      constructor(e, r, n) {
        Yt(this, "collection"),
          Yt(this, "ref"),
          Yt(this, "collator"),
          (this.collection = e),
          (this.ref = r),
          (this.collator = n);
      }
      getKeyBelow(e) {
        let r = this.collection().getKeyAfter(e);
        for (; r != null; ) {
          let n = this.collection().getItem(r);
          if (n && n.type === "item" && !n.disabled) return r;
          r = this.collection().getKeyAfter(r);
        }
      }
      getKeyAbove(e) {
        let r = this.collection().getKeyBefore(e);
        for (; r != null; ) {
          let n = this.collection().getItem(r);
          if (n && n.type === "item" && !n.disabled) return r;
          r = this.collection().getKeyBefore(r);
        }
      }
      getFirstKey() {
        let e = this.collection().getFirstKey();
        for (; e != null; ) {
          let r = this.collection().getItem(e);
          if (r && r.type === "item" && !r.disabled) return e;
          e = this.collection().getKeyAfter(e);
        }
      }
      getLastKey() {
        let e = this.collection().getLastKey();
        for (; e != null; ) {
          let r = this.collection().getItem(e);
          if (r && r.type === "item" && !r.disabled) return e;
          e = this.collection().getKeyBefore(e);
        }
      }
      getItem(e) {
        return this.ref?.()?.querySelector(`[data-key="${e}"]`) ?? null;
      }
      getKeyPageAbove(e) {
        let r = this.ref?.(),
          n = this.getItem(e);
        if (!r || !n) return;
        let s = Math.max(0, n.offsetTop + n.offsetHeight - r.offsetHeight),
          i = e;
        for (; i && n && n.offsetTop > s; )
          (i = this.getKeyAbove(i)), (n = i != null ? this.getItem(i) : null);
        return i;
      }
      getKeyPageBelow(e) {
        let r = this.ref?.(),
          n = this.getItem(e);
        if (!r || !n) return;
        let s = Math.min(
            r.scrollHeight,
            n.offsetTop - n.offsetHeight + r.offsetHeight
          ),
          i = e;
        for (; i && n && n.offsetTop < s; )
          (i = this.getKeyBelow(i)), (n = i != null ? this.getItem(i) : null);
        return i;
      }
      getKeyForSearch(e, r) {
        let n = this.collator?.();
        if (!n) return;
        let s = r != null ? this.getKeyBelow(r) : this.getFirstKey();
        for (; s != null; ) {
          let i = this.collection().getItem(s);
          if (i) {
            let o = i.textValue.slice(0, e.length);
            if (i.textValue && n.compare(o, e) === 0) return s;
          }
          s = this.getKeyBelow(s);
        }
      }
    };
    A8 = ["button", "color", "file", "image", "reset", "submit"];
    Vx = Jt();
    (Wt = (t) => (typeof t == "function" ? t() : t)),
      (Ic = new Map()),
      (_8 = (t) => {}),
      (fx = _8),
      ($8 = (t, e) => {
        switch (e) {
          case "x":
            return [t.clientWidth, t.scrollLeft, t.scrollWidth];
          case "y":
            return [t.clientHeight, t.scrollTop, t.scrollHeight];
        }
      }),
      (F8 = (t, e) => {
        let r = getComputedStyle(t),
          n = e === "x" ? r.overflowX : r.overflowY;
        return (
          n === "auto" ||
          n === "scroll" ||
          (t.tagName === "HTML" && n === "visible")
        );
      }),
      (H8 = (t, e, r) => {
        let n =
            e === "x" && window.getComputedStyle(t).direction === "rtl"
              ? -1
              : 1,
          s = t,
          i = 0,
          o = 0,
          a = !1;
        do {
          let [u, c, l] = $8(s, e),
            d = l - u - n * c;
          (c !== 0 || d !== 0) && F8(s, e) && ((i += d), (o += c)),
            s === (r ?? document.documentElement)
              ? (a = !0)
              : (s = s._$host ?? s.parentElement);
        } while (s && !a);
        return [i, o];
      }),
      ([px, hx] = V([])),
      (j8 = (t) => px().indexOf(t) === px().length - 1),
      (z8 = (t) => {
        let e = oe(
            {
              element: null,
              enabled: !0,
              hideScrollbar: !0,
              preventScrollbarShift: !0,
              preventScrollbarShiftMode: "padding",
              allowPinchZoom: !1,
            },
            t
          ),
          r = Un(),
          n = [0, 0],
          s = null,
          i = null;
        let o = (c) => {
            (n = mx(c)), (s = null), (i = null);
          },
          a = (c) => {
            let l = c.target,
              d = Wt(e.element),
              f = q8(c),
              h = Math.abs(f[0]) > Math.abs(f[1]) ? "x" : "y",
              p = h === "x" ? f[0] : f[1],
              m = gx(l, h, p, d),
              g;
            d && I0(d, l) ? (g = !m) : (g = !0),
              g && c.cancelable && c.preventDefault();
          },
          u = (c) => {
            let l = Wt(e.element),
              d = c.target,
              f;
            if (c.touches.length === 2) f = !Wt(e.allowPinchZoom);
            else {
              if (s == null || i === null) {
                let h = mx(c).map((m, g) => n[g] - m),
                  p = Math.abs(h[0]) > Math.abs(h[1]) ? "x" : "y";
                (s = p), (i = p === "x" ? h[0] : h[1]);
              }
              if (d.type === "range") f = !1;
              else {
                let h = gx(d, s, i, l);
                l && I0(l, d) ? (f = !h) : (f = !0);
              }
            }
            f && c.cancelable && c.preventDefault();
          };
      }),
      (q8 = (t) => [t.deltaX, t.deltaY]),
      (mx = (t) =>
        t.changedTouches[0]
          ? [t.changedTouches[0].clientX, t.changedTouches[0].clientY]
          : [0, 0]),
      (gx = (t, e, r, n) => {
        let s = n && I0(n, t),
          [i, o] = H8(t, e, s ? n : void 0);
        return !((r > 0 && Math.abs(i) <= 1) || (r < 0 && Math.abs(o) < 1));
      }),
      (I0 = (t, e) => {
        if (t.contains(e)) return !0;
        let r = e;
        for (; r; ) {
          if (r === t) return !0;
          r = r._$host ?? r.parentElement;
        }
        return !1;
      }),
      (U8 = z8),
      (B8 = U8),
      (Yx = Jt());
    Xx = Jt();
    J8 = {top: "bottom", right: "left", bottom: "top", left: "right"};
    Jx = Jt();
    Qx = Jt();
    r5 = Jt();
    s5 = Jt();
    (h5 = ["<span", ">", "</span>"]),
      (m5 = [
        "<a",
        ' class="flex w-full justify-between p-3 hover:bg-brand-light hover:text-brand-base focus:bg-brand-light focus:text-brand-base"',
        "><span>",
        '</span><span class="text-onSurface-tertiary font-size-[var(--step--2)]">',
        "</span></a>",
      ]),
      (g5 = ["<ul", ">", "</ul>"]),
      (b5 = [
        "<li",
        '><a class="flex w-full justify-between p-3 hover:bg-brand-light hover:text-brand-base focus:bg-brand-light focus:text-brand-base"',
        "><span>",
        '</span><span class="text-onSurface-tertiary font-size-[var(--step--2)]">',
        "</span></a></li>",
      ]);
    (yx = {
      notYetTranslated:
        "This has not yet been translated. We are working to get it finished soon.",
      search: "Search...",
    }),
      (v5 = {
        notYetTranslated:
          "Isso ainda n\xE3o foi traduzido. Estamos trabalhando para conclu\xED-la em breve.",
        search: "Pesquisar...",
      }),
      (w5 = {
        notYetTranslated:
          "No se ha traducido todav\xEDa. Estamos trabajando para finalizarlo pronto.",
        search: "Busca...",
      }),
      (S5 = {
        notYetTranslated:
          "Cet article n'a pas encore \xE9t\xE9 traduit. Nous travaons pour le terminer \xE0 bientot.",
        search: "Recherche...",
      }),
      (E5 = {
        notYetTranslated:
          "Ini belum diterjemahkan. Kami sedang berupaya untuk segera menyelesaikannya.",
        search: "Cari...",
      });
    (T5 = [
      "<div",
      ' class="relative"><input class="border border-gray-200 px-2 py-2 rounded-lg bg-white! pis-10 placeholder:text-#777 placeholder:font-bold w-full" id="search" type="search"',
      "><!--$-->",
      "<!--/--></div>",
    ]),
      (A5 = ["<ul", ">", "</ul>"]),
      (C5 = [
        "<li",
        ' class="border-y-solid border-y-1 border-gray-400 py-4"><h3 class="font-bold text-lg cursor-pointer text-[var(--color-accent)]"><a',
        ">",
        "</a></h3><p>",
        "</p></li>",
      ]);
    (R5 = [
      "<div",
      ' class="flex flex-col overflow-scroll z-10 h-screen overflow-y-auto pb-36"><ul class=" ">',
      '</ul><div class="pt-4"><button class="p-3 flex w-full items-center justify-between active:bg-brand-base active:text-surface-invert border border-surface-border rounded-lg"><span class="flex gap-2"><!--$-->',
      "<!--/--><!--$-->",
      "<!--/--></span><span>",
      '</span></button><div class="mt-4">',
      "</div><!--$-->",
      "<!--/--></div></div>",
    ]),
      (N5 = [
        "<div",
        '><nav class="relative pie-4 pis-4"><div class="flex justify-between items-center py-2 sm:text-blue"><a href="/" class="w-40 block">',
        '</a><button class="active:outline-primary active:bg-none !hover:bg-transparent hover:text-primary! !focus:bg-transparent focus:outline-primary focus:outline-1 icon text-black!">',
        "</button></div><!--$-->",
        "<!--/--></nav></div>",
      ]),
      (L5 = [
        "<ul",
        ' class="flex flex-col gap-2 w-full pb-8 border-b border-b-surface-border">',
        "</ul>",
      ]),
      (P5 = ["<ul", ' class="flex flex-col gap-2 w-full">', "</ul>"]),
      (I5 = [
        "<li",
        ' class="py-4 w-full flex justify-between content-center flex-shrink-0 last:border-b last:border-surface-border last:pb-12"><span class="font-bold">',
        '</span><span class="inline-block transform -rotate-90">',
        "</span><!--$-->",
        "<!--/--></li>",
      ]),
      (k5 = [
        "<li",
        '><a class="w-full flex py-2 justify-between hover:bg-surface-secondary rounded-xl p-2"',
        "><!--$-->",
        '<!--/--><span class="block transform -rotate-90 color-onSurface-tertiary font-size-[var(--step--2)]">',
        "</span></a></li>",
      ]),
      (O5 = [
        "<div",
        ' class="absolute top-0 left-0 bg-white z-10 h-screen overflow-auto w-full pie-4 pis-4">',
        "</div>",
      ]),
      (D5 = [
        "<div",
        ' class=" w-full py-4"><div class="flex gap-6 w-full"><button class=""><span class="block transform rotate-90 color-onSurface-secondary text-lg">',
        '</span></button><h2 class="text-black text-lg font-bold">',
        "</h2></div></div>",
      ]);
    (_5 = [
      "<div",
      ' class="relative"><nav class="relative p-4 flex items-center justify-between z-10 contain h-20"><div class="flex items-center"><a href="/" class="w-40 ">',
      '</a><ul class="flex list-none gap-4 p-0">',
      '</ul></div><div class="flex items-center gap-2"><!--$-->',
      "<!--/--><!--$-->",
      "<!--/--></div></nav></div>",
    ]),
      ($5 = [
        "<div",
        ' data-pagefind-ignore="all"><!--$-->',
        "<!--/--><!--$-->",
        "<!--/--></div>",
      ]),
      (F5 = ["<span", ' class="w-6 icon text-brand-base">', "</span>"]),
      (H5 = ["<ul", ' class="flex flex-col gap-2 w-1/2">', "</ul>"]),
      (j5 = ["<ul", ' class="flex flex-col gap-2 w-1/4">', "</ul>"]),
      (z5 = [
        "<div",
        ' class="bg-white fixed top-20 left-0 w-full"><div class="contain py-4 flex gap-10"><div class="p-4 flex flex-col gap-2 w-1/4"><div class="flex gap-2 items-center"><!--$-->',
        '<!--/--><h2 class="text-onSurface-primary font-size-[var(--step-1)] font-bold">',
        "</h2></div><p>",
        "</p></div><!--$-->",
        "<!--/--><!--$-->",
        "<!--/--></div></div>",
      ]),
      (q5 = [
        "<li",
        ' class="group"><span class="inline-block px-2 hover:bg-primaryLighter rounded-md"><a class="font-bold group-has-[:hover]:text-blue-700 focus:text-blue-700 inline-flex gap-2 items-center"',
        "><!--$-->",
        "<!--/--><!--$-->",
        "<!--/--></a></span><!--$-->",
        "<!--/--></li>",
      ]),
      (U5 = [
        "<li",
        '><a class="w-full flex py-2 justify-between hover:bg-surface-secondary rounded-xl p-2"',
        "><!--$-->",
        '<!--/--><span class="block transform -rotate-90 color-onSurface-tertiary font-size-[var(--step--2)]">',
        "</span></a></li>",
      ]),
      (B5 = [
        "<li",
        '><a class="p-4 rounded-lg flex flex-col bg-brand-light hover:bg-brand-base hover:text-onSurface-invert group/featured"',
        '><h3 class="flex gap-2 text-brand-base group-hover/featured:text-inherit! font-size-[var(--step-1)]"><span class="w-6 text-inherit icon [&amp;_path]:text-inherit! [&amp;_path]:fill-current ">',
        "</span><!--$-->",
        '<!--/--></h3><p class="flex items-baseline justify-between"><span class="block max-w-95%">',
        '</span><span class="block transform -rotate-90 color-onSurface-tertiary font-size-[var(--step--2)]">',
        "</span></p></a></li>",
      ]);
    (wx = {
      en: {
        languages: "Languages",
        searchLangs: "Search Languages or codes...",
        all: "All",
        "bible-ot": "Old Testament",
        "bible-nt": "New Testament",
        bible: "Bible",
        topics: "Topics",
        obs: "Chapters",
        other: "Other",
        "translation notes: ": "Translation Notes",
        "translation questions": "Translation Questions",
        "translation words": "Translation Words",
        "sign languages": "Sign Languages",
        reference: "Reference",
        "translation academy": "Translation Academy",
        "bible commentary": "Bible Commentary",
      },
      es: {
        languages: "Idiomas",
        searchLangs: "Buscar idiomas o c\xF3digos...",
        all: "Todos",
        "bible-ot": "Antiguo Testamento",
        "bible-nt": "Nuevo Testamento",
        bible: "Biblia",
        topics: "Temas",
        obs: "Capitulos",
        other: "Otro",
        "translation notes": "Notas de traducci\xF3n",
        "translation questions": "Preguntas sobre la traducci\xF3n",
        "translation words": "Palabras de traducci\xF3n",
        "sign languages": "Lenguas de signos",
        reference: "Referencia",
        "translation academy": "Academia de traducci\xF3n",
        "bible commentary": "Comentarios b\xEDblicos",
      },
      "pt-br": {
        languages: "Idiomas",
        searchLangs: "Pesquisar idiomas ou c\xF3digos...",
        all: "Todo",
        bible: "Biblia",
        "bible-ot": "Antigo Testamento",
        "bible-nt": "Novo Testamento",
        topics: "T\xF3picos",
        obs: "Cap\xEDtulos",
        other: "Outros",
        "translation notes": "Notas de tradu\xE7\xE3o",
        "translation questions": "Perguntas sobre a tradu\xE7\xE3o",
        "translation words": "Palavras para tradu\xE7\xE3o",
        "sign languages": "Idiomas de sinais",
        reference: "Refer\xEAncias",
        "translation academy": "Academia de Tradu\xE7\xE3o",
        "bible commentary": "Coment\xE1rio B\xEDblico",
      },
      fr: {
        languages: "Langues",
        searchLangs: "Recherche de langues ou de codes...",
        all: "Tous",
        "bible-ot": "Ancien Testament",
        "bible-nt": "Nouveau Testament",
        bible: "Bible",
        topics: "Topics",
        obs: "Chapitres",
        other: "Autres",
        "translation notes": "Notes de traduction",
        "translation questions": "Questions de traduction",
        "translation words": "Mots de traduction",
        "sign languages": "Langues des signes",
        reference: "R\xE9f\xE9rence",
        "translation academy": "Acad\xE9mie de traduction",
        "bible commentary": "Commentaire biblique",
      },
      id: {
        languages: "Bahasa",
        searchLangs: "Cari Bahasa atau kode...",
        all: "Semua",
        "bible-ot": "Perjanjian Lama",
        "bible-nt": "Perjanjian Baru",
        bible: "Alkitab",
        topics: "Topik",
        obs: "Pasal-pasal",
        other: "Lainnya",
        "translation notes": "Catatan Penerjemahan",
        "translation questions": "Pertanyaan Penerjemahan",
        "translation words": "Kata-kata Terjemahan",
        "sign languages": "Bahasa Isyarat",
        reference: "Referensi",
        "translation academy": "Akademi Penerjemahan",
        "bible commentary": "Tafsiran Alkitab",
      },
    }),
      ([V5, Sx] = V()),
      (K5 = [
        "<button",
        ' class="icon block w-8 pt-2 !hover:bg-transparent active:bg-none active:text-[#F9A83C] text-black!"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M9 20h13v-4H9zM2 8h5V4H2zm0 6h5v-4H2zm0 6h5v-4H2zm7-6h13v-4H9zm0-6h13V4H9z"></path></svg></button>',
      ]),
      (W5 = [
        "<div",
        ' class="w-11/12 mx-auto md:w-full"><h2 class="text-2xl font-bold">',
        '</h2><div class="mbs-4 mbe-4"><label><input',
        ' type="text" style="',
        '" class="px-2 py-1 border! border-gray-300! block w-full"',
        '></label><select class="py-2 px-2 border border-solid border-gray-300 w-full block capitalize"',
        ">",
        '</select></div><ul class="w-full max-h-screen overflow-auto">',
        "</ul></div>",
      ]),
      (G5 = [
        "<div",
        ' class="',
        '"><!--$-->',
        "<!--/--><!--$-->",
        "<!--/--></div>",
      ]),
      (Y5 = ["<option", ' class="capitalize"', ">", "</option>"]),
      (X5 = [
        "<li",
        ' class=""><button class="flex justify-between w-full bg-transparent! text-black! !hover:bg-[#FAA83D] !hover:text-white px-2 py-1"><span>',
        '</span><span class="text-gray-600 text-sm font-italic">',
        "</span></button></li>",
      ]);
    (Z5 = [
      "<div",
      ' class="w-full"><!--$-->',
      "<!--/--><!--$-->",
      "<!--/--></div>",
    ]),
      (Q5 = [
        "<h2",
        ' class="py-4 px-2 bg-gray-200 font-bold text-4xl">',
        "</h2>",
      ]),
      (eR = ["<div", ' class="flex flex-col gap-4 mt-4 px-4">', "</div>"]),
      (tR = [
        "<div",
        ' class="flex flex-col gap-2"><p class="font-700 text-lg flex justify-between items-center"><!--$-->',
        '<!--/--><span class="w-12 icon">',
        '</span></p><div class="flex gap-3 ">',
        '</div><div class="">',
        "</div></div>",
      ]),
      (rR = [
        "<a",
        ' style="',
        '" class="bg-[#81A83E] px-2 py-1 text-sm text-white! shadow-xl rounded-md hover:bg-[#62802f] hover:text-white! hover:scale-99 transition-color transition-250">',
        "</a>",
      ]),
      (Ex = ["<div", ">", "</div>"]),
      (nR = [
        "<details",
        ' class="mb-1 cursor-pointer"><summary class="bg-gray-200 font-bold px-2 text-lg">',
        '</summary><ul class="list-unstyled flex flex-col gap-1">',
        "</ul></details>",
      ]),
      (sR = [
        "<div",
        ' class="flex justify-between w-full py-2"><p>',
        '</p><ul class="list-unstyled flex gap-2">',
        "</ul></div>",
      ]),
      (iR = [
        "<li",
        '><a class="shadow-2xl border-2 rounded-md border-[#81A83E] text-[#81A83E] px-2 py-1 text-sm hover:bg-[#81A83E] hover:text-white"',
        ">",
        "</a></li>",
      ]),
      (oR = ["<img", ' src="/images/checking_level_3.png" alt="">']),
      (aR = ["<img", ' src="/images/checking_level_2.png" alt="">']),
      (uR = ["<img", ' src="/images/checking_level_1.png" alt="">']),
      (cR = ["<img", ' src="/images/checking_level_unknown.png" alt="">']);
    (bR = pr("https://localhost:4321")),
      (j0 = fr(
        async (t, e, r) => {
          let n = t.createAstro(bR, e, r);
          n.self = j0;
          let {languageCode: s} = n.props,
            i = wx.en,
            o = wx[s],
            a = o || i,
            d = await (
              await (
                await fetch(
                  "https://bieldev.wpengine.com/wp-content/themes/bb-theme-child/data/translations.json"
                )
              ).blob()
            ).text(),
            f = await JSON.parse(d);
          console.log(`fetched ${f.length} lang data`);
          let h = f.reduce((m, g) => {
              let x = {
                code: g.code,
                name: g.name,
                englishName: g.englishName,
                direction: g.direction,
                contents: g.contents,
              };
              return (m[g.code] = x), m;
            }, {}),
            p = h.en;
          return he`${pn()}<div class="flex px-2 md:px-4 relative items-start min-h-max gap-[16px] contain mb-12"> <div class="w-10 md:w-[clamp(100px,33%,400px)] md:min-w-100px md:sticky top-0"> ${dt(
            t,
            "SideBar",
            J5,
            {
              i18Strings: a,
              langs: h,
              "client:load": !0,
              languageCode: s,
              "client:component-hydration": "load",
              "client:component-path":
                "/Users/willkelly/Documents/Work/Code/biel-frontend/src/components/TranslationsPageOld/Sidebar",
              "client:component-export": "SideBar",
            }
          )} </div> <div class="flex-grow"> ${dt(t, "MainPane", lR, {
            i18Strings: a,
            initialData: p,
            "client:load": !0,
            "client:component-hydration": "load",
            "client:component-path":
              "/Users/willkelly/Documents/Work/Code/biel-frontend/src/components/TranslationsPageOld/Pane",
            "client:component-export": "MainPane",
          })} </div> </div>`;
        },
        "/Users/willkelly/Documents/Work/Code/biel-frontend/src/components/TranslationsPageOld/TranslationPageOld.astro",
        void 0
      )),
      (yR = pr("https://localhost:4321")),
      (xR = !1),
      (sv = fr(
        async (t, e, r) => {
          let n = t.createAstro(yR, e, r);
          n.self = sv;
          let {slug: s} = n.params;
          if (!s) return n.redirect("/404");
          let i = await Tx(),
            a = s.split("/")[0] || "",
            u = i[a] ? i[a] : i.en;
          if (!u) return n.redirect("/404");
          let c = await HA(s, u.language_code),
            l = await E0("cta-interior-2", u.language_code),
            d = await E0("contact", u.language_code);
          if (!c) return n.redirect("/404");
          let f = await Ax(),
            h = new Set(Object.keys(f)),
            m = await (await fetch(c.link)).text(),
            g = new Qr().parseFromString(m, "text/html"),
            y = [
              "generateblocks-inline-css",
              "global-styles-inline-css",
              "generate-style-inline-css",
            ].map((C) => {
              let w = g.querySelector(`#${C}`);
              return w ? w.innerHTML : "";
            });
          l?.inlineStyles && y.push(l.inlineStyles),
            d?.inlineStyles && y.push(d.inlineStyles),
            (c.inlineStyles = y);
          let A = f[u.language_code]?.["header-menu"] || f.en?.["header-menu"],
            T = Object.values(i)
              .filter((C) => h.has(C.code))
              .map((C) => {
                let w = {...C},
                  k = c.otherVersions?.[w.code] || "";
                return (
                  c.uri == "/" &&
                    (k = w.code == "en" ? "/home" : `/${w.code}/home`),
                  k &&
                    (k == "/" && C.code == "en"
                      ? (w.localizedUrl = "/")
                      : (w.localizedUrl = k)),
                  w
                );
              }),
            {title: O} = c;
          return he`${dt(
            t,
            "LayoutServer",
            Rx,
            {title: O, inlineCss: y, langInfo: u, langSwitcher: T},
            {
              default: (C) =>
                he`  ${dt(C, "HeaderMenu", rv, {
                  allLangs: T,
                  currentLang: u,
                  menu: A,
                  "client:load": !0,
                  "client:component-hydration": "load",
                  "client:component-path": "@components/HeaderMenu",
                  "client:component-export": "HeaderMenu",
                })} ${pn()}<main${Xe(
                  `${!c.isHomePage && "interior-page"} `,
                  "class"
                )}> ${
                  !c.isHomePage &&
                  c.pageOptions?.topBlurb &&
                  he`<div class="pbs-40 pbe-40 bg-brand-darkest bg-gradient-to-b from-[hsla(0,0%,0%,0.5)] to-[hsla(0,0%,0%,0)]"> <div class="contain text-onSurface-invert px-4"> <h1 class="font-bold font-size-[var(--step-3)] mb-6" style=""> ${c.title} </h1> <p class="max-w-60ch font-size-[var(--step-0)]"> ${c.pageOptions.topBlurb} </p> </div> </div>`
                } ${
                  !c.isHomePage &&
                  !c.pageOptions?.topBlurb &&
                  he`<h1 class="text-center text-6xl mb-12 bg-[rgba(0,0,0,0.7)] bg-blend-overlay text-white py-20 bg-no-repeat bg-cover" style="background-image: url('/images/page_bg.jpg')"> ${c.title} </h1>`
                } ${
                  !c.isTranslationPage &&
                  he`<div${Xe(
                    `headless-insertion wp-blocks ${
                      !c.isHomePage && "site-container"
                    }`,
                    "class"
                  )}> ${c.editorBlocks
                    .filter((w) => w.parentClientId == null)
                    .map(
                      (w) =>
                        he`${dt(C, "Blocks", Os, {
                          content: mo(w.renderedHtml),
                        })}`
                    )} ${
                    Lx(c.editorBlocks) &&
                    he`<h2 class="">${H0(u.code).notYetTranslated}</h2>`
                  } </div>`
                } ${
                  c.isTranslationPage &&
                  he`${dt(C, "TranslationsPageOld", j0, {
                    languageCode: u.language_code,
                  })}`
                } ${
                  l &&
                  he`<div class="headless-insertion overflow-hidden"> ${dt(
                    C,
                    "Blocks",
                    Os,
                    {content: mo(l?.content)}
                  )} </div>`
                } ${
                  d &&
                  he`<div class="headless-insertion py-40"> ${dt(
                    C,
                    "Blocks",
                    Os,
                    {content: mo(d?.content)}
                  )} </div>`
                } </main> `,
            }
          )} `;
        },
        "/Users/willkelly/Documents/Work/Code/biel-frontend/src/pages/preview/[...slug].astro",
        void 0
      )),
      (vR =
        "/Users/willkelly/Documents/Work/Code/biel-frontend/src/pages/preview/[...slug].astro"),
      (wR = "/preview/[...slug]"),
      (SR = Object.freeze(
        Object.defineProperty(
          {__proto__: null, default: sv, file: vR, prerender: xR, url: wR},
          Symbol.toStringTag,
          {value: "Module"}
        )
      ));
  });
var av = {};
vt(av, {page: () => ER, renderers: () => St});
var ER,
  uv = b(() => {
    "use strict";
    un();
    ER = () =>
      Promise.resolve()
        .then(() => (ov(), iv))
        .then((t) => t._);
  });
var cv = {};
vt(cv, {page: () => TR, renderers: () => St});
var TR,
  lv = b(() => {
    "use strict";
    un();
    TR = () =>
      Promise.resolve()
        .then(() => (pa(), fa))
        .then((t) => t.i);
  });
var dv = {};
vt(dv, {page: () => AR, renderers: () => St});
var AR,
  fv = b(() => {
    "use strict";
    un();
    AR = () =>
      Promise.resolve()
        .then(() => (pa(), fa))
        .then((t) => t.a);
  });
un();
var v9 = Ot(wl(), 1);
Xn();
Kn();
var a6 = Object.defineProperty,
  u6 = (t, e, r) =>
    e in t
      ? a6(t, e, {enumerable: !0, configurable: !0, writable: !0, value: r})
      : (t[e] = r),
  od = (t, e, r) => (u6(t, typeof e != "symbol" ? e + "" : e, r), r),
  c6 = new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1,
  }),
  Ys = {debug: 20, info: 30, warn: 40, error: 50, silent: 90};
function ad(t, e, r, n, s = !0) {
  let i = t.level,
    o = t.dest,
    a = {label: r, level: e, message: n, newLine: s};
  l6(i, e) && o.write(a);
}
function l6(t, e) {
  return Ys[t] <= Ys[e];
}
function sm(t, e, r, n = !0) {
  return ad(t, "info", e, r, n);
}
function im(t, e, r, n = !0) {
  return ad(t, "warn", e, r, n);
}
function om(t, e, r, n = !0) {
  return ad(t, "error", e, r, n);
}
function am(...t) {
  "_astroGlobalDebug" in globalThis && globalThis._astroGlobalDebug(...t);
}
function um({level: t, label: e}) {
  let r = `${c6.format(new Date())}`,
    n = [];
  return (
    t === "error" || t === "warn"
      ? (n.push(Xl(r)), n.push(`[${t.toUpperCase()}]`))
      : n.push(r),
    e && n.push(`[${e}]`),
    t === "error"
      ? kh(n.join(" "))
      : t === "warn"
      ? Oh(n.join(" "))
      : n.length === 1
      ? Jl(n[0])
      : Jl(n[0]) + " " + Dh(n.splice(1).join(" "))
  );
}
if (typeof process < "u") {
  let t = process;
  "argv" in t &&
    Array.isArray(t.argv) &&
    (t.argv.includes("--verbose") || t.argv.includes("--silent"));
}
var Xo = class {
    constructor(e) {
      od(this, "options"), (this.options = e);
    }
    info(e, r, n = !0) {
      sm(this.options, e, r, n);
    }
    warn(e, r, n = !0) {
      im(this.options, e, r, n);
    }
    error(e, r, n = !0) {
      om(this.options, e, r, n);
    }
    debug(e, ...r) {
      am(e, ...r);
    }
    level() {
      return this.options.level;
    }
    forkIntegrationLogger(e) {
      return new Xs(this.options, e);
    }
  },
  Xs = class t {
    constructor(e, r) {
      od(this, "options"),
        od(this, "label"),
        (this.options = e),
        (this.label = r);
    }
    fork(e) {
      return new t(this.options, e);
    }
    info(e) {
      sm(this.options, this.label, e);
    }
    warn(e) {
      im(this.options, this.label, e);
    }
    error(e) {
      om(this.options, this.label, e);
    }
    debug(e) {
      am(this.label, e);
    }
  };
function d6(t) {
  for (var e = [], r = 0; r < t.length; ) {
    var n = t[r];
    if (n === "*" || n === "+" || n === "?") {
      e.push({type: "MODIFIER", index: r, value: t[r++]});
      continue;
    }
    if (n === "\\") {
      e.push({type: "ESCAPED_CHAR", index: r++, value: t[r++]});
      continue;
    }
    if (n === "{") {
      e.push({type: "OPEN", index: r, value: t[r++]});
      continue;
    }
    if (n === "}") {
      e.push({type: "CLOSE", index: r, value: t[r++]});
      continue;
    }
    if (n === ":") {
      for (var s = "", i = r + 1; i < t.length; ) {
        var o = t.charCodeAt(i);
        if (
          (o >= 48 && o <= 57) ||
          (o >= 65 && o <= 90) ||
          (o >= 97 && o <= 122) ||
          o === 95
        ) {
          s += t[i++];
          continue;
        }
        break;
      }
      if (!s) throw new TypeError("Missing parameter name at ".concat(r));
      e.push({type: "NAME", index: r, value: s}), (r = i);
      continue;
    }
    if (n === "(") {
      var a = 1,
        u = "",
        i = r + 1;
      if (t[i] === "?")
        throw new TypeError('Pattern cannot start with "?" at '.concat(i));
      for (; i < t.length; ) {
        if (t[i] === "\\") {
          u += t[i++] + t[i++];
          continue;
        }
        if (t[i] === ")") {
          if ((a--, a === 0)) {
            i++;
            break;
          }
        } else if (t[i] === "(" && (a++, t[i + 1] !== "?"))
          throw new TypeError("Capturing groups are not allowed at ".concat(i));
        u += t[i++];
      }
      if (a) throw new TypeError("Unbalanced pattern at ".concat(r));
      if (!u) throw new TypeError("Missing pattern at ".concat(r));
      e.push({type: "PATTERN", index: r, value: u}), (r = i);
      continue;
    }
    e.push({type: "CHAR", index: r, value: t[r++]});
  }
  return e.push({type: "END", index: r, value: ""}), e;
}
function f6(t, e) {
  e === void 0 && (e = {});
  for (
    var r = d6(t),
      n = e.prefixes,
      s = n === void 0 ? "./" : n,
      i = "[^".concat(m6(e.delimiter || "/#?"), "]+?"),
      o = [],
      a = 0,
      u = 0,
      c = "",
      l = function (C) {
        if (u < r.length && r[u].type === C) return r[u++].value;
      },
      d = function (C) {
        var w = l(C);
        if (w !== void 0) return w;
        var k = r[u],
          D = k.type,
          te = k.index;
        throw new TypeError(
          "Unexpected ".concat(D, " at ").concat(te, ", expected ").concat(C)
        );
      },
      f = function () {
        for (var C = "", w; (w = l("CHAR") || l("ESCAPED_CHAR")); ) C += w;
        return C;
      };
    u < r.length;

  ) {
    var h = l("CHAR"),
      p = l("NAME"),
      m = l("PATTERN");
    if (p || m) {
      var g = h || "";
      s.indexOf(g) === -1 && ((c += g), (g = "")),
        c && (o.push(c), (c = "")),
        o.push({
          name: p || a++,
          prefix: g,
          suffix: "",
          pattern: m || i,
          modifier: l("MODIFIER") || "",
        });
      continue;
    }
    var x = h || l("ESCAPED_CHAR");
    if (x) {
      c += x;
      continue;
    }
    c && (o.push(c), (c = ""));
    var y = l("OPEN");
    if (y) {
      var g = f(),
        A = l("NAME") || "",
        T = l("PATTERN") || "",
        O = f();
      d("CLOSE"),
        o.push({
          name: A || (T ? a++ : ""),
          pattern: A && !T ? i : T,
          prefix: g,
          suffix: O,
          modifier: l("MODIFIER") || "",
        });
      continue;
    }
    d("END");
  }
  return o;
}
function p6(t, e) {
  return h6(f6(t, e), e);
}
function h6(t, e) {
  e === void 0 && (e = {});
  var r = g6(e),
    n = e.encode,
    s =
      n === void 0
        ? function (u) {
            return u;
          }
        : n,
    i = e.validate,
    o = i === void 0 ? !0 : i,
    a = t.map(function (u) {
      if (typeof u == "object")
        return new RegExp("^(?:".concat(u.pattern, ")$"), r);
    });
  return function (u) {
    for (var c = "", l = 0; l < t.length; l++) {
      var d = t[l];
      if (typeof d == "string") {
        c += d;
        continue;
      }
      var f = u ? u[d.name] : void 0,
        h = d.modifier === "?" || d.modifier === "*",
        p = d.modifier === "*" || d.modifier === "+";
      if (Array.isArray(f)) {
        if (!p)
          throw new TypeError(
            'Expected "'.concat(d.name, '" to not repeat, but got an array')
          );
        if (f.length === 0) {
          if (h) continue;
          throw new TypeError('Expected "'.concat(d.name, '" to not be empty'));
        }
        for (var m = 0; m < f.length; m++) {
          var g = s(f[m], d);
          if (o && !a[l].test(g))
            throw new TypeError(
              'Expected all "'
                .concat(d.name, '" to match "')
                .concat(d.pattern, '", but got "')
                .concat(g, '"')
            );
          c += d.prefix + g + d.suffix;
        }
        continue;
      }
      if (typeof f == "string" || typeof f == "number") {
        var g = s(String(f), d);
        if (o && !a[l].test(g))
          throw new TypeError(
            'Expected "'
              .concat(d.name, '" to match "')
              .concat(d.pattern, '", but got "')
              .concat(g, '"')
          );
        c += d.prefix + g + d.suffix;
        continue;
      }
      if (!h) {
        var x = p ? "an array" : "a string";
        throw new TypeError('Expected "'.concat(d.name, '" to be ').concat(x));
      }
    }
    return c;
  };
}
function m6(t) {
  return t.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function g6(t) {
  return t && t.sensitive ? "" : "i";
}
function b6(t, e) {
  let r = t
      .map(
        (i) =>
          "/" +
          i
            .map((o) =>
              o.spread
                ? `:${o.content.slice(3)}(.*)?`
                : o.dynamic
                ? `:${o.content}`
                : o.content
                    .normalize()
                    .replace(/\?/g, "%3F")
                    .replace(/#/g, "%23")
                    .replace(/%5B/g, "[")
                    .replace(/%5D/g, "]")
                    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            )
            .join("")
      )
      .join(""),
    n = "";
  e === "always" && t.length && (n = "/");
  let s = p6(r + n);
  return (i) => s(i) || "/";
}
function Jo(t) {
  return {
    route: t.route,
    type: t.type,
    pattern: new RegExp(t.pattern),
    params: t.params,
    component: t.component,
    generate: b6(t.segments, t._meta.trailingSlash),
    pathname: t.pathname || void 0,
    segments: t.segments,
    prerender: t.prerender,
    redirect: t.redirect,
    redirectRoute: t.redirectRoute ? Jo(t.redirectRoute) : void 0,
    fallbackRoutes: t.fallbackRoutes.map((e) => Jo(e)),
    isIndex: t.isIndex,
  };
}
function y6(t) {
  let e = [];
  for (let o of t.routes) {
    e.push({...o, routeData: Jo(o.routeData)});
    let a = o;
    a.routeData = Jo(o.routeData);
  }
  let r = new Set(t.assets),
    n = new Map(t.componentMetadata),
    s = new Map(t.inlinedScripts),
    i = new Map(t.clientDirectives);
  return {
    middleware(o, a) {
      return a();
    },
    ...t,
    assets: r,
    componentMetadata: n,
    inlinedScripts: s,
    clientDirectives: i,
    routes: e,
  };
}
var cm = y6({
  adapterName: "@astrojs/cloudflare",
  routes: [
    {
      file: "404.html",
      links: [],
      scripts: [],
      styles: [],
      routeData: {
        route: "/404",
        isIndex: !1,
        type: "page",
        pattern: "^\\/404\\/?$",
        segments: [[{content: "404", dynamic: !1, spread: !1}]],
        params: [],
        component: "src/pages/404.astro",
        pathname: "/404",
        prerender: !0,
        fallbackRoutes: [],
        _meta: {trailingSlash: "ignore"},
      },
    },
    {
      file: "index.html",
      links: [],
      scripts: [],
      styles: [],
      routeData: {
        route: "/",
        isIndex: !0,
        type: "page",
        pattern: "^\\/$",
        segments: [],
        params: [],
        component: "src/pages/index.astro",
        pathname: "/",
        prerender: !0,
        fallbackRoutes: [],
        _meta: {trailingSlash: "ignore"},
      },
    },
    {
      file: "",
      links: [],
      scripts: [],
      styles: [],
      routeData: {
        type: "endpoint",
        isIndex: !1,
        route: "/_image",
        pattern: "^\\/_image$",
        segments: [[{content: "_image", dynamic: !1, spread: !1}]],
        params: [],
        component:
          "node_modules/.pnpm/astro@4.5.9_sass@1.72.0_typescript@5.4.3/node_modules/astro/dist/assets/endpoint/generic.js",
        pathname: "/_image",
        prerender: !1,
        fallbackRoutes: [],
        _meta: {trailingSlash: "ignore"},
      },
    },
    {
      file: "",
      links: [],
      scripts: [{type: "external", value: "/_astro/hoisted.eXxzXgHi.js"}],
      styles: [
        {type: "external", src: "/_astro/_slug_.CrAWrnbN.css"},
        {type: "external", src: "/_astro/_slug_.BX1LJiJX.css"},
      ],
      routeData: {
        route: "/preview/[...slug]",
        isIndex: !1,
        type: "page",
        pattern: "^\\/preview(?:\\/(.*?))?\\/?$",
        segments: [
          [{content: "preview", dynamic: !1, spread: !1}],
          [{content: "...slug", dynamic: !0, spread: !0}],
        ],
        params: ["...slug"],
        component: "src/pages/preview/[...slug].astro",
        prerender: !1,
        fallbackRoutes: [],
        _meta: {trailingSlash: "ignore"},
      },
    },
  ],
  site: "https://localhost:4321",
  base: "/",
  trailingSlash: "ignore",
  compressHTML: !0,
  componentMetadata: [
    [
      "/Users/willkelly/Documents/Work/Code/biel-frontend/src/pages/[...slug].astro",
      {propagation: "none", containsHead: !0},
    ],
    [
      "/Users/willkelly/Documents/Work/Code/biel-frontend/src/pages/index.astro",
      {propagation: "none", containsHead: !0},
    ],
    [
      "/Users/willkelly/Documents/Work/Code/biel-frontend/src/pages/preview/[...slug].astro",
      {propagation: "none", containsHead: !0},
    ],
  ],
  renderers: [],
  clientDirectives: [
    [
      "idle",
      '(()=>{var i=t=>{let e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event("astro:idle"));})();',
    ],
    [
      "load",
      '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event("astro:load"));})();',
    ],
    [
      "media",
      '(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener("change",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event("astro:media"));})();',
    ],
    [
      "only",
      '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event("astro:only"));})();',
    ],
    [
      "visible",
      '(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value=="object"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event("astro:visible"));})();',
    ],
  ],
  entryModules: {
    "\0@astrojs-ssr-virtual-entry": "_worker.mjs",
    "\0@astro-renderers": "renderers.mjs",
    "\0noop-middleware": "_noop-middleware.mjs",
    "\0@astro-page:src/pages/404@_@astro": "chunks/404_CGO19IrC.mjs",
    "\0@astro-page:src/pages/index@_@astro": "chunks/index_D6zjBkGq.mjs",
    "\0@astro-page:src/pages/preview/[...slug]@_@astro":
      "chunks/_.._BnzjTRiM.mjs",
    "\0@astro-page:src/pages/[...slug]@_@astro": "chunks/_.._g2RpvDxb.mjs",
    "\0@astro-page:node_modules/.pnpm/astro@4.5.9_sass@1.72.0_typescript@5.4.3/node_modules/astro/dist/assets/endpoint/generic@_@js":
      "chunks/generic_B_ADjQdh.mjs",
    "\0@astrojs-manifest": "manifest_D33hL7Hi.mjs",
    "/node_modules/.pnpm/astro@4.5.9_sass@1.72.0_typescript@5.4.3/node_modules/astro/dist/assets/endpoint/generic.js":
      "chunks/pages/generic_BYiY7-K-.mjs",
    "@astrojs/solid-js/client.js": "_astro/client.C-e9e_cp.js",
    "/Users/willkelly/Documents/Work/Code/biel-frontend/src/components/TranslationsPageOld/Sidebar":
      "_astro/Sidebar.cPF1rvcT.js",
    "/astro/hoisted.js?q=0": "_astro/hoisted.eXxzXgHi.js",
    "/Users/willkelly/Documents/Work/Code/biel-frontend/src/components/TranslationsPageOld/Pane":
      "_astro/Pane.DaTbrncl.js",
    "/astro/hoisted.js?q=1": "_astro/hoisted.BPRTfRfe.js",
    "/Users/willkelly/Documents/Work/Code/biel-frontend/src/pagefind/pagefind.js":
      "_astro/pagefind.ohRtrgz0.js",
    "@components/HeaderMenu": "_astro/HeaderMenu.BryA_qBZ.js",
    "astro:scripts/before-hydration.js": "",
  },
  inlinedScripts: [],
  assets: [
    "/_astro/_slug_.BX1LJiJX.css",
    "/_astro/_slug_.CrAWrnbN.css",
    "/_routes.json",
    "/apple-touch-icon.png",
    "/favicon.ico",
    "/favicon.svg",
    "/icon-16.png",
    "/icon-192.png",
    "/icon-32.png",
    "/icon-512.png",
    "/manifest.webmanifest",
    "/robots.txt",
    "/translations.json",
    "/$server_build/_noop-middleware.mjs",
    "/$server_build/_worker.mjs",
    "/$server_build/renderers.mjs",
    "/_astro/HeaderMenu.BryA_qBZ.js",
    "/_astro/Pane.DaTbrncl.js",
    "/_astro/Sidebar.cPF1rvcT.js",
    "/_astro/client.C-e9e_cp.js",
    "/_astro/hoisted.BPRTfRfe.js",
    "/_astro/hoisted.eXxzXgHi.js",
    "/_astro/index.C5o1JvWq.js",
    "/_astro/pagefind.ohRtrgz0.js",
    "/_astro/store.CQoUmkwR.js",
    "/_astro/web.DslV7Dme.js",
    "/images/checking_level_1.png",
    "/images/checking_level_2.png",
    "/images/checking_level_3.png",
    "/images/checking_level_unknown.png",
    "/images/page_bg.jpg",
    "/images/wa_logo.png",
    "/$server_build/_astro/_slug_.BX1LJiJX.css",
    "/$server_build/_astro/_slug_.CrAWrnbN.css",
    "/$server_build/chunks/404_CGO19IrC.mjs",
    "/$server_build/chunks/_.._BnzjTRiM.mjs",
    "/$server_build/chunks/_.._g2RpvDxb.mjs",
    "/$server_build/chunks/astro_R8rajw_6.mjs",
    "/$server_build/chunks/generic_B_ADjQdh.mjs",
    "/$server_build/chunks/index_D6zjBkGq.mjs",
    "/$server_build/chunks/prerender_oH3G6cLX.mjs",
    "/fonts/Lato/Lato-Black.woff2",
    "/fonts/Lato/Lato-BlackItalic.woff2",
    "/fonts/Lato/Lato-Bold.woff2",
    "/fonts/Lato/Lato-BoldItalic.woff2",
    "/fonts/Lato/Lato-Italic.woff2",
    "/fonts/Lato/Lato-Light.woff2",
    "/fonts/Lato/Lato-LightItalic.woff2",
    "/fonts/Lato/Lato-Regular.woff2",
    "/fonts/Lato/Lato-Thin.woff2",
    "/fonts/Lato/Lato-ThinItalic.woff2",
    "/fonts/NotoSans/NotoSans-Bold.woff",
    "/fonts/NotoSans/NotoSans-Bold.woff2",
    "/fonts/NotoSans/NotoSans-BoldItalic.woff",
    "/fonts/NotoSans/NotoSans-BoldItalic.woff2",
    "/fonts/NotoSans/NotoSans-ExtraBold.woff",
    "/fonts/NotoSans/NotoSans-ExtraBold.woff2",
    "/fonts/NotoSans/NotoSans-Italic.woff",
    "/fonts/NotoSans/NotoSans-Italic.woff2",
    "/fonts/NotoSans/NotoSans-Regular.woff",
    "/fonts/NotoSans/NotoSans-Regular.woff2",
    "/$server_build/chunks/astro/assets-service_BVB3qmvK.mjs",
    "/$server_build/chunks/pages/__Cl-nowLG.mjs",
    "/$server_build/chunks/pages/generic_BYiY7-K-.mjs",
    "/404.html",
    "/index.html",
  ],
  buildFormat: "directory",
});
Xn();
var Co = Ot(wl(), 1);
ia();
Kn();
var mm = (t, e) => e();
var CR = Object.defineProperty,
  RR = (t, e, r) =>
    e in t
      ? CR(t, e, {enumerable: !0, configurable: !0, writable: !0, value: r})
      : (t[e] = r),
  wo = (t, e, r) => (RR(t, typeof e != "symbol" ? e + "" : e, r), r),
  tp = (t, e, r) => {
    if (!e.has(t)) throw TypeError("Cannot " + r);
  },
  $ = (t, e, r) => (
    tp(t, e, "read from private field"), r ? r.call(t) : e.get(t)
  ),
  ce = (t, e, r) => {
    if (e.has(t))
      throw TypeError("Cannot add the same private member more than once");
    e instanceof WeakSet ? e.add(t) : e.set(t, r);
  },
  Te = (t, e, r, n) => (
    tp(t, e, "write to private field"), n ? n.call(t, r) : e.set(t, r), r
  ),
  Ee = (t, e, r) => (tp(t, e, "access private method"), r),
  So,
  nn,
  kt,
  vo,
  _c,
  B0,
  $c,
  V0,
  rp,
  yv,
  Fc,
  rn,
  Hc,
  jc,
  zc,
  qc,
  be,
  Ms,
  Or,
  Eo,
  To,
  Uc,
  Vc,
  K0,
  xv,
  Kc,
  np,
  W0,
  vv,
  G0,
  wv,
  Hn,
  _s,
  Ao,
  Bc,
  Y0,
  Sv,
  Wc,
  sp;
function NR(t, e) {
  switch (t) {
    case "always":
      return !0;
    case "never":
      return !1;
    case "ignore":
      switch (e) {
        case "directory":
          return !0;
        case "preserve":
        case "file":
          return !1;
      }
  }
}
function LR(t, e) {
  for (let r of e)
    if (typeof r == "string") {
      if (r === t) return r;
    } else for (let n of r.codes) if (n === t) return r.path;
  throw new X0();
}
function Be(t) {
  return t.replaceAll("_", "-").toLowerCase();
}
function PR(t) {
  return t.map((e) => (typeof e == "string" ? e : e.codes[0]));
}
var X0 = class extends Error {
    constructor() {
      super(`Astro encountered an unexpected line of code.
In most cases, this is not your fault, but a bug in astro code.
If there isn't one already, please create an issue.
https://astro.build/issues`);
    }
  },
  IR = new Date(0),
  pv = "deleted",
  kR = Symbol.for("astro.responseSent"),
  Gc = class {
    constructor(e) {
      this.value = e;
    }
    json() {
      if (this.value === void 0)
        throw new Error("Cannot convert undefined to an object.");
      return JSON.parse(this.value);
    }
    number() {
      return Number(this.value);
    }
    boolean() {
      return this.value === "false" || this.value === "0" ? !1 : !!this.value;
    }
  },
  Yc = class {
    constructor(e) {
      ce(this, _c),
        ce(this, $c),
        ce(this, rp),
        ce(this, So, void 0),
        ce(this, nn, void 0),
        ce(this, kt, void 0),
        ce(this, vo, void 0),
        Te(this, So, e),
        Te(this, nn, null),
        Te(this, kt, null),
        Te(this, vo, !1);
    }
    delete(e, r) {
      let n = {expires: IR};
      r?.domain && (n.domain = r.domain),
        r?.path && (n.path = r.path),
        Ee(this, $c, V0)
          .call(this)
          .set(e, [pv, (0, Co.serialize)(e, pv, n), !1]);
    }
    get(e, r = void 0) {
      if ($(this, kt)?.has(e)) {
        let [s, , i] = $(this, kt).get(e);
        return i ? new Gc(s) : void 0;
      }
      let n = Ee(this, _c, B0).call(this, r);
      if (e in n) {
        let s = n[e];
        return new Gc(s);
      }
    }
    has(e, r = void 0) {
      if ($(this, kt)?.has(e)) {
        let [, , s] = $(this, kt).get(e);
        return s;
      }
      return !!Ee(this, _c, B0).call(this, r)[e];
    }
    set(e, r, n) {
      if ($(this, vo)) {
        let o =
          new Error(`Astro.cookies.set() was called after the cookies had already been sent to the browser.
This may have happened if this method was called in an imported component.
Please make sure that Astro.cookies.set() is only called in the frontmatter of the main page.`);
        (o.name = "Warning"), console.warn(o);
      }
      let s;
      if (typeof r == "string") s = r;
      else {
        let o = r.toString();
        o === Object.prototype.toString.call(r)
          ? (s = JSON.stringify(r))
          : (s = o);
      }
      let i = {};
      if (
        (n && Object.assign(i, n),
        Ee(this, $c, V0)
          .call(this)
          .set(e, [s, (0, Co.serialize)(e, s, i), !0]),
        $(this, So)[kR])
      )
        throw new z({...Ws});
    }
    *headers() {
      if ($(this, kt) != null) for (let [, e] of $(this, kt)) yield e[1];
    }
    static consume(e) {
      return Te(e, vo, !0), e.headers();
    }
  };
So = new WeakMap();
nn = new WeakMap();
kt = new WeakMap();
vo = new WeakMap();
_c = new WeakSet();
B0 = function (t = void 0) {
  return (
    $(this, nn) || Ee(this, rp, yv).call(this, t),
    $(this, nn) || Te(this, nn, {}),
    $(this, nn)
  );
};
$c = new WeakSet();
V0 = function () {
  return $(this, kt) || Te(this, kt, new Map()), $(this, kt);
};
rp = new WeakSet();
yv = function (t = void 0) {
  let e = $(this, So).headers.get("cookie");
  e && Te(this, nn, (0, Co.parse)(e, t));
};
var Ev = Symbol.for("astro.cookies");
function OR(t, e) {
  Reflect.set(t, Ev, e);
}
function DR(t) {
  let e = Reflect.get(t, Ev);
  if (e != null) return e;
}
function* Tv(t) {
  let e = DR(t);
  if (!e) return [];
  for (let r of Yc.consume(e)) yield r;
  return [];
}
var MR = {
    write(t) {
      let e = console.error;
      return (
        Ys[t.level] < Ys.error && (e = console.log),
        t.label === "SKIP_FORMAT" ? e(t.message) : e(um(t) + " " + t.message),
        !0
      );
    },
  },
  _R = {
    default() {
      return new Response(null, {status: 301});
    },
  },
  $R = {
    page: () => Promise.resolve(_R),
    onRequest: (t, e) => e(),
    renderers: [],
  };
function FR(t) {
  return t?.type === "redirect";
}
function HR(t) {
  return t?.type === "fallback";
}
async function jR(t) {
  let {
      request: {method: e},
      routeData: r,
    } = t,
    {redirect: n, redirectRoute: s} = r,
    i = s && typeof n == "object" ? n.status : e === "GET" ? 301 : 308,
    o = {location: encodeURI(zR(t))};
  return new Response(null, {status: i, headers: o});
}
function zR(t) {
  let {
    params: e,
    routeData: {redirect: r, redirectRoute: n},
  } = t;
  if (typeof n < "u") return n?.generate(e) || n?.pathname || "/";
  if (typeof r == "string") {
    let s = r;
    for (let i of Object.keys(e)) {
      let o = e[i];
      (s = s.replace(`[${i}]`, o)), (s = s.replace(`[...${i}]`, o));
    }
    return s;
  } else if (typeof r > "u") return "/";
  return r.destination;
}
function Av(t) {
  if (t === "*") return [{locale: t, qualityValue: void 0}];
  let e = [],
    r = t.split(",").map((n) => n.trim());
  for (let n of r) {
    let s = n.split(";").map((a) => a.trim()),
      i = s[0],
      o = s[1];
    if (s)
      if (o && o.startsWith("q=")) {
        let a = Number.parseFloat(o.slice(2));
        Number.isNaN(a) || a > 1
          ? e.push({locale: i, qualityValue: void 0})
          : e.push({locale: i, qualityValue: a});
      } else e.push({locale: i, qualityValue: void 0});
  }
  return e;
}
function Cv(t, e) {
  let r = PR(e).map(Be);
  return t
    .filter((n) => (n.locale !== "*" ? r.includes(Be(n.locale)) : !0))
    .sort((n, s) => {
      if (n.qualityValue && s.qualityValue) {
        if (n.qualityValue > s.qualityValue) return -1;
        if (n.qualityValue < s.qualityValue) return 1;
      }
      return 0;
    });
}
function qR(t, e) {
  let r = t.headers.get("Accept-Language"),
    n;
  if (r) {
    let i = Cv(Av(r), e).at(0);
    if (i && i.locale !== "*")
      for (let o of e)
        if (typeof o == "string") Be(o) === Be(i.locale) && (n = o);
        else for (let a of o.codes) Be(a) === Be(i.locale) && (n = o.path);
  }
  return n;
}
function UR(t, e) {
  let r = t.headers.get("Accept-Language"),
    n = [];
  if (r) {
    let s = Cv(Av(r), e);
    if (s.length === 1 && s.at(0).locale === "*")
      return e.map((i) => (typeof i == "string" ? i : i.codes.at(0)));
    if (s.length > 0)
      for (let i of s)
        for (let o of e)
          if (typeof o == "string") Be(o) === Be(i.locale) && n.push(o);
          else for (let a of o.codes) a === i.locale && n.push(o.path);
  }
  return n;
}
function hv(t, e) {
  for (let r of t.split("/"))
    for (let n of e)
      if (typeof n == "string") {
        if (!r.includes(n)) continue;
        if (Be(n) === Be(r)) return n;
      } else {
        if (n.path === r) return n.codes.at(0);
        for (let s of n.codes) if (Be(s) === Be(r)) return s;
      }
}
async function BR(t, e, r) {
  let n = !1,
    s,
    o = t(e, async () => ((n = !0), (s = r()), s));
  return await Promise.resolve(o).then(async (a) => {
    if (n)
      if (typeof a < "u") {
        if (!(a instanceof Response)) throw new z(Vo);
        return a;
      } else {
        if (s) return s;
        throw new z(Vo);
      }
    else {
      if (typeof a > "u") throw new z(Ch);
      if (a instanceof Response) return a;
      throw new z(Vo);
    }
  });
}
function VR(...t) {
  let e = t.filter((n) => !!n),
    r = e.length;
  return r
    ? (n, s) => {
        return i(0, n);
        function i(o, a) {
          let u = e[o];
          return u(a, async () => (o < r - 1 ? i(o + 1, a) : s()));
        }
      }
    : (s, i) => i();
}
function mv(t, e) {
  let r = t.split("/");
  for (let n of r)
    for (let s of e)
      if (typeof s == "string") {
        if (Be(n) === Be(s)) return !0;
      } else if (n === s.path) return !0;
  return !1;
}
function KR(t, e, r, n) {
  if (!t) return (a, u) => u();
  let s = (a, u, c) => {
      if (a.pathname === e + "/" || a.pathname === e)
        return NR(r, n)
          ? c.redirect(`${Zo(jr(e, t.defaultLocale))}`)
          : c.redirect(`${jr(e, t.defaultLocale)}`);
      if (!mv(a.pathname, t.locales)) return z0(u);
    },
    i = (a, u) => {
      let c = !1;
      for (let l of a.pathname.split("/"))
        if (Be(l) === Be(t.defaultLocale)) {
          c = !0;
          break;
        }
      if (c) {
        let l = a.pathname.replace(`/${t.defaultLocale}`, "");
        return u.headers.set("Location", l), z0(u);
      }
    },
    o = (a, u) => {
      if (
        !(
          a.pathname === e + "/" ||
          a.pathname === e ||
          mv(a.pathname, t.locales)
        )
      )
        return z0(u);
    };
  return async (a, u) => {
    let c = await u(),
      l = c.headers.get(Yn);
    if (l !== "page" && l !== "fallback") return c;
    let {url: d, currentLocale: f} = a,
      {locales: h, defaultLocale: p, fallback: m, strategy: g} = t;
    switch (t.strategy) {
      case "domains-prefix-other-locales": {
        if (q0(t, f)) {
          let x = i(d, c);
          if (x) return x;
        }
        break;
      }
      case "pathname-prefix-other-locales": {
        let x = i(d, c);
        if (x) return x;
        break;
      }
      case "domains-prefix-always-no-redirect": {
        if (q0(t, f)) {
          let x = o(d, c);
          if (x) return x;
        }
        break;
      }
      case "pathname-prefix-always-no-redirect": {
        let x = o(d, c);
        if (x) return x;
        break;
      }
      case "pathname-prefix-always": {
        let x = s(d, c, a);
        if (x) return x;
        break;
      }
      case "domains-prefix-always": {
        if (q0(t, f)) {
          let x = s(d, c, a);
          if (x) return x;
        }
        break;
      }
    }
    if (c.status >= 300 && m) {
      let x = t.fallback ? Object.keys(t.fallback) : [],
        A = d.pathname.split("/").find((T) => {
          for (let O of h)
            if (typeof O == "string") {
              if (O === T) return !0;
            } else if (O.path === T) return !0;
          return !1;
        });
      if (A && x.includes(A)) {
        let T = m[A],
          O = LR(T, h),
          C;
        return (
          O === p && g === "pathname-prefix-other-locales"
            ? (C = d.pathname.replace(`/${A}`, ""))
            : (C = d.pathname.replace(`/${A}`, `/${O}`)),
          a.redirect(C)
        );
      }
    }
    return c;
  };
}
function z0(t) {
  return t.headers.get(fn) === "no"
    ? t
    : new Response(null, {status: 404, headers: t.headers});
}
function q0(t, e) {
  for (let r of Object.values(t.domainLookupTable)) if (r === e) return !1;
  return !0;
}
var WR = ["string", "number", "undefined"];
function GR([t, e], r) {
  if (!WR.includes(typeof e))
    throw new z({
      ...$l,
      message: $l.message(t, e, typeof e),
      location: {file: r},
    });
}
function YR(t, {ssr: e, route: r}) {
  if ((!e || r.prerender) && !t.getStaticPaths)
    throw new z({...Sh, location: {file: r.component}});
}
function XR(t, e, r) {
  if (!Array.isArray(t))
    throw new z({
      ..._l,
      message: _l.message(typeof t),
      location: {file: r.component},
    });
  t.forEach((n) => {
    if ((typeof n == "object" && Array.isArray(n)) || n === null)
      throw new z({
        ...Ml,
        message: Ml.message(Array.isArray(n) ? "array" : typeof n),
      });
    if (
      n.params === void 0 ||
      n.params === null ||
      (n.params && Object.keys(n.params).length === 0)
    )
      throw new z({...wh, location: {file: r.component}});
    for (let [s, i] of Object.entries(n.params))
      typeof i > "u" ||
        typeof i == "string" ||
        typeof i == "number" ||
        e.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${s}". A string, number or undefined value was expected, but got \`${JSON.stringify(
            i
          )}\`.`
        ),
        typeof i == "string" &&
          i === "" &&
          e.warn(
            "router",
            `getStaticPaths() returned an invalid path param: "${s}". \`undefined\` expected for an optional param, but got empty string.`
          );
  });
}
function Rv(t, e) {
  let r = Object.entries(t).reduce((n, s) => {
    GR(s, e.component);
    let [i, o] = s;
    return (
      o !== void 0 && (n[i] = typeof o == "string" ? ea(o) : o.toString()), n
    );
  }, {});
  return JSON.stringify(e.generate(r));
}
function JR(t) {
  return function (r, n = {}) {
    let {pageSize: s, params: i, props: o} = n,
      a = s || 10,
      u = "page",
      c = i || {},
      l = o || {},
      d;
    if (t.params.includes(`...${u}`)) d = !1;
    else if (t.params.includes(`${u}`)) d = !0;
    else throw new z({...Hl, message: Hl.message(u)});
    let f = Math.max(1, Math.ceil(r.length / a));
    return [...Array(f).keys()].map((p) => {
      let m = p + 1,
        g = a === 1 / 0 ? 0 : (m - 1) * a,
        x = Math.min(g + a, r.length),
        y = {...c, [u]: d || m > 1 ? String(m) : void 0},
        A = U0(t.generate({...y})),
        T = m === f ? void 0 : U0(t.generate({...y, page: String(m + 1)})),
        O =
          m === 1
            ? void 0
            : U0(
                t.generate({
                  ...y,
                  page: !d && m - 1 === 1 ? void 0 : String(m - 1),
                })
              );
      return {
        params: y,
        props: {
          ...l,
          page: {
            data: r.slice(g, x),
            start: g,
            end: x - 1,
            size: a,
            total: r.length,
            currentPage: m,
            lastPage: f,
            url: {current: A, next: T, prev: O},
          },
        },
      };
    });
  };
}
function U0(t) {
  return t === "" ? "/" : t;
}
async function ZR({mod: t, route: e, routeCache: r, logger: n, ssr: s}) {
  let i = r.get(e);
  if (!t)
    throw new Error(
      "This is an error caused by Astro and not your code. Please file an issue."
    );
  if (i?.staticPaths) return i.staticPaths;
  if ((YR(t, {ssr: s, route: e}), s && !e.prerender)) {
    let u = Object.assign([], {keyed: new Map()});
    return r.set(e, {...i, staticPaths: u}), u;
  }
  let o = [];
  if (!t.getStaticPaths) throw new Error("Unexpected Error.");
  (o = await t.getStaticPaths({paginate: JR(e)})), XR(o, n, e);
  let a = o;
  a.keyed = new Map();
  for (let u of a) {
    let c = Rv(u.params, e);
    a.keyed.set(c, u);
  }
  return r.set(e, {...i, staticPaths: a}), a;
}
var J0 = class {
  constructor(e, r = "production") {
    wo(this, "logger"),
      wo(this, "cache", {}),
      wo(this, "mode"),
      (this.logger = e),
      (this.mode = r);
  }
  clearAll() {
    this.cache = {};
  }
  set(e, r) {
    let n = this.key(e);
    this.mode === "production" &&
      this.cache[n]?.staticPaths &&
      this.logger.warn(
        null,
        `Internal Warning: route cache overwritten. (${n})`
      ),
      (this.cache[n] = r);
  }
  get(e) {
    return this.cache[this.key(e)];
  }
  key(e) {
    return `${e.route}_${e.component}`;
  }
};
function QR(t, e, r, n) {
  let s = Rv(e, r),
    i = t.keyed.get(s);
  if (i) return i;
  n.debug(
    "router",
    `findPathItemByKey() - Unexpected cache miss looking for ${s}`
  );
}
var Z0 = class {
  constructor(
    e,
    r,
    n,
    s,
    i,
    o,
    a,
    u = r.adapterName,
    c = r.clientDirectives,
    l = r.inlinedScripts,
    d = r.compressHTML,
    f = r.i18n,
    h = r.middleware,
    p = new J0(e, n),
    m = r.site ? new URL(r.site) : void 0
  ) {
    wo(this, "internalMiddleware"),
      (this.logger = e),
      (this.manifest = r),
      (this.mode = n),
      (this.renderers = s),
      (this.resolve = i),
      (this.serverLike = o),
      (this.streaming = a),
      (this.adapterName = u),
      (this.clientDirectives = c),
      (this.inlinedScripts = l),
      (this.compressHTML = d),
      (this.i18n = f),
      (this.middleware = h),
      (this.routeCache = p),
      (this.site = m),
      (this.internalMiddleware = [
        KR(f, r.base, r.trailingSlash, r.buildFormat),
      ]);
  }
};
async function eN(t) {
  let {
    logger: e,
    mod: r,
    routeData: n,
    routeCache: s,
    pathname: i,
    serverLike: o,
  } = t;
  if (!n || n.pathname) return {};
  if (FR(n) || HR(n) || n.component === Ko) return {};
  let a = Nv(n, i);
  r && tN(n, r, a);
  let u = await ZR({mod: r, route: n, routeCache: s, logger: e, ssr: o}),
    c = QR(u, a, n, e);
  if (!c && (!o || n.prerender))
    throw new z({...Uo, message: Uo.message(i), hint: Uo.hint([n.component])});
  return c?.props ? {...c.props} : {};
}
function Nv(t, e) {
  if (!t.params.length) return {};
  let r = t.pattern.exec(decodeURIComponent(e));
  if (!r) return {};
  let n = {};
  return (
    t.params.forEach((s, i) => {
      s.startsWith("...")
        ? (n[s.slice(3)] = r[i + 1] ? r[i + 1] : void 0)
        : (n[s] = r[i + 1]);
    }),
    n
  );
}
function tN(t, e, r) {
  if (t.type === "endpoint" && e.getStaticPaths) {
    let n = t.segments[t.segments.length - 1],
      s = Object.values(r),
      i = s[s.length - 1];
    if (n.length === 1 && n[0].dynamic && i === void 0)
      throw new z({
        ...Bo,
        message: Bo.message(t.route),
        hint: Bo.hint(t.component),
        location: {file: t.component},
      });
  }
}
function rN(t) {
  if (t && t.expressions?.length === 1) return t.expressions[0];
}
var Q0 = class {
  constructor(e, r, n) {
    if (
      (ce(this, Fc, void 0),
      ce(this, rn, void 0),
      ce(this, Hc, void 0),
      Te(this, Fc, e),
      Te(this, rn, r),
      Te(this, Hc, n),
      r)
    )
      for (let s of Object.keys(r)) {
        if (this[s] !== void 0) throw new z({...Fl, message: Fl.message(s)});
        Object.defineProperty(this, s, {
          get() {
            return !0;
          },
          enumerable: !0,
        });
      }
  }
  has(e) {
    return $(this, rn) ? !!$(this, rn)[e] : !1;
  }
  async render(e, r = []) {
    if (!$(this, rn) || !this.has(e)) return;
    let n = $(this, Fc);
    if (!Array.isArray(r))
      $(this, Hc).warn(
        null,
        `Expected second parameter to be an array, received a ${typeof r}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as a item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
      );
    else if (r.length > 0) {
      let o = $(this, rn)[e],
        a = typeof o == "function" ? await o(n) : await o,
        u = rN(a);
      if (u)
        return await hn(n, async () =>
          typeof u == "function" ? u(...r) : u
        ).then((l) => l);
      if (typeof a == "function")
        return await $r(n, a(...r)).then((c) => (c != null ? String(c) : c));
    }
    let s = await hn(n, $(this, rn)[e]);
    return Fr(n, s);
  }
};
Fc = new WeakMap();
rn = new WeakMap();
Hc = new WeakMap();
var nN = class Lv {
  constructor(
    e,
    r,
    n,
    s,
    i,
    o,
    a,
    u = new Yc(i),
    c = Nv(o, s),
    l = new URL(i.url)
  ) {
    ce(this, jc, void 0),
      ce(this, zc, void 0),
      ce(this, qc, void 0),
      (this.pipeline = e),
      (this.locals = r),
      (this.middleware = n),
      (this.pathname = s),
      (this.request = i),
      (this.routeData = o),
      (this.status = a),
      (this.cookies = u),
      (this.params = c),
      (this.url = l);
  }
  static create({
    locals: e = {},
    middleware: r,
    pathname: n,
    pipeline: s,
    request: i,
    routeData: o,
    status: a = 200,
  }) {
    return new Lv(
      s,
      e,
      VR(...s.internalMiddleware, r ?? s.middleware),
      n,
      i,
      o,
      a
    );
  }
  async render(e) {
    let {
        cookies: r,
        middleware: n,
        pathname: s,
        pipeline: i,
        routeData: o,
      } = this,
      {logger: a, routeCache: u, serverLike: c, streaming: l} = i,
      d = await eN({
        mod: e,
        routeData: o,
        routeCache: u,
        pathname: s,
        logger: a,
        serverLike: c,
      }),
      f = this.createAPIContext(d),
      p = await BR(n, f, async () => {
        switch (o.type) {
          case "endpoint":
            return Mh(e, f, c, a);
          case "redirect":
            return jR(this);
          case "page": {
            let m = await this.createResult(e),
              g;
            try {
              g = await tm(m, e?.default, d, {}, l, o);
            } catch (x) {
              throw ((m.cancelled = !0), x);
            }
            return (
              g.headers.set(Yn, "page"),
              (o.route === "/404" || o.route === "/500") &&
                g.headers.set(fn, "no"),
              g
            );
          }
          case "fallback":
            return new Response(null, {
              status: 500,
              headers: {[Yn]: "fallback"},
            });
        }
      });
    return p.headers.get(Yn) && p.headers.delete(Yn), OR(p, r), p;
  }
  createAPIContext(e) {
    let r = this,
      {cookies: n, params: s, pipeline: i, request: o, url: a} = this,
      u = `Astro v${Wl}`;
    return {
      cookies: n,
      get clientAddress() {
        return r.clientAddress();
      },
      get currentLocale() {
        return r.computeCurrentLocale();
      },
      generator: u,
      get locals() {
        return r.locals;
      },
      set locals(l) {
        if (typeof l != "object") throw new z(Vl);
        (r.locals = l), Reflect.set(o, Yl, l);
      },
      params: s,
      get preferredLocale() {
        return r.computePreferredLocale();
      },
      get preferredLocaleList() {
        return r.computePreferredLocaleList();
      },
      props: e,
      redirect: (l, d = 302) =>
        new Response(null, {status: d, headers: {Location: l}}),
      request: o,
      site: i.site,
      url: a,
    };
  }
  async createResult(e) {
    let {cookies: r, pathname: n, pipeline: s, routeData: i, status: o} = this,
      {
        clientDirectives: a,
        inlinedScripts: u,
        compressHTML: c,
        manifest: l,
        renderers: d,
        resolve: f,
      } = s,
      {links: h, scripts: p, styles: m} = await s.headElements(i),
      g = (await s.componentMetadata(i)) ?? l.componentMetadata,
      x = new Headers({"Content-Type": "text/html"}),
      y = !!e.partial,
      T = {
        cancelled: !1,
        clientDirectives: a,
        inlinedScripts: u,
        componentMetadata: g,
        compressHTML: c,
        cookies: r,
        createAstro: (O, C, w) => this.createAstro(T, O, C, w),
        links: h,
        partial: y,
        pathname: n,
        renderers: d,
        resolve: f,
        response: {
          status: o,
          statusText: "OK",
          get headers() {
            return x;
          },
          set headers(O) {
            throw new z(Rh);
          },
        },
        scripts: p,
        styles: m,
        _metadata: {
          hasHydrationScript: !1,
          rendererSpecificHydrationScripts: new Set(),
          hasRenderedHead: !1,
          renderedScripts: new Set(),
          hasDirectives: new Set(),
          headInTree: !1,
          extraHead: [],
          propagators: new Set(),
        },
      };
    return T;
  }
  createAstro(e, r, n, s) {
    let i = this,
      {
        cookies: o,
        locals: a,
        params: u,
        pipeline: c,
        request: l,
        url: d,
      } = this,
      {response: f} = e,
      h = (g, x = 302) => {
        if (l[Go]) throw new z({...Ws});
        return new Response(null, {status: x, headers: {Location: g}});
      },
      p = new Q0(e, s, c.logger);
    return {
      ...r,
      cookies: o,
      get clientAddress() {
        return i.clientAddress();
      },
      get currentLocale() {
        return i.computeCurrentLocale();
      },
      params: u,
      get preferredLocale() {
        return i.computePreferredLocale();
      },
      get preferredLocaleList() {
        return i.computePreferredLocaleList();
      },
      props: n,
      locals: a,
      redirect: h,
      request: l,
      response: f,
      slots: p,
      site: c.site,
      url: d,
    };
  }
  clientAddress() {
    let {pipeline: e, request: r} = this;
    if (Wo in r) return Reflect.get(r, Wo);
    throw e.adapterName
      ? new z({...Dl, message: Dl.message(e.adapterName)})
      : new z(vh);
  }
  computeCurrentLocale() {
    let {
      url: e,
      pipeline: {i18n: r},
      routeData: n,
    } = this;
    if (!r) return;
    let {defaultLocale: s, locales: i, strategy: o} = r,
      a =
        o === "pathname-prefix-other-locales" ||
        o === "domains-prefix-other-locales"
          ? s
          : void 0;
    return (
      $(this, jc) ?? Te(this, jc, hv(n.route, i) ?? hv(e.pathname, i) ?? a)
    );
  }
  computePreferredLocale() {
    let {
      pipeline: {i18n: e},
      request: r,
    } = this;
    if (e) return $(this, zc) ?? Te(this, zc, qR(r, e.locales));
  }
  computePreferredLocaleList() {
    let {
      pipeline: {i18n: e},
      request: r,
    } = this;
    if (e) return $(this, qc) ?? Te(this, qc, UR(r, e.locales));
  }
};
jc = new WeakMap();
zc = new WeakMap();
qc = new WeakMap();
var Pv = nN;
function sN(t, e) {
  if (!e) return "";
  if (typeof e == "string") return e;
  let r = t.slice(1);
  return e[r] ? e[r] : e.fallback;
}
function ip(t, e, r) {
  if (r) {
    let n = sN(ud(t), r);
    return jr(n, ta(t));
  } else return e ? Jn(jr(e, ta(t))) : t;
}
function iN(t, e, r) {
  return t.type === "inline"
    ? {props: {}, children: t.content}
    : {props: {rel: "stylesheet", href: ip(t.src, e, r)}, children: ""};
}
function oN(t, e, r) {
  return new Set(t.map((n) => iN(n, e, r)));
}
function aN(t, e, r) {
  return t.type === "external"
    ? uN(t.value, e, r)
    : {props: {type: "module"}, children: t.value};
}
function uN(t, e, r) {
  return {props: {type: "module", src: ip(t, e, r)}, children: ""};
}
function cN(t) {
  return (
    t.routes.some((e) => e.route === "/404") ||
      t.routes.push({
        component: Ko,
        generate: () => "",
        params: [],
        pattern: /\/404/,
        prerender: !1,
        segments: [],
        type: "page",
        route: "/404",
        fallbackRoutes: [],
        isIndex: !1,
      }),
    t
  );
}
function Iv(t, e) {
  let r = decodeURI(t);
  return e.routes.find(
    (n) => n.pattern.test(r) || n.fallbackRoutes.some((s) => s.pattern.test(r))
  );
}
var ep = class t extends Z0 {
    static create({
      logger: e,
      manifest: r,
      mode: n,
      renderers: s,
      resolve: i,
      serverLike: o,
      streaming: a,
    }) {
      return new t(e, r, n, s, i, o, a);
    }
    headElements(e) {
      let r = this.manifest.routes.find((o) => o.routeData === e),
        n = new Set(),
        s = new Set(),
        i = oN(r?.styles ?? []);
      for (let o of r?.scripts ?? [])
        "stage" in o
          ? o.stage === "head-inline" &&
            s.add({props: {}, children: o.children})
          : s.add(aN(o));
      return {links: n, styles: i, scripts: s};
    }
    componentMetadata() {}
  },
  kv = class Ov {
    constructor(e, r = !0) {
      ce(this, K0),
        ce(this, Kc),
        ce(this, W0),
        ce(this, G0),
        ce(this, Hn),
        ce(this, Ao),
        ce(this, Y0),
        ce(this, Wc),
        ce(this, be, void 0),
        ce(this, Ms, void 0),
        ce(this, Or, new Xo({dest: MR, level: "info"})),
        ce(this, Eo, void 0),
        ce(this, To, void 0),
        ce(this, Uc, void 0),
        ce(this, Vc, !1),
        Te(this, be, e),
        Te(this, Ms, cN({routes: e.routes.map((n) => n.routeData)})),
        Te(this, Eo, Js($(this, be).base)),
        Te(this, To, Ee(this, K0, xv).call(this, r)),
        Te(this, Uc, new Xs($(this, Or).options, $(this, be).adapterName));
    }
    getAdapterLogger() {
      return $(this, Uc);
    }
    set setManifestData(e) {
      Te(this, Ms, e);
    }
    removeBase(e) {
      return e.startsWith($(this, be).base)
        ? e.slice($(this, Eo).length + 1)
        : e;
    }
    match(e) {
      let r = new URL(e.url);
      if ($(this, be).assets.has(r.pathname)) return;
      let n = Ee(this, W0, vv).call(this, e);
      n || (n = Jn(this.removeBase(r.pathname)));
      let s = Iv(n, $(this, Ms));
      if (!(!s || s.prerender)) return s;
    }
    async render(e, r, n) {
      let s, i, o, a;
      if (
        (r &&
        ("addCookieHeader" in r ||
          "clientAddress" in r ||
          "locals" in r ||
          "routeData" in r)
          ? ("addCookieHeader" in r && (a = r.addCookieHeader),
            "clientAddress" in r && (o = r.clientAddress),
            "routeData" in r && (s = r.routeData),
            "locals" in r && (i = r.locals))
          : ((s = r), (i = n), (r || i) && Ee(this, G0, wv).call(this)),
        i)
      ) {
        if (typeof i != "object")
          return (
            $(this, Or).error(null, new z(Vl).stack),
            Ee(this, Hn, _s).call(this, e, {status: 500})
          );
        Reflect.set(e, Yl, i);
      }
      if (
        (o && Reflect.set(e, Wo, o),
        e.url !== Qo(e.url) && (e = new Request(Qo(e.url), e)),
        s || (s = this.match(e)),
        !s)
      )
        return Ee(this, Hn, _s).call(this, e, {locals: i, status: 404});
      let u = Ee(this, Kc, np).call(this, e),
        c = Ee(this, Y0, Sv).call(this, s, u),
        l = await Ee(this, Wc, sp).call(this, s),
        d;
      try {
        d = await Pv.create({
          pipeline: $(this, To),
          locals: i,
          pathname: u,
          request: e,
          routeData: s,
          status: c,
        }).render(await l.page());
      } catch (f) {
        return (
          $(this, Or).error(null, f.stack || f.message || String(f)),
          Ee(this, Hn, _s).call(this, e, {locals: i, status: 500})
        );
      }
      if (Gl.includes(d.status) && d.headers.get(fn) !== "no")
        return Ee(this, Hn, _s).call(this, e, {
          locals: i,
          response: d,
          status: d.status,
        });
      if ((d.headers.has(fn) && d.headers.delete(fn), a))
        for (let f of Ov.getSetCookieFromResponse(d))
          d.headers.append("set-cookie", f);
      return Reflect.set(d, Go, !0), d;
    }
    setCookieHeaders(e) {
      return Tv(e);
    }
  };
be = new WeakMap();
Ms = new WeakMap();
Or = new WeakMap();
Eo = new WeakMap();
To = new WeakMap();
Uc = new WeakMap();
Vc = new WeakMap();
K0 = new WeakSet();
xv = function (t = !1) {
  return ep.create({
    logger: $(this, Or),
    manifest: $(this, be),
    mode: "production",
    renderers: $(this, be).renderers,
    resolve: async (e) => {
      if (!(e in $(this, be).entryModules))
        throw new Error(`Unable to resolve [${e}]`);
      let r = $(this, be).entryModules[e];
      switch (!0) {
        case r.startsWith("data:"):
        case r.length === 0:
          return r;
        default:
          return ip(r, $(this, be).base, $(this, be).assetsPrefix);
      }
    },
    serverLike: !0,
    streaming: t,
  });
};
Kc = new WeakSet();
np = function (t) {
  let e = new URL(t.url);
  return Jn(this.removeBase(e.pathname));
};
W0 = new WeakSet();
vv = function (t) {
  let e,
    r = new URL(t.url);
  if (
    $(this, be).i18n &&
    ($(this, be).i18n.strategy === "domains-prefix-always" ||
      $(this, be).i18n.strategy === "domains-prefix-other-locales" ||
      $(this, be).i18n.strategy === "domains-prefix-always-no-redirect")
  ) {
    let n = t.headers.get("X-Forwarded-Host"),
      s = t.headers.get("X-Forwarded-Proto");
    if (
      (s ? (s = s + ":") : (s = r.protocol),
      n || (n = t.headers.get("Host")),
      n && s)
    ) {
      n = n.split(":")[0];
      try {
        let i,
          o = new URL(`${s}//${n}`);
        for (let [a, u] of Object.entries($(this, be).i18n.domainLookupTable)) {
          let c = new URL(a);
          if (o.host === c.host && o.protocol === c.protocol) {
            i = u;
            break;
          }
        }
        i &&
          ((e = Jn(jr(Be(i), this.removeBase(r.pathname)))),
          r.pathname.endsWith("/") && (e = Zo(e)));
      } catch (i) {
        $(this, Or).error(
          "router",
          `Astro tried to parse ${s}//${n} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
        ),
          $(this, Or).error("router", `Error: ${i}`);
      }
    }
  }
  return e;
};
G0 = new WeakSet();
wv = function () {
  $(this, Vc) ||
    ($(this, Or).warn(
      "deprecated",
      `The adapter ${
        $(this, be).adapterName
      } is using a deprecated signature of the 'app.render()' method. From Astro 4.0, locals and routeData are provided as properties on an optional object to this method. Using the old signature will cause an error in Astro 5.0. See https://github.com/withastro/astro/pull/9199 for more information.`
    ),
    Te(this, Vc, !0));
};
Hn = new WeakSet();
_s = async function (
  t,
  {locals: e, status: r, response: n, skipMiddleware: s = !1}
) {
  let i = `/${r}${$(this, be).trailingSlash === "always" ? "/" : ""}`,
    o = Iv(i, $(this, Ms)),
    a = new URL(t.url);
  if (o) {
    if (o.prerender) {
      let l = o.route.endsWith(`/${r}`) ? ".html" : "",
        d = new URL(`${$(this, Eo)}/${r}${l}`, a),
        f = await fetch(d.toString()),
        h = {status: r};
      return Ee(this, Ao, Bc).call(this, f, n, h);
    }
    let c = await Ee(this, Wc, sp).call(this, o);
    try {
      let d = await Pv.create({
        locals: e,
        pipeline: $(this, To),
        middleware: s ? (f, h) => h() : void 0,
        pathname: Ee(this, Kc, np).call(this, t),
        request: t,
        routeData: o,
        status: r,
      }).render(await c.page());
      return Ee(this, Ao, Bc).call(this, d, n);
    } catch {
      if (s === !1)
        return Ee(this, Hn, _s).call(this, t, {
          locals: e,
          status: r,
          response: n,
          skipMiddleware: !0,
        });
    }
  }
  let u = Ee(this, Ao, Bc).call(this, new Response(null, {status: r}), n);
  return Reflect.set(u, Go, !0), u;
};
Ao = new WeakSet();
Bc = function (t, e, r) {
  if (!e)
    return r !== void 0
      ? new Response(t.body, {
          status: r.status,
          statusText: t.statusText,
          headers: t.headers,
        })
      : t;
  let n = r?.status ? r.status : e.status === 200 ? t.status : e.status;
  try {
    e.headers.delete("Content-type");
  } catch {}
  return new Response(t.body, {
    status: n,
    statusText: n === 200 ? t.statusText : e.statusText,
    headers: new Headers([...Array.from(t.headers), ...Array.from(e.headers)]),
  });
};
Y0 = new WeakSet();
Sv = function (t, e) {
  if (!t.pattern.exec(e)) {
    for (let n of t.fallbackRoutes) if (n.pattern.test(e)) return 302;
  }
  let r = Js(t.route);
  return r.endsWith("/404") ? 404 : r.endsWith("/500") ? 500 : 200;
};
Wc = new WeakSet();
sp = async function (t) {
  if (t.component === Ko)
    return {
      page: async () => ({default: () => new Response(null, {status: 404})}),
      renderers: [],
    };
  if (t.type === "redirect") return $R;
  if ($(this, be).pageMap) {
    let e = $(this, be).pageMap.get(t.component);
    if (!e)
      throw new Error(
        `Unexpectedly unable to find a component instance for route ${t.route}`
      );
    return await e();
  } else {
    if ($(this, be).pageModule) return $(this, be).pageModule;
    throw new Error(
      "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
    );
  }
};
wo(kv, "getSetCookieFromResponse", Tv);
var lN = kv,
  dN =
    typeof process == "object" &&
    Object.prototype.toString.call(process) === "[object process]";
function fN() {
  return new Proxy(
    {},
    {
      get: (t, e) => {
        console.warn(
          `Unable to access \`import.meta\0.env.${e.toString()}\` on initialization as the Cloudflare platform only provides the environment variables per request. Please move the environment variable access inside a function that's only called after a request has been received.`
        );
      },
    }
  );
}
dN || (process.env = fN());
function Dv(t) {
  let e = new lN(t);
  return {
    onRequest: async (n) => {
      let s = n.request,
        {env: i} = n;
      process.env = i;
      let {pathname: o} = new URL(s.url);
      if (t.assets.has(o)) return i.ASSETS.fetch(s);
      let a = e.match(s);
      Reflect.set(
        s,
        Symbol.for("astro.clientAddress"),
        s.headers.get("cf-connecting-ip")
      );
      let u = {
          runtime: {
            waitUntil: (l) => {
              n.waitUntil(l);
            },
            env: n.env,
            cf: s.cf,
            caches,
          },
        },
        c = await e.render(s, {routeData: a, locals: u});
      if (e.setCookieHeaders)
        for (let l of e.setCookieHeaders(c)) c.headers.append("Set-Cookie", l);
      return c;
    },
    manifest: t,
  };
}
var gv = Object.freeze(
    Object.defineProperty(
      {__proto__: null, createExports: Dv},
      Symbol.toStringTag,
      {value: "Module"}
    )
  ),
  pN = () => Promise.resolve().then(() => (Dm(), Om)),
  hN = () => Promise.resolve().then(() => (_m(), Mm)),
  mN = () => Promise.resolve().then(() => (uv(), av)),
  gN = () => Promise.resolve().then(() => (lv(), cv)),
  bN = () => Promise.resolve().then(() => (fv(), dv)),
  yN = new Map([
    [
      "node_modules/.pnpm/astro@4.5.9_sass@1.72.0_typescript@5.4.3/node_modules/astro/dist/assets/endpoint/generic.js",
      pN,
    ],
    ["src/pages/404.astro", hN],
    ["src/pages/preview/[...slug].astro", mN],
    ["src/pages/index.astro", gN],
    ["src/pages/[...slug].astro", bN],
  ]),
  Mv = Object.assign(cm, {pageMap: yN, renderers: St, middleware: mm}),
  xN = void 0,
  _v = Dv(Mv),
  tz = _v.onRequest,
  rz = _v.manifest,
  bv = "start";
bv in gv && gv[bv](Mv, xN);
export {rz as manifest, tz as onRequest, yN as pageMap};
/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*! https://mths.be/cssesc v3.0.0 by @mathias */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/collections/src/useCollection.ts
 */
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dismissable-layer/src/DismissableLayer.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/dismissable/src/layer-stack.ts
 */
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/focus-scope/src/FocusScope.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/focus-scope/src/focus-on-child-unmount.ts
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/focus-scope/src/focus-containment.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/live-announcer/src/LiveAnnouncer.tsx
 */
/*!
 * This file is based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/ariaHideOutside.ts
 */
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/dismissable-layer/src/DismissableLayer.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/interact-outside/src/index.ts
 */
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/presence/src/Presence.tsx
 * https://github.com/radix-ui/primitives/blob/21a7c97dc8efa79fecca36428eec49f187294085/packages/react/presence/src/useStateMachine.tsx
 */
/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the ariakit team:
 * https://github.com/ariakit/ariakit/blob/8a13899ff807bbf39f3d89d2d5964042ba4d5287/packages/ariakit-react-utils/src/hooks.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/utils.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/useDefaultLocale.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/useCollator.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/Selection.ts
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/types.ts
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-types/shared/src/selection.d.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/utils.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/useMultipleSelectionState.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useTypeSelect.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableCollection.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableItem.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/selection/src/SelectionManager.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/list/src/ListCollection.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bfce84fee12a027d9cbc38b43e1747e3e4b4b169/packages/@react-stately/list/src/useListState.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/ListKeyboardDelegate.ts
 */
/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableList.ts
 */
/*!
 * Portions of this file are based on code from ariakit
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the ariakit team:
 * https://github.com/hope-ui/hope-ui/blob/54125b130195f37161dbeeea0c21dc3b198bc3ac/packages/core/src/button/is-button.ts
 */
/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-state.ts
 */
/*!
 * Portions of this file are based on code from ariakit.
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection.tsx
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-state.ts
 * https://github.com/ariakit/ariakit/blob/da142672eddefa99365773ced72171facc06fdcb/packages/ariakit/src/collection/collection-item.ts
 */
/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */
/*! Bundled license information:

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
