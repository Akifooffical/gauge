// Gauge — canlı arka plan sahneleri (fragment shader kaynakları).
// Prototip: Gauge Sekmeli Arka Planlar.dc.html · Palet: globals.css (--signal / --gold / --accent-3)
const HEAD = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uLight;
const vec3 SIG=vec3(.545,.424,1.); const vec3 GLD=vec3(.2,.878,.839); const vec3 PNK=vec3(1.,.361,.541);
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}
vec3 toneMap(vec3 col){float e=clamp(max(col.r,max(col.g,col.b)),0.,1.);vec3 h=col/max(e,1e-3);vec3 l=mix(vec3(.955,.951,.945),h*.5,e*.92);return mix(col,l,uLight);}
`;

// 0 signal flow · 1 prismatic dial · 2 onboarding stair · 3 competitor radar · 4 layered engines · 5 geo-grid
export const SCENES = {
signalFlow: HEAD + `void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  float t=uTime*.5; vec2 c=uMouse*.24;
  vec3 col=vec3(.019,.019,.038);
  col+=SIG*.055*fbm(uv*2.6+vec2(t*.3,-t*.2));
  float r=length(uv-c);
  for(int i=0;i<5;i++){
    float fi=float(i);
    float a=6.2831*(fi/5.)+.28*sin(t*.45+fi*1.3);
    vec2 dir=vec2(cos(a),sin(a));
    float s=dot(uv-c,dir), o=dot(uv-c,vec2(-dir.y,dir.x));
    float bend=.11*sin(s*3.1-t*2.2+fi)*smoothstep(0.,1.1,s);
    float dist=abs(o-bend);
    vec3 lc=mix(SIG,GLD,fract(fi*.41));
    col+=exp(-dist*40.)*smoothstep(1.7,.04,s)*step(0.,s)*lc*.5;
    float pk=0.;
    for(int k=0;k<4;k++){
      float pos=fract(t*.6+fi*.23+float(k)*.25);
      pk+=exp(-abs(s-1.75*(1.-pos))*34.)*exp(-dist*62.)*(.35+.65*pos);
    }
    col+=pk*mix(lc,vec3(1.),.4)*1.7;
  }
  col+=exp(-r*9.5)*mix(SIG,vec3(1.),.35)*.95;
  col+=exp(-r*32.)*vec3(1.,.98,1.)*1.15;
  col+=exp(-abs(r-.20-.022*sin(t*2.2))*55.)*GLD*.95;
  col*=1.-.46*smoothstep(.42,1.25,length(uv));
  gl_FragColor=vec4(toneMap(max(col,0.)),1.);
}`,
prismaticDial: HEAD + `void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  uv+=uMouse*.05;
  vec3 col=vec3(.021,.021,.041);
  vec2 p=uv-vec2(0.,-.03);
  p.y/=(.46+uMouse.y*.14);
  float r=length(p), a=atan(p.y,p.x), t=uTime;
  float persp=.55+.5*smoothstep(-1.4,1.4,p.y);
  for(int i=0;i<4;i++){
    float ri=.28+float(i)*.16, w=.006+float(i)*.0022;
    col+=exp(-abs(r-ri)/w)*mix(SIG,GLD,float(i)*.32)*.34*persp;
  }
  col+=exp(-abs(fract(a*30./6.2831)-.5)*7.)*exp(-abs(r-.62)/.045)*GLD*.55*persp;
  float val=.55+.36*sin(t*.4);
  col+=smoothstep(0.,.015,val-(a+3.14159)/6.28318)*exp(-abs(r-.44)/.013)*PNK*1.25*persp;
  float na=-3.14159+6.28318*val; vec2 nd=vec2(cos(na),sin(na));
  float along=dot(p,nd), off=abs(dot(p,vec2(-nd.y,nd.x)));
  col+=exp(-off*110.)*smoothstep(.8,0.,along)*step(0.,along)*vec3(1.,.96,.92)*1.35;
  col+=exp(-r*24.)*mix(GLD,vec3(1.),.55)*1.05;
  col+=exp(-abs(fract(a*3./6.2831-t*.28)-.5)*3.2)*exp(-abs(r-.78)/.028)*SIG*.7;
  col+=SIG*.05*fbm(uv*3.2+vec2(t*.2,0.));
  col*=1.-.5*smoothstep(.45,1.3,length(uv));
  gl_FragColor=vec4(toneMap(max(col,0.)),1.);
}`,
onboardingStair: HEAD + `void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  uv+=uMouse*.05;
  float t=uTime*.55;
  vec3 col=vec3(.02,.02,.04);
  col+=GLD*.045*fbm(uv*2.2+vec2(t*.3,0.));
  float prog=mod(t*.9,7.5);
  for(int i=0;i<6;i++){
    float fi=float(i);
    float x0=-.72+fi*.29, top=-.34+fi*.13, w=.105;
    float inx=step(abs(uv.x-x0),w);
    float slab=inx*step(-.58,uv.y)*step(uv.y,top);
    vec3 pc=mix(SIG,GLD,fi/5.);
    float done=smoothstep(fi-.35,fi+.35,prog);
    col+=slab*pc*(.05+.15*done);
    col+=inx*exp(-abs(uv.y-top)*34.)*mix(pc,vec3(1.),.45)*(.35+1.05*done);
    col+=exp(-abs(abs(uv.x-x0)-w)*80.)*step(-.58,uv.y)*step(uv.y,top)*pc*.55;
    col+=exp(-length((uv-vec2(x0,top))*vec2(1.,1.4))*13.)*pc*done*(.45+.55*sin(t*3.4+fi));
    float pulse=exp(-abs(prog-fi)*3.);
    col+=exp(-abs(length(uv-vec2(x0,top))-.055-.05*fract(prog))*42.)*pc*pulse*.9;
  }
  col+=exp(-abs(uv.y-(.44+.035*sin(t*1.3)))*70.)*GLD*.32;
  col*=1.-.5*smoothstep(.45,1.3,length(uv));
  gl_FragColor=vec4(toneMap(max(col,0.)),1.);
}`,
competitorRadar: HEAD + `void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 p=uv-uMouse*.10; p.y/=.78;
  float r=length(p), a=atan(p.y,p.x), t=uTime;
  vec3 col=vec3(.02,.02,.042);
  for(int i=1;i<5;i++) col+=exp(-abs(r-float(i)*.17)/.0045)*SIG*.38;
  col+=exp(-abs(fract(a*6./6.2831)-.5)*7.)*smoothstep(.70,0.,r)*SIG*.20;
  float sa=mod(t*.85,6.28318)-3.14159;
  float da=mod(a-sa+9.42477,6.28318);
  col+=exp(-da*3.2)*smoothstep(.72,0.,r)*GLD*.5;
  col+=exp(-da*70.)*smoothstep(.74,0.,r)*mix(GLD,vec3(1.),.55)*1.1;
  for(int i=0;i<9;i++){
    float fi=float(i);
    float ba=hash(vec2(fi,2.))*6.28318+.12*sin(t*.3+fi);
    float br=.13+hash(vec2(fi,5.))*.54;
    vec2 bp=vec2(cos(ba),sin(ba))*br;
    float dd=mod(sa-ba+9.42477,6.28318);
    float lit=exp(-dd*1.7)+.12;
    vec3 bc=hash(vec2(fi,8.))>.68?GLD:PNK;
    col+=exp(-length(p-bp)*(34.-11.*lit))*bc*lit*1.7;
    col+=exp(-abs(length(p-bp)-.045-.035*fract(t*.6+fi*.2))*55.)*bc*lit*.6;
  }
  col+=exp(-r*38.)*vec3(1.,.98,1.)*.85;
  col+=SIG*.04*fbm(uv*3.+vec2(t*.15,0.));
  col*=1.-.5*smoothstep(.5,1.3,length(uv));
  gl_FragColor=vec4(toneMap(max(col,0.)),1.);
}`,
layeredEngines: HEAD + `void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  float t=uTime*.45;
  vec3 col=vec3(.018,.018,.036);
  col+=SIG*.045*fbm(uv*2.4+vec2(t*.3,0.));
  for(int i=0;i<4;i++){
    float fi=float(i), depth=fi, sc=1.-depth*.12;
    float yoff=-.30+depth*.21+.032*sin(t*1.3+fi*1.2);
    vec2 q=(uv-vec2(uMouse.x*(.12-depth*.022),yoff))/sc;
    q.x-=depth*.10; q.y/=.30; q.x+=q.y*.13;
    float inside=step(abs(q.x),.62)*step(abs(q.y),.55);
    vec3 pc=mix(SIG,GLD,fi/3.);
    col+=inside*pc*.06*(1.-depth*.16);
    col+=(exp(-abs(abs(q.x)-.62)*100.)*step(abs(q.y),.55)+exp(-abs(abs(q.y)-.55)*100.)*step(abs(q.x),.62))*pc*.7;
    col+=exp(-abs(fract(q.x*6.+t*.3)-.5)*9.)*inside*pc*.09;
    float bars=0.;
    for(int k=0;k<7;k++){
      float fk=float(k), bx=-.54+fk*.18;
      float h=.10+.28*abs(sin(t*1.2+fk*.9+fi*1.7));
      float top=-.5+h*2.4;
      bars+=step(abs(q.x-bx),.026)*step(-.5,q.y)*step(q.y,top)*.75;
      bars+=step(abs(q.x-bx),.036)*exp(-abs(q.y-top)*26.)*1.6;
    }
    col+=bars*inside*mix(pc,vec3(1.),.35)*(.6-depth*.09);
    col+=inside*exp(-abs(q.x-(fract(t*.55+fi*.25)*2.4-1.2))*5.5)*mix(pc,PNK,.25)*.3;
  }
  col*=1.-.46*smoothstep(.45,1.3,length(uv));
  gl_FragColor=vec4(toneMap(max(col,0.)),1.);
}`,
geoGridRadar: HEAD + `void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 m=uMouse; float t=uTime*.35;
  float hz=.17+m.y*.06;
  vec3 col=vec3(.021,.021,.042);
  col+=SIG*.13*exp(-abs(uv.y-hz)*4.5)*(.65+.35*sin(t*1.6));
  col+=GLD*.05*fbm(uv*2.2+vec2(t*.6,-t*.2));
  if(uv.y<hz){
    float d=hz-uv.y; float z=1./(d*7.);
    float x=(uv.x-m.x*.05)*z; float zz=z+t*3.4;
    float fade=exp(-z*.20);
    float wx=clamp(.005*z,.0,.30), wz=clamp(.014*z*z,.0,.30);
    float g=smoothstep(wx,0.,abs(fract(x*.5)-.5))*1.3+smoothstep(wz,0.,abs(fract(zz*.5)-.5));
    col+=g*fade*mix(SIG,GLD,.45)*1.5;
    float rr=length(vec2(x,zz-t*3.4));
    col+=exp(-abs(fract(rr*.10-t*.85)-.03)*16.)*fade*GLD*.9;
  }
  for(int i=0;i<15;i++){
    float fi=float(i);
    float px=(hash(vec2(fi,1.))-.5)*30.;
    float pz=mod(hash(vec2(fi,7.))*26.-t*3.4,26.)+1.1;
    float dd=1./(pz*7.);
    vec2 sp=vec2(px/pz-m.x*.05,hz-dd);
    float bh=(.30+hash(vec2(fi,3.))*.85)*dd*7.5;
    float inY=step(sp.y,uv.y)*step(uv.y,sp.y+bh);
    vec3 pc=mix(SIG,PNK,hash(vec2(fi,9.)));
    float atten=exp(-pz*.09);
    col+=exp(-abs(uv.x-sp.x)/(dd*.55+.0016))*inY*mix(pc,vec3(1.),.15)*1.7*atten;
    col+=exp(-length((uv-sp)*vec2(1.,2.6))/(dd*1.9+.003))*pc*.85*atten;
    col+=exp(-length(uv-vec2(sp.x,sp.y+bh))*(52./(1.+bh*7.)))*mix(pc,vec3(1.),.55)*1.5*atten;
  }
  col*=1.-.5*smoothstep(.5,1.35,length(uv));
  gl_FragColor=vec4(toneMap(max(col,0.)),1.);
}`};

export type SceneKey = keyof typeof SCENES;
