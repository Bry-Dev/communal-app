import{b as H,h as g,a as j,ac as y,R as F,H as G,r as K,s as Z,i as D,l as L,m as q,p as w,U as $,j as z,ad as V,ae as J,a1 as O,q as Q,S as M,N as W,af as X,ag as k,a6 as Y,f as x,ah as ee,d as P,ai as re,M as ae,w as se,aj as ne,ak as ie,a0 as fe,al as te,am as ue,an as le}from"./C2k3T2yR.js";import{p as ce}from"./BPgIlUMu.js";function Ie(e,r,[n,i]=[0,0]){g&&n===0&&j();var f=e,a=null,t=null,o=$,b=n>0?y:0,l=!1;const A=(u,c=!0)=>{l=!0,d(c,u)},d=(u,c)=>{if(o===(o=u))return;let I=!1;if(g&&i!==-1){if(n===0){const _=f.data;_===F?i=0:_===G?i=1/0:(i=parseInt(_.substring(1)),i!==i&&(i=o?1/0:-1))}const p=i>n;!!o===p&&(f=K(),Z(f),D(!1),I=!0,i=-1)}o?(a?L(a):c&&(a=q(()=>c(f))),t&&w(t,()=>{t=null})):(t?L(t):c&&(t=q(()=>c(f,[n+1,i]))),a&&w(a,()=>{a=null})),I&&D(!0)};H(()=>{l=!1,r(A),l||d(null,null)},b),g&&(f=z)}function U(e,r){return e===r||(e==null?void 0:e[M])===r}function Se(e={},r,n,i){return V(()=>{var f,a;return J(()=>{f=a,a=[],O(()=>{e!==n(...a)&&(r(e,...a),f&&U(n(...f),e)&&r(null,...f))})}),()=>{Q(()=>{a&&U(n(...a),e)&&r(null,...a)})}}),e}let R=!1;function _e(e){var r=R;try{return R=!1,[e(),R]}finally{R=r}}const ve={get(e,r){if(!e.exclude.includes(r))return e.props[r]},set(e,r){return!1},getOwnPropertyDescriptor(e,r){if(!e.exclude.includes(r)&&r in e.props)return{enumerable:!0,configurable:!0,value:e.props[r]}},has(e,r){return e.exclude.includes(r)?!1:r in e.props},ownKeys(e){return Reflect.ownKeys(e.props).filter(r=>!e.exclude.includes(r))}};function Pe(e,r,n){return new Proxy({props:e,exclude:r},ve)}function B(e){var r;return((r=e.ctx)==null?void 0:r.d)??!1}function be(e,r,n,i){var N;var f=(n&ue)!==0,a=!fe||(n&te)!==0,t=(n&ne)!==0,o=(n&le)!==0,b=!1,l;t?[l,b]=_e(()=>e[r]):l=e[r];var A=M in e||ie in e,d=t&&(((N=W(e,r))==null?void 0:N.set)??(A&&r in e&&(s=>e[r]=s)))||void 0,u=i,c=!0,I=!1,p=()=>(I=!0,c&&(c=!1,o?u=O(i):u=i),u);l===void 0&&i!==void 0&&(d&&a&&X(),l=p(),d&&d(l));var _;if(a)_=()=>{var s=e[r];return s===void 0?p():(c=!0,I=!1,s)};else{var m=(f?Y:x)(()=>e[r]);m.f|=k,_=()=>{var s=P(m);return s!==void 0&&(u=void 0),s===void 0?u:s}}if((n&ee)===0)return _;if(d){var C=e.$$legacy;return function(s,S){return arguments.length>0?((!a||!S||C||b)&&d(S?_():s),s):_()}}var E=!1,T=se(l),v=Y(()=>{var s=_(),S=P(T);return E?(E=!1,S):T.v=s});return t&&P(v),f||(v.equals=re),function(s,S){if(arguments.length>0){const h=S?P(v):a&&t?ce(s):s;if(!v.equals(h)){if(E=!0,ae(T,h),I&&u!==void 0&&(u=h),B(v))return s;O(()=>P(v))}return s}return B(v)?v.v:P(v)}}export{Se as b,Ie as i,be as p,Pe as r};
