//Func
function _free($mem){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=($mem|0)==0;
 if($1){label=140;break;}else{label=2;break;}
 case 2: 
 var $3=((($mem)-(8))|0);
 var $4=$3;
 var $5=HEAP32[((28904)>>2)];
 var $6=($3>>>0)<($5>>>0);
 if($6){label=139;break;}else{label=3;break;}
 case 3: 
 var $8=((($mem)-(4))|0);
 var $9=$8;
 var $10=HEAP32[(($9)>>2)];
 var $11=$10&3;
 var $12=($11|0)==1;
 if($12){label=139;break;}else{label=4;break;}
 case 4: 
 var $14=$10&-8;
 var $_sum=((($14)-(8))|0);
 var $15=(($mem+$_sum)|0);
 var $16=$15;
 var $17=$10&1;
 var $18=($17|0)==0;
 if($18){label=5;break;}else{var $p_0=$4;var $psize_0=$14;label=56;break;}
 case 5: 
 var $20=$3;
 var $21=HEAP32[(($20)>>2)];
 var $22=($11|0)==0;
 if($22){label=140;break;}else{label=6;break;}
 case 6: 
 var $_sum3=(((-8)-($21))|0);
 var $24=(($mem+$_sum3)|0);
 var $25=$24;
 var $26=((($21)+($14))|0);
 var $27=($24>>>0)<($5>>>0);
 if($27){label=139;break;}else{label=7;break;}
 case 7: 
 var $29=HEAP32[((28908)>>2)];
 var $30=($25|0)==($29|0);
 if($30){label=54;break;}else{label=8;break;}
 case 8: 
 var $32=$21>>>3;
 var $33=($21>>>0)<256;
 if($33){label=9;break;}else{label=21;break;}
 case 9: 
 var $_sum47=((($_sum3)+(8))|0);
 var $35=(($mem+$_sum47)|0);
 var $36=$35;
 var $37=HEAP32[(($36)>>2)];
 var $_sum48=((($_sum3)+(12))|0);
 var $38=(($mem+$_sum48)|0);
 var $39=$38;
 var $40=HEAP32[(($39)>>2)];
 var $41=$32<<1;
 var $42=((28928+($41<<2))|0);
 var $43=$42;
 var $44=($37|0)==($43|0);
 if($44){label=12;break;}else{label=10;break;}
 case 10: 
 var $46=$37;
 var $47=($46>>>0)<($5>>>0);
 if($47){label=20;break;}else{label=11;break;}
 case 11: 
 var $49=(($37+12)|0);
 var $50=HEAP32[(($49)>>2)];
 var $51=($50|0)==($25|0);
 if($51){label=12;break;}else{label=20;break;}
 case 12: 
 var $52=($40|0)==($37|0);
 if($52){label=13;break;}else{label=14;break;}
 case 13: 
 var $54=1<<$32;
 var $55=$54^-1;
 var $56=HEAP32[((28888)>>2)];
 var $57=$56&$55;
 HEAP32[((28888)>>2)]=$57;
 var $p_0=$25;var $psize_0=$26;label=56;break;
 case 14: 
 var $59=($40|0)==($43|0);
 if($59){label=15;break;}else{label=16;break;}
 case 15: 
 var $_pre82=(($40+8)|0);
 var $_pre_phi83=$_pre82;label=18;break;
 case 16: 
 var $61=$40;
 var $62=($61>>>0)<($5>>>0);
 if($62){label=19;break;}else{label=17;break;}
 case 17: 
 var $64=(($40+8)|0);
 var $65=HEAP32[(($64)>>2)];
 var $66=($65|0)==($25|0);
 if($66){var $_pre_phi83=$64;label=18;break;}else{label=19;break;}
 case 18: 
 var $_pre_phi83;
 var $67=(($37+12)|0);
 HEAP32[(($67)>>2)]=$40;
 HEAP32[(($_pre_phi83)>>2)]=$37;
 var $p_0=$25;var $psize_0=$26;label=56;break;
 case 19: 
 _abort();
 throw "Reached an unreachable!";
 case 20: 
 _abort();
 throw "Reached an unreachable!";
 case 21: 
 var $69=$24;
 var $_sum37=((($_sum3)+(24))|0);
 var $70=(($mem+$_sum37)|0);
 var $71=$70;
 var $72=HEAP32[(($71)>>2)];
 var $_sum38=((($_sum3)+(12))|0);
 var $73=(($mem+$_sum38)|0);
 var $74=$73;
 var $75=HEAP32[(($74)>>2)];
 var $76=($75|0)==($69|0);
 if($76){label=27;break;}else{label=22;break;}
 case 22: 
 var $_sum44=((($_sum3)+(8))|0);
 var $78=(($mem+$_sum44)|0);
 var $79=$78;
 var $80=HEAP32[(($79)>>2)];
 var $81=$80;
 var $82=($81>>>0)<($5>>>0);
 if($82){label=26;break;}else{label=23;break;}
 case 23: 
 var $84=(($80+12)|0);
 var $85=HEAP32[(($84)>>2)];
 var $86=($85|0)==($69|0);
 if($86){label=24;break;}else{label=26;break;}
 case 24: 
 var $88=(($75+8)|0);
 var $89=HEAP32[(($88)>>2)];
 var $90=($89|0)==($69|0);
 if($90){label=25;break;}else{label=26;break;}
 case 25: 
 HEAP32[(($84)>>2)]=$75;
 HEAP32[(($88)>>2)]=$80;
 var $R_1=$75;label=34;break;
 case 26: 
 _abort();
 throw "Reached an unreachable!";
 case 27: 
 var $_sum40=((($_sum3)+(20))|0);
 var $93=(($mem+$_sum40)|0);
 var $94=$93;
 var $95=HEAP32[(($94)>>2)];
 var $96=($95|0)==0;
 if($96){label=28;break;}else{var $R_0=$95;var $RP_0=$94;label=29;break;}
 case 28: 
 var $_sum39=((($_sum3)+(16))|0);
 var $98=(($mem+$_sum39)|0);
 var $99=$98;
 var $100=HEAP32[(($99)>>2)];
 var $101=($100|0)==0;
 if($101){var $R_1=0;label=34;break;}else{var $R_0=$100;var $RP_0=$99;label=29;break;}
 case 29: 
 var $RP_0;
 var $R_0;
 var $102=(($R_0+20)|0);
 var $103=HEAP32[(($102)>>2)];
 var $104=($103|0)==0;
 if($104){label=30;break;}else{var $R_0=$103;var $RP_0=$102;label=29;break;}
 case 30: 
 var $106=(($R_0+16)|0);
 var $107=HEAP32[(($106)>>2)];
 var $108=($107|0)==0;
 if($108){label=31;break;}else{var $R_0=$107;var $RP_0=$106;label=29;break;}
 case 31: 
 var $110=$RP_0;
 var $111=($110>>>0)<($5>>>0);
 if($111){label=33;break;}else{label=32;break;}
 case 32: 
 HEAP32[(($RP_0)>>2)]=0;
 var $R_1=$R_0;label=34;break;
 case 33: 
 _abort();
 throw "Reached an unreachable!";
 case 34: 
 var $R_1;
 var $115=($72|0)==0;
 if($115){var $p_0=$25;var $psize_0=$26;label=56;break;}else{label=35;break;}
 case 35: 
 var $_sum41=((($_sum3)+(28))|0);
 var $117=(($mem+$_sum41)|0);
 var $118=$117;
 var $119=HEAP32[(($118)>>2)];
 var $120=((29192+($119<<2))|0);
 var $121=HEAP32[(($120)>>2)];
 var $122=($69|0)==($121|0);
 if($122){label=36;break;}else{label=38;break;}
 case 36: 
 HEAP32[(($120)>>2)]=$R_1;
 var $cond=($R_1|0)==0;
 if($cond){label=37;break;}else{label=44;break;}
 case 37: 
 var $124=1<<$119;
 var $125=$124^-1;
 var $126=HEAP32[((28892)>>2)];
 var $127=$126&$125;
 HEAP32[((28892)>>2)]=$127;
 var $p_0=$25;var $psize_0=$26;label=56;break;
 case 38: 
 var $129=$72;
 var $130=HEAP32[((28904)>>2)];
 var $131=($129>>>0)<($130>>>0);
 if($131){label=42;break;}else{label=39;break;}
 case 39: 
 var $133=(($72+16)|0);
 var $134=HEAP32[(($133)>>2)];
 var $135=($134|0)==($69|0);
 if($135){label=40;break;}else{label=41;break;}
 case 40: 
 HEAP32[(($133)>>2)]=$R_1;
 label=43;break;
 case 41: 
 var $138=(($72+20)|0);
 HEAP32[(($138)>>2)]=$R_1;
 label=43;break;
 case 42: 
 _abort();
 throw "Reached an unreachable!";
 case 43: 
 var $141=($R_1|0)==0;
 if($141){var $p_0=$25;var $psize_0=$26;label=56;break;}else{label=44;break;}
 case 44: 
 var $143=$R_1;
 var $144=HEAP32[((28904)>>2)];
 var $145=($143>>>0)<($144>>>0);
 if($145){label=53;break;}else{label=45;break;}
 case 45: 
 var $147=(($R_1+24)|0);
 HEAP32[(($147)>>2)]=$72;
 var $_sum42=((($_sum3)+(16))|0);
 var $148=(($mem+$_sum42)|0);
 var $149=$148;
 var $150=HEAP32[(($149)>>2)];
 var $151=($150|0)==0;
 if($151){label=49;break;}else{label=46;break;}
 case 46: 
 var $153=$150;
 var $154=($153>>>0)<($144>>>0);
 if($154){label=48;break;}else{label=47;break;}
 case 47: 
 var $156=(($R_1+16)|0);
 HEAP32[(($156)>>2)]=$150;
 var $157=(($150+24)|0);
 HEAP32[(($157)>>2)]=$R_1;
 label=49;break;
 case 48: 
 _abort();
 throw "Reached an unreachable!";
 case 49: 
 var $_sum43=((($_sum3)+(20))|0);
 var $160=(($mem+$_sum43)|0);
 var $161=$160;
 var $162=HEAP32[(($161)>>2)];
 var $163=($162|0)==0;
 if($163){var $p_0=$25;var $psize_0=$26;label=56;break;}else{label=50;break;}
 case 50: 
 var $165=$162;
 var $166=HEAP32[((28904)>>2)];
 var $167=($165>>>0)<($166>>>0);
 if($167){label=52;break;}else{label=51;break;}
 case 51: 
 var $169=(($R_1+20)|0);
 HEAP32[(($169)>>2)]=$162;
 var $170=(($162+24)|0);
 HEAP32[(($170)>>2)]=$R_1;
 var $p_0=$25;var $psize_0=$26;label=56;break;
 case 52: 
 _abort();
 throw "Reached an unreachable!";
 case 53: 
 _abort();
 throw "Reached an unreachable!";
 case 54: 
 var $_sum4=((($14)-(4))|0);
 var $174=(($mem+$_sum4)|0);
 var $175=$174;
 var $176=HEAP32[(($175)>>2)];
 var $177=$176&3;
 var $178=($177|0)==3;
 if($178){label=55;break;}else{var $p_0=$25;var $psize_0=$26;label=56;break;}
 case 55: 
 HEAP32[((28896)>>2)]=$26;
 var $180=$176&-2;
 HEAP32[(($175)>>2)]=$180;
 var $181=$26|1;
 var $_sum35=((($_sum3)+(4))|0);
 var $182=(($mem+$_sum35)|0);
 var $183=$182;
 HEAP32[(($183)>>2)]=$181;
 var $184=$15;
 HEAP32[(($184)>>2)]=$26;
 label=140;break;
 case 56: 
 var $psize_0;
 var $p_0;
 var $186=$p_0;
 var $187=($186>>>0)<($15>>>0);
 if($187){label=57;break;}else{label=139;break;}
 case 57: 
 var $_sum34=((($14)-(4))|0);
 var $189=(($mem+$_sum34)|0);
 var $190=$189;
 var $191=HEAP32[(($190)>>2)];
 var $192=$191&1;
 var $phitmp=($192|0)==0;
 if($phitmp){label=139;break;}else{label=58;break;}
 case 58: 
 var $194=$191&2;
 var $195=($194|0)==0;
 if($195){label=59;break;}else{label=112;break;}
 case 59: 
 var $197=HEAP32[((28912)>>2)];
 var $198=($16|0)==($197|0);
 if($198){label=60;break;}else{label=62;break;}
 case 60: 
 var $200=HEAP32[((28900)>>2)];
 var $201=((($200)+($psize_0))|0);
 HEAP32[((28900)>>2)]=$201;
 HEAP32[((28912)>>2)]=$p_0;
 var $202=$201|1;
 var $203=(($p_0+4)|0);
 HEAP32[(($203)>>2)]=$202;
 var $204=HEAP32[((28908)>>2)];
 var $205=($p_0|0)==($204|0);
 if($205){label=61;break;}else{label=140;break;}
 case 61: 
 HEAP32[((28908)>>2)]=0;
 HEAP32[((28896)>>2)]=0;
 label=140;break;
 case 62: 
 var $208=HEAP32[((28908)>>2)];
 var $209=($16|0)==($208|0);
 if($209){label=63;break;}else{label=64;break;}
 case 63: 
 var $211=HEAP32[((28896)>>2)];
 var $212=((($211)+($psize_0))|0);
 HEAP32[((28896)>>2)]=$212;
 HEAP32[((28908)>>2)]=$p_0;
 var $213=$212|1;
 var $214=(($p_0+4)|0);
 HEAP32[(($214)>>2)]=$213;
 var $215=(($186+$212)|0);
 var $216=$215;
 HEAP32[(($216)>>2)]=$212;
 label=140;break;
 case 64: 
 var $218=$191&-8;
 var $219=((($218)+($psize_0))|0);
 var $220=$191>>>3;
 var $221=($191>>>0)<256;
 if($221){label=65;break;}else{label=77;break;}
 case 65: 
 var $223=(($mem+$14)|0);
 var $224=$223;
 var $225=HEAP32[(($224)>>2)];
 var $_sum2829=$14|4;
 var $226=(($mem+$_sum2829)|0);
 var $227=$226;
 var $228=HEAP32[(($227)>>2)];
 var $229=$220<<1;
 var $230=((28928+($229<<2))|0);
 var $231=$230;
 var $232=($225|0)==($231|0);
 if($232){label=68;break;}else{label=66;break;}
 case 66: 
 var $234=$225;
 var $235=HEAP32[((28904)>>2)];
 var $236=($234>>>0)<($235>>>0);
 if($236){label=76;break;}else{label=67;break;}
 case 67: 
 var $238=(($225+12)|0);
 var $239=HEAP32[(($238)>>2)];
 var $240=($239|0)==($16|0);
 if($240){label=68;break;}else{label=76;break;}
 case 68: 
 var $241=($228|0)==($225|0);
 if($241){label=69;break;}else{label=70;break;}
 case 69: 
 var $243=1<<$220;
 var $244=$243^-1;
 var $245=HEAP32[((28888)>>2)];
 var $246=$245&$244;
 HEAP32[((28888)>>2)]=$246;
 label=110;break;
 case 70: 
 var $248=($228|0)==($231|0);
 if($248){label=71;break;}else{label=72;break;}
 case 71: 
 var $_pre80=(($228+8)|0);
 var $_pre_phi81=$_pre80;label=74;break;
 case 72: 
 var $250=$228;
 var $251=HEAP32[((28904)>>2)];
 var $252=($250>>>0)<($251>>>0);
 if($252){label=75;break;}else{label=73;break;}
 case 73: 
 var $254=(($228+8)|0);
 var $255=HEAP32[(($254)>>2)];
 var $256=($255|0)==($16|0);
 if($256){var $_pre_phi81=$254;label=74;break;}else{label=75;break;}
 case 74: 
 var $_pre_phi81;
 var $257=(($225+12)|0);
 HEAP32[(($257)>>2)]=$228;
 HEAP32[(($_pre_phi81)>>2)]=$225;
 label=110;break;
 case 75: 
 _abort();
 throw "Reached an unreachable!";
 case 76: 
 _abort();
 throw "Reached an unreachable!";
 case 77: 
 var $259=$15;
 var $_sum6=((($14)+(16))|0);
 var $260=(($mem+$_sum6)|0);
 var $261=$260;
 var $262=HEAP32[(($261)>>2)];
 var $_sum78=$14|4;
 var $263=(($mem+$_sum78)|0);
 var $264=$263;
 var $265=HEAP32[(($264)>>2)];
 var $266=($265|0)==($259|0);
 if($266){label=83;break;}else{label=78;break;}
 case 78: 
 var $268=(($mem+$14)|0);
 var $269=$268;
 var $270=HEAP32[(($269)>>2)];
 var $271=$270;
 var $272=HEAP32[((28904)>>2)];
 var $273=($271>>>0)<($272>>>0);
 if($273){label=82;break;}else{label=79;break;}
 case 79: 
 var $275=(($270+12)|0);
 var $276=HEAP32[(($275)>>2)];
 var $277=($276|0)==($259|0);
 if($277){label=80;break;}else{label=82;break;}
 case 80: 
 var $279=(($265+8)|0);
 var $280=HEAP32[(($279)>>2)];
 var $281=($280|0)==($259|0);
 if($281){label=81;break;}else{label=82;break;}
 case 81: 
 HEAP32[(($275)>>2)]=$265;
 HEAP32[(($279)>>2)]=$270;
 var $R7_1=$265;label=90;break;
 case 82: 
 _abort();
 throw "Reached an unreachable!";
 case 83: 
 var $_sum10=((($14)+(12))|0);
 var $284=(($mem+$_sum10)|0);
 var $285=$284;
 var $286=HEAP32[(($285)>>2)];
 var $287=($286|0)==0;
 if($287){label=84;break;}else{var $R7_0=$286;var $RP9_0=$285;label=85;break;}
 case 84: 
 var $_sum9=((($14)+(8))|0);
 var $289=(($mem+$_sum9)|0);
 var $290=$289;
 var $291=HEAP32[(($290)>>2)];
 var $292=($291|0)==0;
 if($292){var $R7_1=0;label=90;break;}else{var $R7_0=$291;var $RP9_0=$290;label=85;break;}
 case 85: 
 var $RP9_0;
 var $R7_0;
 var $293=(($R7_0+20)|0);
 var $294=HEAP32[(($293)>>2)];
 var $295=($294|0)==0;
 if($295){label=86;break;}else{var $R7_0=$294;var $RP9_0=$293;label=85;break;}
 case 86: 
 var $297=(($R7_0+16)|0);
 var $298=HEAP32[(($297)>>2)];
 var $299=($298|0)==0;
 if($299){label=87;break;}else{var $R7_0=$298;var $RP9_0=$297;label=85;break;}
 case 87: 
 var $301=$RP9_0;
 var $302=HEAP32[((28904)>>2)];
 var $303=($301>>>0)<($302>>>0);
 if($303){label=89;break;}else{label=88;break;}
 case 88: 
 HEAP32[(($RP9_0)>>2)]=0;
 var $R7_1=$R7_0;label=90;break;
 case 89: 
 _abort();
 throw "Reached an unreachable!";
 case 90: 
 var $R7_1;
 var $307=($262|0)==0;
 if($307){label=110;break;}else{label=91;break;}
 case 91: 
 var $_sum21=((($14)+(20))|0);
 var $309=(($mem+$_sum21)|0);
 var $310=$309;
 var $311=HEAP32[(($310)>>2)];
 var $312=((29192+($311<<2))|0);
 var $313=HEAP32[(($312)>>2)];
 var $314=($259|0)==($313|0);
 if($314){label=92;break;}else{label=94;break;}
 case 92: 
 HEAP32[(($312)>>2)]=$R7_1;
 var $cond69=($R7_1|0)==0;
 if($cond69){label=93;break;}else{label=100;break;}
 case 93: 
 var $316=1<<$311;
 var $317=$316^-1;
 var $318=HEAP32[((28892)>>2)];
 var $319=$318&$317;
 HEAP32[((28892)>>2)]=$319;
 label=110;break;
 case 94: 
 var $321=$262;
 var $322=HEAP32[((28904)>>2)];
 var $323=($321>>>0)<($322>>>0);
 if($323){label=98;break;}else{label=95;break;}
 case 95: 
 var $325=(($262+16)|0);
 var $326=HEAP32[(($325)>>2)];
 var $327=($326|0)==($259|0);
 if($327){label=96;break;}else{label=97;break;}
 case 96: 
 HEAP32[(($325)>>2)]=$R7_1;
 label=99;break;
 case 97: 
 var $330=(($262+20)|0);
 HEAP32[(($330)>>2)]=$R7_1;
 label=99;break;
 case 98: 
 _abort();
 throw "Reached an unreachable!";
 case 99: 
 var $333=($R7_1|0)==0;
 if($333){label=110;break;}else{label=100;break;}
 case 100: 
 var $335=$R7_1;
 var $336=HEAP32[((28904)>>2)];
 var $337=($335>>>0)<($336>>>0);
 if($337){label=109;break;}else{label=101;break;}
 case 101: 
 var $339=(($R7_1+24)|0);
 HEAP32[(($339)>>2)]=$262;
 var $_sum22=((($14)+(8))|0);
 var $340=(($mem+$_sum22)|0);
 var $341=$340;
 var $342=HEAP32[(($341)>>2)];
 var $343=($342|0)==0;
 if($343){label=105;break;}else{label=102;break;}
 case 102: 
 var $345=$342;
 var $346=($345>>>0)<($336>>>0);
 if($346){label=104;break;}else{label=103;break;}
 case 103: 
 var $348=(($R7_1+16)|0);
 HEAP32[(($348)>>2)]=$342;
 var $349=(($342+24)|0);
 HEAP32[(($349)>>2)]=$R7_1;
 label=105;break;
 case 104: 
 _abort();
 throw "Reached an unreachable!";
 case 105: 
 var $_sum23=((($14)+(12))|0);
 var $352=(($mem+$_sum23)|0);
 var $353=$352;
 var $354=HEAP32[(($353)>>2)];
 var $355=($354|0)==0;
 if($355){label=110;break;}else{label=106;break;}
 case 106: 
 var $357=$354;
 var $358=HEAP32[((28904)>>2)];
 var $359=($357>>>0)<($358>>>0);
 if($359){label=108;break;}else{label=107;break;}
 case 107: 
 var $361=(($R7_1+20)|0);
 HEAP32[(($361)>>2)]=$354;
 var $362=(($354+24)|0);
 HEAP32[(($362)>>2)]=$R7_1;
 label=110;break;
 case 108: 
 _abort();
 throw "Reached an unreachable!";
 case 109: 
 _abort();
 throw "Reached an unreachable!";
 case 110: 
 var $366=$219|1;
 var $367=(($p_0+4)|0);
 HEAP32[(($367)>>2)]=$366;
 var $368=(($186+$219)|0);
 var $369=$368;
 HEAP32[(($369)>>2)]=$219;
 var $370=HEAP32[((28908)>>2)];
 var $371=($p_0|0)==($370|0);
 if($371){label=111;break;}else{var $psize_1=$219;label=113;break;}
 case 111: 
 HEAP32[((28896)>>2)]=$219;
 label=140;break;
 case 112: 
 var $374=$191&-2;
 HEAP32[(($190)>>2)]=$374;
 var $375=$psize_0|1;
 var $376=(($p_0+4)|0);
 HEAP32[(($376)>>2)]=$375;
 var $377=(($186+$psize_0)|0);
 var $378=$377;
 HEAP32[(($378)>>2)]=$psize_0;
 var $psize_1=$psize_0;label=113;break;
 case 113: 
 var $psize_1;
 var $380=$psize_1>>>3;
 var $381=($psize_1>>>0)<256;
 if($381){label=114;break;}else{label=119;break;}
 case 114: 
 var $383=$380<<1;
 var $384=((28928+($383<<2))|0);
 var $385=$384;
 var $386=HEAP32[((28888)>>2)];
 var $387=1<<$380;
 var $388=$386&$387;
 var $389=($388|0)==0;
 if($389){label=115;break;}else{label=116;break;}
 case 115: 
 var $391=$386|$387;
 HEAP32[((28888)>>2)]=$391;
 var $_sum19_pre=((($383)+(2))|0);
 var $_pre=((28928+($_sum19_pre<<2))|0);
 var $F16_0=$385;var $_pre_phi=$_pre;label=118;break;
 case 116: 
 var $_sum20=((($383)+(2))|0);
 var $393=((28928+($_sum20<<2))|0);
 var $394=HEAP32[(($393)>>2)];
 var $395=$394;
 var $396=HEAP32[((28904)>>2)];
 var $397=($395>>>0)<($396>>>0);
 if($397){label=117;break;}else{var $F16_0=$394;var $_pre_phi=$393;label=118;break;}
 case 117: 
 _abort();
 throw "Reached an unreachable!";
 case 118: 
 var $_pre_phi;
 var $F16_0;
 HEAP32[(($_pre_phi)>>2)]=$p_0;
 var $400=(($F16_0+12)|0);
 HEAP32[(($400)>>2)]=$p_0;
 var $401=(($p_0+8)|0);
 HEAP32[(($401)>>2)]=$F16_0;
 var $402=(($p_0+12)|0);
 HEAP32[(($402)>>2)]=$385;
 label=140;break;
 case 119: 
 var $404=$p_0;
 var $405=$psize_1>>>8;
 var $406=($405|0)==0;
 if($406){var $I18_0=0;label=122;break;}else{label=120;break;}
 case 120: 
 var $408=($psize_1>>>0)>16777215;
 if($408){var $I18_0=31;label=122;break;}else{label=121;break;}
 case 121: 
 var $410=((($405)+(1048320))|0);
 var $411=$410>>>16;
 var $412=$411&8;
 var $413=$405<<$412;
 var $414=((($413)+(520192))|0);
 var $415=$414>>>16;
 var $416=$415&4;
 var $417=$416|$412;
 var $418=$413<<$416;
 var $419=((($418)+(245760))|0);
 var $420=$419>>>16;
 var $421=$420&2;
 var $422=$417|$421;
 var $423=(((14)-($422))|0);
 var $424=$418<<$421;
 var $425=$424>>>15;
 var $426=((($423)+($425))|0);
 var $427=$426<<1;
 var $428=((($426)+(7))|0);
 var $429=$psize_1>>>($428>>>0);
 var $430=$429&1;
 var $431=$430|$427;
 var $I18_0=$431;label=122;break;
 case 122: 
 var $I18_0;
 var $433=((29192+($I18_0<<2))|0);
 var $434=(($p_0+28)|0);
 var $I18_0_c=$I18_0;
 HEAP32[(($434)>>2)]=$I18_0_c;
 var $435=(($p_0+20)|0);
 HEAP32[(($435)>>2)]=0;
 var $436=(($p_0+16)|0);
 HEAP32[(($436)>>2)]=0;
 var $437=HEAP32[((28892)>>2)];
 var $438=1<<$I18_0;
 var $439=$437&$438;
 var $440=($439|0)==0;
 if($440){label=123;break;}else{label=124;break;}
 case 123: 
 var $442=$437|$438;
 HEAP32[((28892)>>2)]=$442;
 HEAP32[(($433)>>2)]=$404;
 var $443=(($p_0+24)|0);
 var $_c=$433;
 HEAP32[(($443)>>2)]=$_c;
 var $444=(($p_0+12)|0);
 HEAP32[(($444)>>2)]=$p_0;
 var $445=(($p_0+8)|0);
 HEAP32[(($445)>>2)]=$p_0;
 label=136;break;
 case 124: 
 var $447=HEAP32[(($433)>>2)];
 var $448=($I18_0|0)==31;
 if($448){var $453=0;label=126;break;}else{label=125;break;}
 case 125: 
 var $450=$I18_0>>>1;
 var $451=(((25)-($450))|0);
 var $453=$451;label=126;break;
 case 126: 
 var $453;
 var $454=(($447+4)|0);
 var $455=HEAP32[(($454)>>2)];
 var $456=$455&-8;
 var $457=($456|0)==($psize_1|0);
 if($457){var $T_0_lcssa=$447;label=133;break;}else{label=127;break;}
 case 127: 
 var $458=$psize_1<<$453;
 var $T_072=$447;var $K19_073=$458;label=129;break;
 case 128: 
 var $460=$K19_073<<1;
 var $461=(($468+4)|0);
 var $462=HEAP32[(($461)>>2)];
 var $463=$462&-8;
 var $464=($463|0)==($psize_1|0);
 if($464){var $T_0_lcssa=$468;label=133;break;}else{var $T_072=$468;var $K19_073=$460;label=129;break;}
 case 129: 
 var $K19_073;
 var $T_072;
 var $466=$K19_073>>>31;
 var $467=(($T_072+16+($466<<2))|0);
 var $468=HEAP32[(($467)>>2)];
 var $469=($468|0)==0;
 if($469){label=130;break;}else{label=128;break;}
 case 130: 
 var $471=$467;
 var $472=HEAP32[((28904)>>2)];
 var $473=($471>>>0)<($472>>>0);
 if($473){label=132;break;}else{label=131;break;}
 case 131: 
 HEAP32[(($467)>>2)]=$404;
 var $475=(($p_0+24)|0);
 var $T_0_c16=$T_072;
 HEAP32[(($475)>>2)]=$T_0_c16;
 var $476=(($p_0+12)|0);
 HEAP32[(($476)>>2)]=$p_0;
 var $477=(($p_0+8)|0);
 HEAP32[(($477)>>2)]=$p_0;
 label=136;break;
 case 132: 
 _abort();
 throw "Reached an unreachable!";
 case 133: 
 var $T_0_lcssa;
 var $479=(($T_0_lcssa+8)|0);
 var $480=HEAP32[(($479)>>2)];
 var $481=$T_0_lcssa;
 var $482=HEAP32[((28904)>>2)];
 var $483=($481>>>0)>=($482>>>0);
 var $484=$480;
 var $485=($484>>>0)>=($482>>>0);
 var $or_cond=$483&$485;
 if($or_cond){label=134;break;}else{label=135;break;}
 case 134: 
 var $487=(($480+12)|0);
 HEAP32[(($487)>>2)]=$404;
 HEAP32[(($479)>>2)]=$404;
 var $488=(($p_0+8)|0);
 var $_c15=$480;
 HEAP32[(($488)>>2)]=$_c15;
 var $489=(($p_0+12)|0);
 var $T_0_c=$T_0_lcssa;
 HEAP32[(($489)>>2)]=$T_0_c;
 var $490=(($p_0+24)|0);
 HEAP32[(($490)>>2)]=0;
 label=136;break;
 case 135: 
 _abort();
 throw "Reached an unreachable!";
 case 136: 
 var $492=HEAP32[((28920)>>2)];
 var $493=((($492)-(1))|0);
 HEAP32[((28920)>>2)]=$493;
 var $494=($493|0)==0;
 if($494){var $sp_0_in_i=29344;label=137;break;}else{label=140;break;}
 case 137: 
 var $sp_0_in_i;
 var $sp_0_i=HEAP32[(($sp_0_in_i)>>2)];
 var $495=($sp_0_i|0)==0;
 var $496=(($sp_0_i+8)|0);
 if($495){label=138;break;}else{var $sp_0_in_i=$496;label=137;break;}
 case 138: 
 HEAP32[((28920)>>2)]=-1;
 label=140;break;
 case 139: 
 _abort();
 throw "Reached an unreachable!";
 case 140: 
 return;
  default: assert(0, "bad label: " + label);
 }

}

//Func
function _realloc($oldmem,$bytes){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=($oldmem|0)==0;
 if($1){label=2;break;}else{label=3;break;}
 case 2: 
 var $3=_malloc($bytes);
 var $mem_0=$3;label=78;break;
 case 3: 
 var $5=($bytes>>>0)>4294967231;
 if($5){label=4;break;}else{label=5;break;}
 case 4: 
 var $7=___errno_location();
 HEAP32[(($7)>>2)]=12;
 var $mem_0=0;label=78;break;
 case 5: 
 var $9=($bytes>>>0)<11;
 if($9){var $14=16;label=7;break;}else{label=6;break;}
 case 6: 
 var $11=((($bytes)+(11))|0);
 var $12=$11&-8;
 var $14=$12;label=7;break;
 case 7: 
 var $14;
 var $15=((($oldmem)-(8))|0);
 var $16=((($oldmem)-(4))|0);
 var $17=$16;
 var $18=HEAP32[(($17)>>2)];
 var $19=$18&-8;
 var $_sum=((($19)-(8))|0);
 var $20=(($oldmem+$_sum)|0);
 var $21=$20;
 var $22=HEAP32[((28904)>>2)];
 var $23=$18&3;
 var $notlhs_i=($15>>>0)>=($22>>>0);
 var $notrhs_i=($23|0)!=1;
 var $or_cond_not_i=$notrhs_i&$notlhs_i;
 var $24=($_sum|0)>-8;
 var $or_cond36_i=$or_cond_not_i&$24;
 if($or_cond36_i){label=8;break;}else{label=75;break;}
 case 8: 
 var $_sum3334_i=$19|4;
 var $_sum1=((($_sum3334_i)-(8))|0);
 var $26=(($oldmem+$_sum1)|0);
 var $27=$26;
 var $28=HEAP32[(($27)>>2)];
 var $29=$28&1;
 var $phitmp_i=($29|0)==0;
 if($phitmp_i){label=75;break;}else{label=9;break;}
 case 9: 
 var $31=($23|0)==0;
 if($31){label=10;break;}else{label=12;break;}
 case 10: 
 var $33=($14>>>0)<256;
 var $34=$14|4;
 var $35=($19>>>0)<($34>>>0);
 var $or_cond=$33|$35;
 if($or_cond){label=76;break;}else{label=11;break;}
 case 11: 
 var $37=((($19)-($14))|0);
 var $38=HEAP32[((28840)>>2)];
 var $39=$38<<1;
 var $40=($37>>>0)>($39>>>0);
 if($40){label=76;break;}else{var $mem_0=$oldmem;label=78;break;}
 case 12: 
 var $42=($19>>>0)<($14>>>0);
 if($42){label=15;break;}else{label=13;break;}
 case 13: 
 var $44=((($19)-($14))|0);
 var $45=($44>>>0)>15;
 if($45){label=14;break;}else{var $mem_0=$oldmem;label=78;break;}
 case 14: 
 var $_sum2=((($14)-(8))|0);
 var $47=(($oldmem+$_sum2)|0);
 var $48=$47;
 var $49=$18&1;
 var $50=$49|$14;
 var $51=$50|2;
 HEAP32[(($17)>>2)]=$51;
 var $_sum29_i3=$14|4;
 var $_sum4=((($_sum29_i3)-(8))|0);
 var $52=(($oldmem+$_sum4)|0);
 var $53=$52;
 var $54=$44|3;
 HEAP32[(($53)>>2)]=$54;
 var $55=HEAP32[(($27)>>2)];
 var $56=$55|1;
 HEAP32[(($27)>>2)]=$56;
 _dispose_chunk($48,$44);
 var $mem_0=$oldmem;label=78;break;
 case 15: 
 var $58=HEAP32[((28912)>>2)];
 var $59=($21|0)==($58|0);
 if($59){label=16;break;}else{label=18;break;}
 case 16: 
 var $61=HEAP32[((28900)>>2)];
 var $62=((($61)+($19))|0);
 var $63=($62>>>0)>($14>>>0);
 if($63){label=17;break;}else{label=76;break;}
 case 17: 
 var $65=((($62)-($14))|0);
 var $_sum28=((($14)-(8))|0);
 var $66=(($oldmem+$_sum28)|0);
 var $67=$66;
 var $68=$18&1;
 var $69=$68|$14;
 var $70=$69|2;
 HEAP32[(($17)>>2)]=$70;
 var $_sum28_i29=$14|4;
 var $_sum30=((($_sum28_i29)-(8))|0);
 var $71=(($oldmem+$_sum30)|0);
 var $72=$71;
 var $73=$65|1;
 HEAP32[(($72)>>2)]=$73;
 HEAP32[((28912)>>2)]=$67;
 HEAP32[((28900)>>2)]=$65;
 var $mem_0=$oldmem;label=78;break;
 case 18: 
 var $75=HEAP32[((28908)>>2)];
 var $76=($21|0)==($75|0);
 if($76){label=19;break;}else{label=24;break;}
 case 19: 
 var $78=HEAP32[((28896)>>2)];
 var $79=((($78)+($19))|0);
 var $80=($79>>>0)<($14>>>0);
 if($80){label=76;break;}else{label=20;break;}
 case 20: 
 var $82=((($79)-($14))|0);
 var $83=($82>>>0)>15;
 if($83){label=21;break;}else{label=22;break;}
 case 21: 
 var $_sum23=((($14)-(8))|0);
 var $85=(($oldmem+$_sum23)|0);
 var $86=$85;
 var $_sum24=((($79)-(8))|0);
 var $87=(($oldmem+$_sum24)|0);
 var $88=$18&1;
 var $89=$88|$14;
 var $90=$89|2;
 HEAP32[(($17)>>2)]=$90;
 var $_sum25_i25=$14|4;
 var $_sum26=((($_sum25_i25)-(8))|0);
 var $91=(($oldmem+$_sum26)|0);
 var $92=$91;
 var $93=$82|1;
 HEAP32[(($92)>>2)]=$93;
 var $94=$87;
 HEAP32[(($94)>>2)]=$82;
 var $_sum27=((($79)-(4))|0);
 var $95=(($oldmem+$_sum27)|0);
 var $96=$95;
 var $97=HEAP32[(($96)>>2)];
 var $98=$97&-2;
 HEAP32[(($96)>>2)]=$98;
 var $storemerge_i=$86;var $storemerge27_i=$82;label=23;break;
 case 22: 
 var $100=$18&1;
 var $101=$100|$79;
 var $102=$101|2;
 HEAP32[(($17)>>2)]=$102;
 var $_sum22=((($79)-(4))|0);
 var $103=(($oldmem+$_sum22)|0);
 var $104=$103;
 var $105=HEAP32[(($104)>>2)];
 var $106=$105|1;
 HEAP32[(($104)>>2)]=$106;
 var $storemerge_i=0;var $storemerge27_i=0;label=23;break;
 case 23: 
 var $storemerge27_i;
 var $storemerge_i;
 HEAP32[((28896)>>2)]=$storemerge27_i;
 HEAP32[((28908)>>2)]=$storemerge_i;
 var $mem_0=$oldmem;label=78;break;
 case 24: 
 var $109=$28&2;
 var $110=($109|0)==0;
 if($110){label=25;break;}else{label=76;break;}
 case 25: 
 var $112=$28&-8;
 var $113=((($112)+($19))|0);
 var $114=($113>>>0)<($14>>>0);
 if($114){label=76;break;}else{label=26;break;}
 case 26: 
 var $116=((($113)-($14))|0);
 var $117=$28>>>3;
 var $118=($28>>>0)<256;
 if($118){label=27;break;}else{label=39;break;}
 case 27: 
 var $120=(($oldmem+$19)|0);
 var $121=$120;
 var $122=HEAP32[(($121)>>2)];
 var $123=(($oldmem+$_sum3334_i)|0);
 var $124=$123;
 var $125=HEAP32[(($124)>>2)];
 var $126=$117<<1;
 var $127=((28928+($126<<2))|0);
 var $128=$127;
 var $129=($122|0)==($128|0);
 if($129){label=30;break;}else{label=28;break;}
 case 28: 
 var $131=$122;
 var $132=($131>>>0)<($22>>>0);
 if($132){label=38;break;}else{label=29;break;}
 case 29: 
 var $134=(($122+12)|0);
 var $135=HEAP32[(($134)>>2)];
 var $136=($135|0)==($21|0);
 if($136){label=30;break;}else{label=38;break;}
 case 30: 
 var $137=($125|0)==($122|0);
 if($137){label=31;break;}else{label=32;break;}
 case 31: 
 var $139=1<<$117;
 var $140=$139^-1;
 var $141=HEAP32[((28888)>>2)];
 var $142=$141&$140;
 HEAP32[((28888)>>2)]=$142;
 label=72;break;
 case 32: 
 var $144=($125|0)==($128|0);
 if($144){label=33;break;}else{label=34;break;}
 case 33: 
 var $_pre_i=(($125+8)|0);
 var $_pre_phi_i=$_pre_i;label=36;break;
 case 34: 
 var $146=$125;
 var $147=($146>>>0)<($22>>>0);
 if($147){label=37;break;}else{label=35;break;}
 case 35: 
 var $149=(($125+8)|0);
 var $150=HEAP32[(($149)>>2)];
 var $151=($150|0)==($21|0);
 if($151){var $_pre_phi_i=$149;label=36;break;}else{label=37;break;}
 case 36: 
 var $_pre_phi_i;
 var $152=(($122+12)|0);
 HEAP32[(($152)>>2)]=$125;
 HEAP32[(($_pre_phi_i)>>2)]=$122;
 label=72;break;
 case 37: 
 _abort();
 throw "Reached an unreachable!";
 case 38: 
 _abort();
 throw "Reached an unreachable!";
 case 39: 
 var $154=$20;
 var $_sum5=((($19)+(16))|0);
 var $155=(($oldmem+$_sum5)|0);
 var $156=$155;
 var $157=HEAP32[(($156)>>2)];
 var $158=(($oldmem+$_sum3334_i)|0);
 var $159=$158;
 var $160=HEAP32[(($159)>>2)];
 var $161=($160|0)==($154|0);
 if($161){label=45;break;}else{label=40;break;}
 case 40: 
 var $163=(($oldmem+$19)|0);
 var $164=$163;
 var $165=HEAP32[(($164)>>2)];
 var $166=$165;
 var $167=($166>>>0)<($22>>>0);
 if($167){label=44;break;}else{label=41;break;}
 case 41: 
 var $169=(($165+12)|0);
 var $170=HEAP32[(($169)>>2)];
 var $171=($170|0)==($154|0);
 if($171){label=42;break;}else{label=44;break;}
 case 42: 
 var $173=(($160+8)|0);
 var $174=HEAP32[(($173)>>2)];
 var $175=($174|0)==($154|0);
 if($175){label=43;break;}else{label=44;break;}
 case 43: 
 HEAP32[(($169)>>2)]=$160;
 HEAP32[(($173)>>2)]=$165;
 var $R_1_i=$160;label=52;break;
 case 44: 
 _abort();
 throw "Reached an unreachable!";
 case 45: 
 var $_sum17=((($19)+(12))|0);
 var $178=(($oldmem+$_sum17)|0);
 var $179=$178;
 var $180=HEAP32[(($179)>>2)];
 var $181=($180|0)==0;
 if($181){label=46;break;}else{var $R_0_i=$180;var $RP_0_i=$179;label=47;break;}
 case 46: 
 var $_sum18=((($19)+(8))|0);
 var $183=(($oldmem+$_sum18)|0);
 var $184=$183;
 var $185=HEAP32[(($184)>>2)];
 var $186=($185|0)==0;
 if($186){var $R_1_i=0;label=52;break;}else{var $R_0_i=$185;var $RP_0_i=$184;label=47;break;}
 case 47: 
 var $RP_0_i;
 var $R_0_i;
 var $187=(($R_0_i+20)|0);
 var $188=HEAP32[(($187)>>2)];
 var $189=($188|0)==0;
 if($189){label=48;break;}else{var $R_0_i=$188;var $RP_0_i=$187;label=47;break;}
 case 48: 
 var $191=(($R_0_i+16)|0);
 var $192=HEAP32[(($191)>>2)];
 var $193=($192|0)==0;
 if($193){label=49;break;}else{var $R_0_i=$192;var $RP_0_i=$191;label=47;break;}
 case 49: 
 var $195=$RP_0_i;
 var $196=($195>>>0)<($22>>>0);
 if($196){label=51;break;}else{label=50;break;}
 case 50: 
 HEAP32[(($RP_0_i)>>2)]=0;
 var $R_1_i=$R_0_i;label=52;break;
 case 51: 
 _abort();
 throw "Reached an unreachable!";
 case 52: 
 var $R_1_i;
 var $200=($157|0)==0;
 if($200){label=72;break;}else{label=53;break;}
 case 53: 
 var $_sum9=((($19)+(20))|0);
 var $202=(($oldmem+$_sum9)|0);
 var $203=$202;
 var $204=HEAP32[(($203)>>2)];
 var $205=((29192+($204<<2))|0);
 var $206=HEAP32[(($205)>>2)];
 var $207=($154|0)==($206|0);
 if($207){label=54;break;}else{label=56;break;}
 case 54: 
 HEAP32[(($205)>>2)]=$R_1_i;
 var $cond_i=($R_1_i|0)==0;
 if($cond_i){label=55;break;}else{label=62;break;}
 case 55: 
 var $209=1<<$204;
 var $210=$209^-1;
 var $211=HEAP32[((28892)>>2)];
 var $212=$211&$210;
 HEAP32[((28892)>>2)]=$212;
 label=72;break;
 case 56: 
 var $214=$157;
 var $215=HEAP32[((28904)>>2)];
 var $216=($214>>>0)<($215>>>0);
 if($216){label=60;break;}else{label=57;break;}
 case 57: 
 var $218=(($157+16)|0);
 var $219=HEAP32[(($218)>>2)];
 var $220=($219|0)==($154|0);
 if($220){label=58;break;}else{label=59;break;}
 case 58: 
 HEAP32[(($218)>>2)]=$R_1_i;
 label=61;break;
 case 59: 
 var $223=(($157+20)|0);
 HEAP32[(($223)>>2)]=$R_1_i;
 label=61;break;
 case 60: 
 _abort();
 throw "Reached an unreachable!";
 case 61: 
 var $226=($R_1_i|0)==0;
 if($226){label=72;break;}else{label=62;break;}
 case 62: 
 var $228=$R_1_i;
 var $229=HEAP32[((28904)>>2)];
 var $230=($228>>>0)<($229>>>0);
 if($230){label=71;break;}else{label=63;break;}
 case 63: 
 var $232=(($R_1_i+24)|0);
 HEAP32[(($232)>>2)]=$157;
 var $_sum10=((($19)+(8))|0);
 var $233=(($oldmem+$_sum10)|0);
 var $234=$233;
 var $235=HEAP32[(($234)>>2)];
 var $236=($235|0)==0;
 if($236){label=67;break;}else{label=64;break;}
 case 64: 
 var $238=$235;
 var $239=($238>>>0)<($229>>>0);
 if($239){label=66;break;}else{label=65;break;}
 case 65: 
 var $241=(($R_1_i+16)|0);
 HEAP32[(($241)>>2)]=$235;
 var $242=(($235+24)|0);
 HEAP32[(($242)>>2)]=$R_1_i;
 label=67;break;
 case 66: 
 _abort();
 throw "Reached an unreachable!";
 case 67: 
 var $_sum11=((($19)+(12))|0);
 var $245=(($oldmem+$_sum11)|0);
 var $246=$245;
 var $247=HEAP32[(($246)>>2)];
 var $248=($247|0)==0;
 if($248){label=72;break;}else{label=68;break;}
 case 68: 
 var $250=$247;
 var $251=HEAP32[((28904)>>2)];
 var $252=($250>>>0)<($251>>>0);
 if($252){label=70;break;}else{label=69;break;}
 case 69: 
 var $254=(($R_1_i+20)|0);
 HEAP32[(($254)>>2)]=$247;
 var $255=(($247+24)|0);
 HEAP32[(($255)>>2)]=$R_1_i;
 label=72;break;
 case 70: 
 _abort();
 throw "Reached an unreachable!";
 case 71: 
 _abort();
 throw "Reached an unreachable!";
 case 72: 
 var $259=($116>>>0)<16;
 if($259){label=73;break;}else{label=74;break;}
 case 73: 
 var $260=$18&1;
 var $261=$113|$260;
 var $262=$261|2;
 HEAP32[(($17)>>2)]=$262;
 var $_sum910_i=$113|4;
 var $_sum16=((($_sum910_i)-(8))|0);
 var $263=(($oldmem+$_sum16)|0);
 var $264=$263;
 var $265=HEAP32[(($264)>>2)];
 var $266=$265|1;
 HEAP32[(($264)>>2)]=$266;
 var $mem_0=$oldmem;label=78;break;
 case 74: 
 var $_sum12=((($14)-(8))|0);
 var $268=(($oldmem+$_sum12)|0);
 var $269=$268;
 var $270=$18&1;
 var $271=$270|$14;
 var $272=$271|2;
 HEAP32[(($17)>>2)]=$272;
 var $_sum5_i13=$14|4;
 var $_sum14=((($_sum5_i13)-(8))|0);
 var $273=(($oldmem+$_sum14)|0);
 var $274=$273;
 var $275=$116|3;
 HEAP32[(($274)>>2)]=$275;
 var $_sum78_i=$113|4;
 var $_sum15=((($_sum78_i)-(8))|0);
 var $276=(($oldmem+$_sum15)|0);
 var $277=$276;
 var $278=HEAP32[(($277)>>2)];
 var $279=$278|1;
 HEAP32[(($277)>>2)]=$279;
 _dispose_chunk($269,$116);
 var $mem_0=$oldmem;label=78;break;
 case 75: 
 _abort();
 throw "Reached an unreachable!";
 case 76: 
 var $280=_malloc($bytes);
 var $281=($280|0)==0;
 if($281){var $mem_0=0;label=78;break;}else{label=77;break;}
 case 77: 
 var $283=HEAP32[(($17)>>2)];
 var $284=$283&-8;
 var $285=$283&3;
 var $286=($285|0)==0;
 var $287=($286?8:4);
 var $288=((($284)-($287))|0);
 var $289=($288>>>0)<($bytes>>>0);
 var $290=($289?$288:$bytes);
 assert($290 % 1 === 0);(_memcpy($280, $oldmem, $290)|0);
 _free($oldmem);
 var $mem_0=$280;label=78;break;
 case 78: 
 var $mem_0;
 return $mem_0;
  default: assert(0, "bad label: " + label);
 }

}

//Func
function ___intscan($f,$base,$pok,$lim$0,$lim$1){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=($base>>>0)>36;
 if($1){label=3;break;}else{label=2;break;}
 case 2: 
 var $2=(($f+4)|0);
 var $3=(($f+100)|0);
 label=4;break;
 case 3: 
 var $5=___errno_location();
 HEAP32[(($5)>>2)]=22;
 var $_0$1=0;var $_0$0=0;label=86;break;
 case 4: 
 var $6=HEAP32[(($2)>>2)];
 var $7=HEAP32[(($3)>>2)];
 var $8=($6>>>0)<($7>>>0);
 if($8){label=5;break;}else{label=6;break;}
 case 5: 
 var $10=(($6+1)|0);
 HEAP32[(($2)>>2)]=$10;
 var $11=HEAP8[(($6)>>0)];
 var $12=($11&255);
 var $16=$12;label=7;break;
 case 6: 
 var $14=___shgetc($f);
 var $16=$14;label=7;break;
 case 7: 
 var $16;
 switch(($16|0)){case 32:case 13:case 12:case 11:case 10:case 9:{ label=4;break;}default:{label=8;break;}}break;
 case 8: 
 var $18=($16|0)==45;
 if(($16|0)==45|($16|0)==43){ label=9;break;}else{var $neg_0=0;var $c_0=$16;label=12;break;}
 case 9: 
 var $19=HEAP32[(($2)>>2)];
 var $20=(($18<<31)>>31);
 var $21=HEAP32[(($3)>>2)];
 var $22=($19>>>0)<($21>>>0);
 if($22){label=10;break;}else{label=11;break;}
 case 10: 
 var $24=(($19+1)|0);
 HEAP32[(($2)>>2)]=$24;
 var $25=HEAP8[(($19)>>0)];
 var $26=($25&255);
 var $neg_0=$20;var $c_0=$26;label=12;break;
 case 11: 
 var $28=___shgetc($f);
 var $neg_0=$20;var $c_0=$28;label=12;break;
 case 12: 
 var $c_0;
 var $neg_0;
 var $30=($base|0)==0;
 var $31=$base&-17;
 var $32=($31|0)==0;
 var $33=($c_0|0)==48;
 var $or_cond5=$32&$33;
 if($or_cond5){label=13;break;}else{label=28;break;}
 case 13: 
 var $35=HEAP32[(($2)>>2)];
 var $36=HEAP32[(($3)>>2)];
 var $37=($35>>>0)<($36>>>0);
 if($37){label=14;break;}else{label=15;break;}
 case 14: 
 var $39=(($35+1)|0);
 HEAP32[(($2)>>2)]=$39;
 var $40=HEAP8[(($35)>>0)];
 var $41=($40&255);
 var $45=$41;label=16;break;
 case 15: 
 var $43=___shgetc($f);
 var $45=$43;label=16;break;
 case 16: 
 var $45;
 var $46=$45|32;
 var $47=($46|0)==120;
 if($47){label=17;break;}else{label=27;break;}
 case 17: 
 var $49=HEAP32[(($2)>>2)];
 var $50=HEAP32[(($3)>>2)];
 var $51=($49>>>0)<($50>>>0);
 if($51){label=18;break;}else{label=19;break;}
 case 18: 
 var $53=(($49+1)|0);
 HEAP32[(($2)>>2)]=$53;
 var $54=HEAP8[(($49)>>0)];
 var $55=($54&255);
 var $59=$55;label=20;break;
 case 19: 
 var $57=___shgetc($f);
 var $59=$57;label=20;break;
 case 20: 
 var $59;
 var $_sum23=((($59)+(1))|0);
 var $60=((136+$_sum23)|0);
 var $61=HEAP8[(($60)>>0)];
 var $62=($61&255)>15;
 if($62){label=21;break;}else{var $_126=16;var $c_127=$59;label=46;break;}
 case 21: 
 var $64=HEAP32[(($3)>>2)];
 var $65=($64|0)==0;
 if($65){label=23;break;}else{label=22;break;}
 case 22: 
 var $67=HEAP32[(($2)>>2)];
 var $68=((($67)-(1))|0);
 HEAP32[(($2)>>2)]=$68;
 label=23;break;
 case 23: 
 var $70=($pok|0)==0;
 if($70){label=26;break;}else{label=24;break;}
 case 24: 
 if($65){var $_0$1=0;var $_0$0=0;label=86;break;}else{label=25;break;}
 case 25: 
 var $73=HEAP32[(($2)>>2)];
 var $74=((($73)-(1))|0);
 HEAP32[(($2)>>2)]=$74;
 var $_0$1=0;var $_0$0=0;label=86;break;
 case 26: 
 var $76=(($f+104)|0);
 HEAP32[(($76)>>2)]=0;
 var $77=(($f+8)|0);
 var $78=HEAP32[(($77)>>2)];
 var $79=HEAP32[(($2)>>2)];
 var $80=$78;
 var $81=$79;
 var $82=((($80)-($81))|0);
 var $83=(($f+108)|0);
 HEAP32[(($83)>>2)]=$82;
 HEAP32[(($3)>>2)]=$78;
 var $_0$1=0;var $_0$0=0;label=86;break;
 case 27: 
 if($30){var $_126=8;var $c_127=$45;label=46;break;}else{var $c_1=$45;var $_1=$base;label=32;break;}
 case 28: 
 var $_base24=($30?10:$base);
 var $_sum=((($c_0)+(1))|0);
 var $86=((136+$_sum)|0);
 var $87=HEAP8[(($86)>>0)];
 var $88=($87&255);
 var $89=($88>>>0)<($_base24>>>0);
 if($89){var $c_1=$c_0;var $_1=$_base24;label=32;break;}else{label=29;break;}
 case 29: 
 var $91=HEAP32[(($3)>>2)];
 var $92=($91|0)==0;
 var $_pre=HEAP32[(($2)>>2)];
 if($92){var $95=$_pre;label=31;break;}else{label=30;break;}
 case 30: 
 var $94=((($_pre)-(1))|0);
 HEAP32[(($2)>>2)]=$94;
 var $95=$94;label=31;break;
 case 31: 
 var $95;
 var $96=(($f+104)|0);
 HEAP32[(($96)>>2)]=0;
 var $97=(($f+8)|0);
 var $98=HEAP32[(($97)>>2)];
 var $99=$98;
 var $100=$95;
 var $101=((($99)-($100))|0);
 var $102=(($f+108)|0);
 HEAP32[(($102)>>2)]=$101;
 HEAP32[(($3)>>2)]=$98;
 var $103=___errno_location();
 HEAP32[(($103)>>2)]=22;
 var $_0$1=0;var $_0$0=0;label=86;break;
 case 32: 
 var $_1;
 var $c_1;
 var $105=($_1|0)==10;
 if($105){label=33;break;}else{var $_126=$_1;var $c_127=$c_1;label=46;break;}
 case 33: 
 var $106=((($c_1)-(48))|0);
 var $107=($106>>>0)<10;
 if($107){var $x_073=0;var $108=$106;label=34;break;}else{var $c_2_lcssa=$c_1;var $x_0_lcssa$1=0;var $x_0_lcssa$0=0;label=39;break;}
 case 34: 
 var $108;
 var $x_073;
 var $109=((($x_073)*(10))&-1);
 var $110=((($109)+($108))|0);
 var $111=HEAP32[(($2)>>2)];
 var $112=HEAP32[(($3)>>2)];
 var $113=($111>>>0)<($112>>>0);
 if($113){label=35;break;}else{label=36;break;}
 case 35: 
 var $115=(($111+1)|0);
 HEAP32[(($2)>>2)]=$115;
 var $116=HEAP8[(($111)>>0)];
 var $117=($116&255);
 var $c_2_be=$117;label=37;break;
 case 36: 
 var $119=___shgetc($f);
 var $c_2_be=$119;label=37;break;
 case 37: 
 var $c_2_be;
 var $120=((($c_2_be)-(48))|0);
 var $121=($120>>>0)<10;
 var $122=($110>>>0)<429496729;
 var $or_cond7=$121&$122;
 if($or_cond7){var $x_073=$110;var $108=$120;label=34;break;}else{label=38;break;}
 case 38: 
 var $phitmp83$0=$110;
 var $phitmp83$1=0;
 var $c_2_lcssa=$c_2_be;var $x_0_lcssa$1=$phitmp83$1;var $x_0_lcssa$0=$phitmp83$0;label=39;break;
 case 39: 
 var $x_0_lcssa$0;
 var $x_0_lcssa$1;
 var $c_2_lcssa;
 var $124=((($c_2_lcssa)-(48))|0);
 var $125=($124>>>0)<10;
 if($125){var $c_362=$c_2_lcssa;var $y_063$1=$x_0_lcssa$1;var $y_063$0=$x_0_lcssa$0;var $126=$124;label=40;break;}else{var $y_4$1=$x_0_lcssa$1;var $y_4$0=$x_0_lcssa$0;label=78;break;}
 case 40: 
 var $126;
 var $y_063$0;
 var $y_063$1;
 var $c_362;
 var $$etemp$0$0=10;
 var $$etemp$0$1=0;
 var $127$0=___muldi3($y_063$0,$y_063$1,$$etemp$0$0,$$etemp$0$1);var $127$1=tempRet0;
 var $128$0=$126;
 var $128$1=((((($126|0)<0))|0)?-1:0);
 var $$etemp$1$0=-1;
 var $$etemp$1$1=-1;
 var $129$0=$128$0^$$etemp$1$0;
 var $129$1=$128$1^$$etemp$1$1;
 var $130=(($127$1>>>0) > ($129$1>>>0)) | (((($127$1>>>0) == ($129$1>>>0) & ($127$0>>>0) >  ($129$0>>>0))));
 if($130){var $c_3_lcssa=$c_362;var $y_0_lcssa$1=$y_063$1;var $y_0_lcssa$0=$y_063$0;var $_lcssa=$126;label=45;break;}else{label=41;break;}
 case 41: 
 var $132$0=_i64Add($127$0,$127$1,$128$0,$128$1);var $132$1=tempRet0;
 var $133=HEAP32[(($2)>>2)];
 var $134=HEAP32[(($3)>>2)];
 var $135=($133>>>0)<($134>>>0);
 if($135){label=42;break;}else{label=43;break;}
 case 42: 
 var $137=(($133+1)|0);
 HEAP32[(($2)>>2)]=$137;
 var $138=HEAP8[(($133)>>0)];
 var $139=($138&255);
 var $c_3_be=$139;label=44;break;
 case 43: 
 var $141=___shgetc($f);
 var $c_3_be=$141;label=44;break;
 case 44: 
 var $c_3_be;
 var $142=((($c_3_be)-(48))|0);
 var $143=($142>>>0)<10;
 var $$etemp$2$0=-1717986918;
 var $$etemp$2$1=429496729;
 var $144=(($132$1>>>0) < ($$etemp$2$1>>>0)) | (((($132$1>>>0) == ($$etemp$2$1>>>0) & ($132$0>>>0) <  ($$etemp$2$0>>>0))));
 var $or_cond9=$143&$144;
 if($or_cond9){var $c_362=$c_3_be;var $y_063$1=$132$1;var $y_063$0=$132$0;var $126=$142;label=40;break;}else{var $c_3_lcssa=$c_3_be;var $y_0_lcssa$1=$132$1;var $y_0_lcssa$0=$132$0;var $_lcssa=$142;label=45;break;}
 case 45: 
 var $_lcssa;
 var $y_0_lcssa$0;
 var $y_0_lcssa$1;
 var $c_3_lcssa;
 var $145=($_lcssa>>>0)>9;
 if($145){var $y_4$1=$y_0_lcssa$1;var $y_4$0=$y_0_lcssa$0;label=78;break;}else{var $y_3$1=$y_0_lcssa$1;var $y_3$0=$y_0_lcssa$0;var $c_8=$c_3_lcssa;var $_125=10;label=72;break;}
 case 46: 
 var $c_127;
 var $_126;
 var $146=((($_126)-(1))|0);
 var $147=$146&$_126;
 var $148=($147|0)==0;
 if($148){label=48;break;}else{label=47;break;}
 case 47: 
 var $_sum2155=((($c_127)+(1))|0);
 var $149=((136+$_sum2155)|0);
 var $150=HEAP8[(($149)>>0)];
 var $151=($150&255);
 var $152=($151>>>0)<($_126>>>0);
 if($152){var $x_256=0;var $206=$151;label=59;break;}else{var $c_6_lcssa=$c_127;var $x_2_lcssa$1=0;var $x_2_lcssa$0=0;var $224=$150;label=64;break;}
 case 48: 
 var $154=((($_126)*(23))&-1);
 var $155=$154>>>5;
 var $156=$155&7;
 var $157=((4096+$156)|0);
 var $158=HEAP8[(($157)>>0)];
 var $159=(($158<<24)>>24);
 var $_sum1737=((($c_127)+(1))|0);
 var $160=((136+$_sum1737)|0);
 var $161=HEAP8[(($160)>>0)];
 var $162=($161&255);
 var $163=($162>>>0)<($_126>>>0);
 if($163){var $x_138=0;var $164=$162;label=49;break;}else{var $c_4_lcssa=$c_127;var $x_1_lcssa$1=0;var $x_1_lcssa$0=0;var $182=$161;label=54;break;}
 case 49: 
 var $164;
 var $x_138;
 var $165=$x_138<<$159;
 var $166=$164|$165;
 var $167=HEAP32[(($2)>>2)];
 var $168=HEAP32[(($3)>>2)];
 var $169=($167>>>0)<($168>>>0);
 if($169){label=50;break;}else{label=51;break;}
 case 50: 
 var $171=(($167+1)|0);
 HEAP32[(($2)>>2)]=$171;
 var $172=HEAP8[(($167)>>0)];
 var $173=($172&255);
 var $c_4_be=$173;label=52;break;
 case 51: 
 var $175=___shgetc($f);
 var $c_4_be=$175;label=52;break;
 case 52: 
 var $c_4_be;
 var $_sum17=((($c_4_be)+(1))|0);
 var $176=((136+$_sum17)|0);
 var $177=HEAP8[(($176)>>0)];
 var $178=($177&255);
 var $179=($178>>>0)<($_126>>>0);
 var $180=($166>>>0)<134217728;
 var $or_cond11=$179&$180;
 if($or_cond11){var $x_138=$166;var $164=$178;label=49;break;}else{label=53;break;}
 case 53: 
 var $phitmp82$0=$166;
 var $phitmp82$1=0;
 var $c_4_lcssa=$c_4_be;var $x_1_lcssa$1=$phitmp82$1;var $x_1_lcssa$0=$phitmp82$0;var $182=$177;label=54;break;
 case 54: 
 var $182;
 var $x_1_lcssa$0;
 var $x_1_lcssa$1;
 var $c_4_lcssa;
 var $183$0=$159;
 var $183$1=0;
 var $$etemp$3$0=-1;
 var $$etemp$3$1=-1;
 var $184$0=_bitshift64Lshr($$etemp$3$0,$$etemp$3$1,$183$0);var $184$1=tempRet0;
 var $185=($182&255);
 var $186=($185>>>0)>=($_126>>>0);
 var $187=(($x_1_lcssa$1>>>0) > ($184$1>>>0)) | (((($x_1_lcssa$1>>>0) == ($184$1>>>0) & ($x_1_lcssa$0>>>0) >  ($184$0>>>0))));
 var $or_cond31=$186|$187;
 if($or_cond31){var $y_3$1=$x_1_lcssa$1;var $y_3$0=$x_1_lcssa$0;var $c_8=$c_4_lcssa;var $_125=$_126;label=72;break;}else{var $y_132$1=$x_1_lcssa$1;var $y_132$0=$x_1_lcssa$0;var $188=$182;label=55;break;}
 case 55: 
 var $188;
 var $y_132$0;
 var $y_132$1;
 var $189$0=_bitshift64Shl($y_132$0,$y_132$1,$183$0);var $189$1=tempRet0;
 var $190$0=($188&255);
 var $190$1=0;
 var $191$0=$190$0|$189$0;
 var $191$1=$190$1|$189$1;
 var $192=HEAP32[(($2)>>2)];
 var $193=HEAP32[(($3)>>2)];
 var $194=($192>>>0)<($193>>>0);
 if($194){label=56;break;}else{label=57;break;}
 case 56: 
 var $196=(($192+1)|0);
 HEAP32[(($2)>>2)]=$196;
 var $197=HEAP8[(($192)>>0)];
 var $198=($197&255);
 var $c_5_be=$198;label=58;break;
 case 57: 
 var $200=___shgetc($f);
 var $c_5_be=$200;label=58;break;
 case 58: 
 var $c_5_be;
 var $_sum18=((($c_5_be)+(1))|0);
 var $201=((136+$_sum18)|0);
 var $202=HEAP8[(($201)>>0)];
 var $203=($202&255);
 var $204=($203>>>0)>=($_126>>>0);
 var $205=(($191$1>>>0) > ($184$1>>>0)) | (((($191$1>>>0) == ($184$1>>>0) & ($191$0>>>0) >  ($184$0>>>0))));
 var $or_cond=$204|$205;
 if($or_cond){var $y_3$1=$191$1;var $y_3$0=$191$0;var $c_8=$c_5_be;var $_125=$_126;label=72;break;}else{var $y_132$1=$191$1;var $y_132$0=$191$0;var $188=$202;label=55;break;}
 case 59: 
 var $206;
 var $x_256;
 var $207=(Math_imul($x_256,$_126)|0);
 var $208=((($206)+($207))|0);
 var $209=HEAP32[(($2)>>2)];
 var $210=HEAP32[(($3)>>2)];
 var $211=($209>>>0)<($210>>>0);
 if($211){label=60;break;}else{label=61;break;}
 case 60: 
 var $213=(($209+1)|0);
 HEAP32[(($2)>>2)]=$213;
 var $214=HEAP8[(($209)>>0)];
 var $215=($214&255);
 var $c_6_be=$215;label=62;break;
 case 61: 
 var $217=___shgetc($f);
 var $c_6_be=$217;label=62;break;
 case 62: 
 var $c_6_be;
 var $_sum21=((($c_6_be)+(1))|0);
 var $218=((136+$_sum21)|0);
 var $219=HEAP8[(($218)>>0)];
 var $220=($219&255);
 var $221=($220>>>0)<($_126>>>0);
 var $222=($208>>>0)<119304647;
 var $or_cond13=$221&$222;
 if($or_cond13){var $x_256=$208;var $206=$220;label=59;break;}else{label=63;break;}
 case 63: 
 var $phitmp$0=$208;
 var $phitmp$1=0;
 var $c_6_lcssa=$c_6_be;var $x_2_lcssa$1=$phitmp$1;var $x_2_lcssa$0=$phitmp$0;var $224=$219;label=64;break;
 case 64: 
 var $224;
 var $x_2_lcssa$0;
 var $x_2_lcssa$1;
 var $c_6_lcssa;
 var $225$0=$_126;
 var $225$1=0;
 var $226=($224&255);
 var $227=($226>>>0)<($_126>>>0);
 if($227){label=65;break;}else{var $y_3$1=$x_2_lcssa$1;var $y_3$0=$x_2_lcssa$0;var $c_8=$c_6_lcssa;var $_125=$_126;label=72;break;}
 case 65: 
 var $$etemp$4$0=-1;
 var $$etemp$4$1=-1;
 var $228$0=___udivdi3($$etemp$4$0,$$etemp$4$1,$225$0,$225$1);var $228$1=tempRet0;
 var $c_747=$c_6_lcssa;var $y_248$1=$x_2_lcssa$1;var $y_248$0=$x_2_lcssa$0;var $230=$224;label=66;break;
 case 66: 
 var $230;
 var $y_248$0;
 var $y_248$1;
 var $c_747;
 var $231=(($y_248$1>>>0) > ($228$1>>>0)) | (((($y_248$1>>>0) == ($228$1>>>0) & ($y_248$0>>>0) >  ($228$0>>>0))));
 if($231){var $y_3$1=$y_248$1;var $y_3$0=$y_248$0;var $c_8=$c_747;var $_125=$_126;label=72;break;}else{label=67;break;}
 case 67: 
 var $233$0=___muldi3($y_248$0,$y_248$1,$225$0,$225$1);var $233$1=tempRet0;
 var $234$0=($230&255);
 var $234$1=0;
 var $$etemp$5$0=-1;
 var $$etemp$5$1=-1;
 var $235$0=$234$0^$$etemp$5$0;
 var $235$1=$234$1^$$etemp$5$1;
 var $236=(($233$1>>>0) > ($235$1>>>0)) | (((($233$1>>>0) == ($235$1>>>0) & ($233$0>>>0) >  ($235$0>>>0))));
 if($236){var $y_3$1=$y_248$1;var $y_3$0=$y_248$0;var $c_8=$c_747;var $_125=$_126;label=72;break;}else{label=68;break;}
 case 68: 
 var $238$0=_i64Add($234$0,$234$1,$233$0,$233$1);var $238$1=tempRet0;
 var $239=HEAP32[(($2)>>2)];
 var $240=HEAP32[(($3)>>2)];
 var $241=($239>>>0)<($240>>>0);
 if($241){label=69;break;}else{label=70;break;}
 case 69: 
 var $243=(($239+1)|0);
 HEAP32[(($2)>>2)]=$243;
 var $244=HEAP8[(($239)>>0)];
 var $245=($244&255);
 var $c_7_be=$245;label=71;break;
 case 70: 
 var $247=___shgetc($f);
 var $c_7_be=$247;label=71;break;
 case 71: 
 var $c_7_be;
 var $_sum22=((($c_7_be)+(1))|0);
 var $248=((136+$_sum22)|0);
 var $249=HEAP8[(($248)>>0)];
 var $250=($249&255);
 var $251=($250>>>0)<($_126>>>0);
 if($251){var $c_747=$c_7_be;var $y_248$1=$238$1;var $y_248$0=$238$0;var $230=$249;label=66;break;}else{var $y_3$1=$238$1;var $y_3$0=$238$0;var $c_8=$c_7_be;var $_125=$_126;label=72;break;}
 case 72: 
 var $_125;
 var $c_8;
 var $y_3$0;
 var $y_3$1;
 var $_sum19=((($c_8)+(1))|0);
 var $252=((136+$_sum19)|0);
 var $253=HEAP8[(($252)>>0)];
 var $254=($253&255);
 var $255=($254>>>0)<($_125>>>0);
 if($255){label=73;break;}else{var $y_4$1=$y_3$1;var $y_4$0=$y_3$0;label=78;break;}
 case 73: 
 var $256=HEAP32[(($2)>>2)];
 var $257=HEAP32[(($3)>>2)];
 var $258=($256>>>0)<($257>>>0);
 if($258){label=74;break;}else{label=75;break;}
 case 74: 
 var $260=(($256+1)|0);
 HEAP32[(($2)>>2)]=$260;
 var $261=HEAP8[(($256)>>0)];
 var $262=($261&255);
 var $c_9_be=$262;label=76;break;
 case 75: 
 var $264=___shgetc($f);
 var $c_9_be=$264;label=76;break;
 case 76: 
 var $c_9_be;
 var $_sum20=((($c_9_be)+(1))|0);
 var $265=((136+$_sum20)|0);
 var $266=HEAP8[(($265)>>0)];
 var $267=($266&255);
 var $268=($267>>>0)<($_125>>>0);
 if($268){label=73;break;}else{label=77;break;}
 case 77: 
 var $269=___errno_location();
 HEAP32[(($269)>>2)]=34;
 var $y_4$1=$lim$1;var $y_4$0=$lim$0;label=78;break;
 case 78: 
 var $y_4$0;
 var $y_4$1;
 var $270=HEAP32[(($3)>>2)];
 var $271=($270|0)==0;
 if($271){label=80;break;}else{label=79;break;}
 case 79: 
 var $273=HEAP32[(($2)>>2)];
 var $274=((($273)-(1))|0);
 HEAP32[(($2)>>2)]=$274;
 label=80;break;
 case 80: 
 var $276=(($y_4$1>>>0) < ($lim$1>>>0)) | (((($y_4$1>>>0) == ($lim$1>>>0) & ($y_4$0>>>0) <  ($lim$0>>>0))));
 if($276){label=85;break;}else{label=81;break;}
 case 81: 
 var $$etemp$6$0=1;
 var $$etemp$6$1=0;
 var $278$0=$lim$0&$$etemp$6$0;
 var $278$1=$lim$1&$$etemp$6$1;
 var $$etemp$7$0=0;
 var $$etemp$7$1=0;
 var $279=(($278$0|0) != ($$etemp$7$0|0)) | (($278$1|0) != ($$etemp$7$1|0));
 var $280=($neg_0|0)!=0;
 var $or_cond15=$279|$280;
 if($or_cond15){label=83;break;}else{label=82;break;}
 case 82: 
 var $282=___errno_location();
 HEAP32[(($282)>>2)]=34;
 var $$etemp$8$0=-1;
 var $$etemp$8$1=-1;
 var $283$0=_i64Add($lim$0,$lim$1,$$etemp$8$0,$$etemp$8$1);var $283$1=tempRet0;
 var $_0$1=$283$1;var $_0$0=$283$0;label=86;break;
 case 83: 
 var $285=(($y_4$1>>>0) > ($lim$1>>>0)) | (((($y_4$1>>>0) == ($lim$1>>>0) & ($y_4$0>>>0) >  ($lim$0>>>0))));
 if($285){label=84;break;}else{label=85;break;}
 case 84: 
 var $287=___errno_location();
 HEAP32[(($287)>>2)]=34;
 var $_0$1=$lim$1;var $_0$0=$lim$0;label=86;break;
 case 85: 
 var $289$0=$neg_0;
 var $289$1=((((($neg_0|0)<0))|0)?-1:0);
 var $290$0=$y_4$0^$289$0;
 var $290$1=$y_4$1^$289$1;
 var $291$0=_i64Subtract($290$0,$290$1,$289$0,$289$1);var $291$1=tempRet0;
 var $_0$1=$291$1;var $_0$0=$291$0;label=86;break;
 case 86: 
 var $_0$0;
 var $_0$1;
 return (tempRet0=$_0$1,$_0$0);
  default: assert(0, "bad label: " + label);
 }

}

//Func
function ___floatscan($f,$prec,$pok){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+512)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $x_i=sp;
 if(($prec|0)==1){ label=2;break;}else if(($prec|0)==2){ label=3;break;}else if(($prec|0)==0){ var $emin_0_ph=-149;var $bits_0_ph=24;label=4;break;}else{var $_0=0;label=300;break;}
 case 2: 
 var $emin_0_ph=-1074;var $bits_0_ph=53;label=4;break;
 case 3: 
 var $emin_0_ph=-1074;var $bits_0_ph=53;label=4;break;
 case 4: 
 var $bits_0_ph;
 var $emin_0_ph;
 var $3=(($f+4)|0);
 var $4=(($f+100)|0);
 label=5;break;
 case 5: 
 var $5=HEAP32[(($3)>>2)];
 var $6=HEAP32[(($4)>>2)];
 var $7=($5>>>0)<($6>>>0);
 if($7){label=6;break;}else{label=7;break;}
 case 6: 
 var $9=(($5+1)|0);
 HEAP32[(($3)>>2)]=$9;
 var $10=HEAP8[(($5)>>0)];
 var $11=($10&255);
 var $15=$11;label=8;break;
 case 7: 
 var $13=___shgetc($f);
 var $15=$13;label=8;break;
 case 8: 
 var $15;
 switch(($15|0)){case 32:case 13:case 12:case 11:case 10:case 9:{ label=5;break;}default:{label=9;break;}}break;
 case 9: 
 var $17=($15|0)==45;
 if(($15|0)==45|($15|0)==43){ label=10;break;}else{var $c_0=$15;var $sign_0=1;label=13;break;}
 case 10: 
 var $18=HEAP32[(($3)>>2)];
 var $19=($17&1);
 var $20=$19<<1;
 var $21=(((1)-($20))|0);
 var $22=HEAP32[(($4)>>2)];
 var $23=($18>>>0)<($22>>>0);
 if($23){label=11;break;}else{label=12;break;}
 case 11: 
 var $25=(($18+1)|0);
 HEAP32[(($3)>>2)]=$25;
 var $26=HEAP8[(($18)>>0)];
 var $27=($26&255);
 var $c_0=$27;var $sign_0=$21;label=13;break;
 case 12: 
 var $29=___shgetc($f);
 var $c_0=$29;var $sign_0=$21;label=13;break;
 case 13: 
 var $sign_0;
 var $c_0;
 var $i_070=0;var $c_171=$c_0;label=14;break;
 case 14: 
 var $c_171;
 var $i_070;
 var $32=$c_171|32;
 var $33=((3992+$i_070)|0);
 var $34=HEAP8[(($33)>>0)];
 var $35=(($34<<24)>>24);
 var $36=($32|0)==($35|0);
 if($36){label=15;break;}else{var $i_0_lcssa=$i_070;var $c_1_lcssa=$c_171;label=20;break;}
 case 15: 
 var $38=($i_070>>>0)<7;
 if($38){label=16;break;}else{var $c_2=$c_171;label=19;break;}
 case 16: 
 var $40=HEAP32[(($3)>>2)];
 var $41=HEAP32[(($4)>>2)];
 var $42=($40>>>0)<($41>>>0);
 if($42){label=17;break;}else{label=18;break;}
 case 17: 
 var $44=(($40+1)|0);
 HEAP32[(($3)>>2)]=$44;
 var $45=HEAP8[(($40)>>0)];
 var $46=($45&255);
 var $c_2=$46;label=19;break;
 case 18: 
 var $48=___shgetc($f);
 var $c_2=$48;label=19;break;
 case 19: 
 var $c_2;
 var $50=((($i_070)+(1))|0);
 var $51=($50>>>0)<8;
 if($51){var $i_070=$50;var $c_171=$c_2;label=14;break;}else{var $i_0_lcssa=$50;var $c_1_lcssa=$c_2;label=20;break;}
 case 20: 
 var $c_1_lcssa;
 var $i_0_lcssa;
 if(($i_0_lcssa|0)==3){ label=23;break;}else if(($i_0_lcssa|0)==8){ label=27;break;}else{label=21;break;}
 case 21: 
 var $54=($i_0_lcssa>>>0)>3;
 var $55=($pok|0)!=0;
 var $or_cond5=$54&$55;
 if($or_cond5){label=22;break;}else{label=28;break;}
 case 22: 
 var $57=($i_0_lcssa|0)==8;
 if($57){label=27;break;}else{label=23;break;}
 case 23: 
 var $59=HEAP32[(($4)>>2)];
 var $60=($59|0)==0;
 if($60){label=27;break;}else{label=24;break;}
 case 24: 
 var $62=HEAP32[(($3)>>2)];
 var $63=((($62)-(1))|0);
 HEAP32[(($3)>>2)]=$63;
 var $notlhs=($pok|0)==0;
 var $notrhs=($i_0_lcssa>>>0)<4;
 var $or_cond9_not=$notrhs|$notlhs;
 if($or_cond9_not){label=27;break;}else{var $i_1=$i_0_lcssa;var $64=$63;label=25;break;}
 case 25: 
 var $64;
 var $i_1;
 var $65=((($64)-(1))|0);
 var $66=((($i_1)-(1))|0);
 var $_old8=($66>>>0)>3;
 if($_old8){var $i_1=$66;var $64=$65;label=25;break;}else{label=26;break;}
 case 26: 
 HEAP32[(($3)>>2)]=$65;
 label=27;break;
 case 27: 
 var $67=($sign_0|0);
 var $68=($67)*(Infinity);
 var $69=$68;
 var $_0=$69;label=300;break;
 case 28: 
 var $71=($i_0_lcssa|0)==0;
 if($71){var $i_268=0;var $c_369=$c_1_lcssa;label=29;break;}else{var $c_5=$c_1_lcssa;var $i_3=$i_0_lcssa;label=35;break;}
 case 29: 
 var $c_369;
 var $i_268;
 var $72=$c_369|32;
 var $73=((3464+$i_268)|0);
 var $74=HEAP8[(($73)>>0)];
 var $75=(($74<<24)>>24);
 var $76=($72|0)==($75|0);
 if($76){label=30;break;}else{var $c_5=$c_369;var $i_3=$i_268;label=35;break;}
 case 30: 
 var $78=($i_268>>>0)<2;
 if($78){label=31;break;}else{var $c_4=$c_369;label=34;break;}
 case 31: 
 var $80=HEAP32[(($3)>>2)];
 var $81=HEAP32[(($4)>>2)];
 var $82=($80>>>0)<($81>>>0);
 if($82){label=32;break;}else{label=33;break;}
 case 32: 
 var $84=(($80+1)|0);
 HEAP32[(($3)>>2)]=$84;
 var $85=HEAP8[(($80)>>0)];
 var $86=($85&255);
 var $c_4=$86;label=34;break;
 case 33: 
 var $88=___shgetc($f);
 var $c_4=$88;label=34;break;
 case 34: 
 var $c_4;
 var $90=((($i_268)+(1))|0);
 var $91=($90>>>0)<3;
 if($91){var $i_268=$90;var $c_369=$c_4;label=29;break;}else{var $c_5=$c_4;var $i_3=$90;label=35;break;}
 case 35: 
 var $i_3;
 var $c_5;
 if(($i_3|0)==3){ label=36;break;}else if(($i_3|0)==0){ label=59;break;}else{label=56;break;}
 case 36: 
 var $93=HEAP32[(($3)>>2)];
 var $94=HEAP32[(($4)>>2)];
 var $95=($93>>>0)<($94>>>0);
 if($95){label=37;break;}else{label=38;break;}
 case 37: 
 var $97=(($93+1)|0);
 HEAP32[(($3)>>2)]=$97;
 var $98=HEAP8[(($93)>>0)];
 var $99=($98&255);
 var $103=$99;label=39;break;
 case 38: 
 var $101=___shgetc($f);
 var $103=$101;label=39;break;
 case 39: 
 var $103;
 var $104=($103|0)==40;
 if($104){var $i_4=1;label=42;break;}else{label=40;break;}
 case 40: 
 var $106=HEAP32[(($4)>>2)];
 var $107=($106|0)==0;
 if($107){var $_0=NaN;label=300;break;}else{label=41;break;}
 case 41: 
 var $109=HEAP32[(($3)>>2)];
 var $110=((($109)-(1))|0);
 HEAP32[(($3)>>2)]=$110;
 var $_0=NaN;label=300;break;
 case 42: 
 var $i_4;
 var $111=HEAP32[(($3)>>2)];
 var $112=HEAP32[(($4)>>2)];
 var $113=($111>>>0)<($112>>>0);
 if($113){label=43;break;}else{label=44;break;}
 case 43: 
 var $115=(($111+1)|0);
 HEAP32[(($3)>>2)]=$115;
 var $116=HEAP8[(($111)>>0)];
 var $117=($116&255);
 var $121=$117;label=45;break;
 case 44: 
 var $119=___shgetc($f);
 var $121=$119;label=45;break;
 case 45: 
 var $121;
 var $122=((($121)-(48))|0);
 var $123=($122>>>0)<10;
 var $124=((($121)-(65))|0);
 var $125=($124>>>0)<26;
 var $or_cond=$123|$125;
 if($or_cond){label=55;break;}else{label=46;break;}
 case 46: 
 var $127=((($121)-(97))|0);
 var $128=($127>>>0)<26;
 var $129=($121|0)==95;
 var $or_cond7=$128|$129;
 if($or_cond7){label=55;break;}else{label=47;break;}
 case 47: 
 var $131=($121|0)==41;
 if($131){var $_0=NaN;label=300;break;}else{label=48;break;}
 case 48: 
 var $133=HEAP32[(($4)>>2)];
 var $134=($133|0)==0;
 if($134){label=50;break;}else{label=49;break;}
 case 49: 
 var $136=HEAP32[(($3)>>2)];
 var $137=((($136)-(1))|0);
 HEAP32[(($3)>>2)]=$137;
 label=50;break;
 case 50: 
 if($55){label=51;break;}else{label=53;break;}
 case 51: 
 var $139=($i_4|0)==0;
 var $brmerge108=$139|$134;
 if($brmerge108){var $_0=NaN;label=300;break;}else{label=52;break;}
 case 52: 
 var $_promoted23=HEAP32[(($3)>>2)];
 var $_in=$i_4;var $150=$_promoted23;label=54;break;
 case 53: 
 var $141=___errno_location();
 HEAP32[(($141)>>2)]=22;
 var $142=(($f+104)|0);
 HEAP32[(($142)>>2)]=0;
 var $143=(($f+8)|0);
 var $144=HEAP32[(($143)>>2)];
 var $145=HEAP32[(($3)>>2)];
 var $146=$144;
 var $147=$145;
 var $148=((($146)-($147))|0);
 var $149=(($f+108)|0);
 HEAP32[(($149)>>2)]=$148;
 HEAP32[(($4)>>2)]=$144;
 var $_0=0;label=300;break;
 case 54: 
 var $150;
 var $_in;
 var $151=((($_in)-(1))|0);
 var $152=((($150)-(1))|0);
 var $153=($151|0)==0;
 if($153){label=299;break;}else{var $_in=$151;var $150=$152;label=54;break;}
 case 55: 
 var $155=((($i_4)+(1))|0);
 var $i_4=$155;label=42;break;
 case 56: 
 var $157=HEAP32[(($4)>>2)];
 var $158=($157|0)==0;
 var $_pre=HEAP32[(($3)>>2)];
 if($158){var $161=$_pre;label=58;break;}else{label=57;break;}
 case 57: 
 var $160=((($_pre)-(1))|0);
 HEAP32[(($3)>>2)]=$160;
 var $161=$160;label=58;break;
 case 58: 
 var $161;
 var $162=___errno_location();
 HEAP32[(($162)>>2)]=22;
 var $163=(($f+104)|0);
 HEAP32[(($163)>>2)]=0;
 var $164=(($f+8)|0);
 var $165=HEAP32[(($164)>>2)];
 var $166=$165;
 var $167=$161;
 var $168=((($166)-($167))|0);
 var $169=(($f+108)|0);
 HEAP32[(($169)>>2)]=$168;
 HEAP32[(($4)>>2)]=$165;
 var $_0=0;label=300;break;
 case 59: 
 var $171=($c_5|0)==48;
 if($171){label=60;break;}else{var $c_6=$c_5;label=145;break;}
 case 60: 
 var $173=HEAP32[(($3)>>2)];
 var $174=HEAP32[(($4)>>2)];
 var $175=($173>>>0)<($174>>>0);
 if($175){label=61;break;}else{label=62;break;}
 case 61: 
 var $177=(($173+1)|0);
 HEAP32[(($3)>>2)]=$177;
 var $178=HEAP8[(($173)>>0)];
 var $179=($178&255);
 var $183=$179;label=63;break;
 case 62: 
 var $181=___shgetc($f);
 var $183=$181;label=63;break;
 case 63: 
 var $183;
 var $184=$183|32;
 var $185=($184|0)==120;
 if($185){label=64;break;}else{label=143;break;}
 case 64: 
 var $187=HEAP32[(($3)>>2)];
 var $188=HEAP32[(($4)>>2)];
 var $189=($187>>>0)<($188>>>0);
 if($189){label=65;break;}else{label=66;break;}
 case 65: 
 var $191=(($187+1)|0);
 HEAP32[(($3)>>2)]=$191;
 var $192=HEAP8[(($187)>>0)];
 var $193=($192&255);
 var $c_0_i=$193;var $gotdig_0_i=0;label=67;break;
 case 66: 
 var $195=___shgetc($f);
 var $c_0_i=$195;var $gotdig_0_i=0;label=67;break;
 case 67: 
 var $gotdig_0_i;
 var $c_0_i;
 if(($c_0_i|0)==48){ label=68;break;}else if(($c_0_i|0)==46){ label=71;break;}else{var $c_2_i=$c_0_i;var $dc_0_i$1=0;var $dc_0_i$0=0;var $rp_1_i$1=0;var $rp_1_i$0=0;var $gotdig_2_i=$gotdig_0_i;var $gotrad_0_i=0;var $gottail_0_i=0;var $scale_0_i=1;var $y_0_i=0;var $x_0_i=0;label=79;break;}
 case 68: 
 var $197=HEAP32[(($3)>>2)];
 var $198=HEAP32[(($4)>>2)];
 var $199=($197>>>0)<($198>>>0);
 if($199){label=69;break;}else{label=70;break;}
 case 69: 
 var $201=(($197+1)|0);
 HEAP32[(($3)>>2)]=$201;
 var $202=HEAP8[(($197)>>0)];
 var $203=($202&255);
 var $c_0_i=$203;var $gotdig_0_i=1;label=67;break;
 case 70: 
 var $205=___shgetc($f);
 var $c_0_i=$205;var $gotdig_0_i=1;label=67;break;
 case 71: 
 var $207=HEAP32[(($3)>>2)];
 var $208=HEAP32[(($4)>>2)];
 var $209=($207>>>0)<($208>>>0);
 if($209){label=72;break;}else{label=73;break;}
 case 72: 
 var $211=(($207+1)|0);
 HEAP32[(($3)>>2)]=$211;
 var $212=HEAP8[(($207)>>0)];
 var $213=($212&255);
 var $c_1_ph_i=$213;label=74;break;
 case 73: 
 var $215=___shgetc($f);
 var $c_1_ph_i=$215;label=74;break;
 case 74: 
 var $c_1_ph_i;
 var $216=($c_1_ph_i|0)==48;
 if($216){var $rp_026_i$1=0;var $rp_026_i$0=0;label=75;break;}else{var $c_2_i=$c_1_ph_i;var $dc_0_i$1=0;var $dc_0_i$0=0;var $rp_1_i$1=0;var $rp_1_i$0=0;var $gotdig_2_i=$gotdig_0_i;var $gotrad_0_i=1;var $gottail_0_i=0;var $scale_0_i=1;var $y_0_i=0;var $x_0_i=0;label=79;break;}
 case 75: 
 var $rp_026_i$0;
 var $rp_026_i$1;
 var $217=HEAP32[(($3)>>2)];
 var $218=HEAP32[(($4)>>2)];
 var $219=($217>>>0)<($218>>>0);
 if($219){label=76;break;}else{label=77;break;}
 case 76: 
 var $221=(($217+1)|0);
 HEAP32[(($3)>>2)]=$221;
 var $222=HEAP8[(($217)>>0)];
 var $223=($222&255);
 var $227=$223;label=78;break;
 case 77: 
 var $225=___shgetc($f);
 var $227=$225;label=78;break;
 case 78: 
 var $227;
 var $$etemp$0$0=-1;
 var $$etemp$0$1=-1;
 var $228$0=_i64Add($rp_026_i$0,$rp_026_i$1,$$etemp$0$0,$$etemp$0$1);var $228$1=tempRet0;
 var $229=($227|0)==48;
 if($229){var $rp_026_i$1=$228$1;var $rp_026_i$0=$228$0;label=75;break;}else{var $c_2_i=$227;var $dc_0_i$1=0;var $dc_0_i$0=0;var $rp_1_i$1=$228$1;var $rp_1_i$0=$228$0;var $gotdig_2_i=1;var $gotrad_0_i=1;var $gottail_0_i=0;var $scale_0_i=1;var $y_0_i=0;var $x_0_i=0;label=79;break;}
 case 79: 
 var $x_0_i;
 var $y_0_i;
 var $scale_0_i;
 var $gottail_0_i;
 var $gotrad_0_i;
 var $gotdig_2_i;
 var $rp_1_i$0;
 var $rp_1_i$1;
 var $dc_0_i$0;
 var $dc_0_i$1;
 var $c_2_i;
 var $230=((($c_2_i)-(48))|0);
 var $231=($230>>>0)<10;
 if($231){var $d_0_i=$230;label=84;break;}else{label=80;break;}
 case 80: 
 var $233=$c_2_i|32;
 var $234=((($233)-(97))|0);
 var $235=($234>>>0)<6;
 var $236=($c_2_i|0)==46;
 var $or_cond_i=$235|$236;
 if($or_cond_i){label=81;break;}else{var $c_2_lcssa_i=$c_2_i;label=94;break;}
 case 81: 
 if($236){label=82;break;}else{label=83;break;}
 case 82: 
 var $239=($gotrad_0_i|0)==0;
 if($239){var $dc_1_i$1=$dc_0_i$1;var $dc_1_i$0=$dc_0_i$0;var $rp_2_i$1=$dc_0_i$1;var $rp_2_i$0=$dc_0_i$0;var $gotdig_3_i=$gotdig_2_i;var $gotrad_1_i=1;var $gottail_2_i=$gottail_0_i;var $scale_2_i=$scale_0_i;var $y_2_i=$y_0_i;var $x_2_i=$x_0_i;label=91;break;}else{var $c_2_lcssa_i=46;label=94;break;}
 case 83: 
 var $241=($c_2_i|0)>57;
 var $242=((($233)-(87))|0);
 var $__i=($241?$242:$230);
 var $d_0_i=$__i;label=84;break;
 case 84: 
 var $d_0_i;
 var $$etemp$1$0=8;
 var $$etemp$1$1=0;
 var $243=(($dc_0_i$1|0) < ($$etemp$1$1|0)) | (((($dc_0_i$1|0) == ($$etemp$1$1|0) & ($dc_0_i$0>>>0) <  ($$etemp$1$0>>>0))));
 if($243){label=85;break;}else{label=86;break;}
 case 85: 
 var $245=$x_0_i<<4;
 var $246=((($d_0_i)+($245))|0);
 var $gottail_1_i=$gottail_0_i;var $scale_1_i=$scale_0_i;var $y_1_i=$y_0_i;var $x_1_i=$246;label=90;break;
 case 86: 
 var $$etemp$2$0=14;
 var $$etemp$2$1=0;
 var $248=(($dc_0_i$1|0) < ($$etemp$2$1|0)) | (((($dc_0_i$1|0) == ($$etemp$2$1|0) & ($dc_0_i$0>>>0) <  ($$etemp$2$0>>>0))));
 if($248){label=87;break;}else{label=88;break;}
 case 87: 
 var $250=($d_0_i|0);
 var $251=($scale_0_i)*((0.0625));
 var $252=($251)*($250);
 var $253=($y_0_i)+($252);
 var $gottail_1_i=$gottail_0_i;var $scale_1_i=$251;var $y_1_i=$253;var $x_1_i=$x_0_i;label=90;break;
 case 88: 
 var $255=($d_0_i|0)==0;
 var $256=($gottail_0_i|0)!=0;
 var $or_cond3_i=$255|$256;
 if($or_cond3_i){var $gottail_1_i=$gottail_0_i;var $scale_1_i=$scale_0_i;var $y_1_i=$y_0_i;var $x_1_i=$x_0_i;label=90;break;}else{label=89;break;}
 case 89: 
 var $258=($scale_0_i)*((0.5));
 var $259=($y_0_i)+($258);
 var $gottail_1_i=1;var $scale_1_i=$scale_0_i;var $y_1_i=$259;var $x_1_i=$x_0_i;label=90;break;
 case 90: 
 var $x_1_i;
 var $y_1_i;
 var $scale_1_i;
 var $gottail_1_i;
 var $$etemp$3$0=1;
 var $$etemp$3$1=0;
 var $261$0=_i64Add($dc_0_i$0,$dc_0_i$1,$$etemp$3$0,$$etemp$3$1);var $261$1=tempRet0;
 var $dc_1_i$1=$261$1;var $dc_1_i$0=$261$0;var $rp_2_i$1=$rp_1_i$1;var $rp_2_i$0=$rp_1_i$0;var $gotdig_3_i=1;var $gotrad_1_i=$gotrad_0_i;var $gottail_2_i=$gottail_1_i;var $scale_2_i=$scale_1_i;var $y_2_i=$y_1_i;var $x_2_i=$x_1_i;label=91;break;
 case 91: 
 var $x_2_i;
 var $y_2_i;
 var $scale_2_i;
 var $gottail_2_i;
 var $gotrad_1_i;
 var $gotdig_3_i;
 var $rp_2_i$0;
 var $rp_2_i$1;
 var $dc_1_i$0;
 var $dc_1_i$1;
 var $263=HEAP32[(($3)>>2)];
 var $264=HEAP32[(($4)>>2)];
 var $265=($263>>>0)<($264>>>0);
 if($265){label=92;break;}else{label=93;break;}
 case 92: 
 var $267=(($263+1)|0);
 HEAP32[(($3)>>2)]=$267;
 var $268=HEAP8[(($263)>>0)];
 var $269=($268&255);
 var $c_2_i=$269;var $dc_0_i$1=$dc_1_i$1;var $dc_0_i$0=$dc_1_i$0;var $rp_1_i$1=$rp_2_i$1;var $rp_1_i$0=$rp_2_i$0;var $gotdig_2_i=$gotdig_3_i;var $gotrad_0_i=$gotrad_1_i;var $gottail_0_i=$gottail_2_i;var $scale_0_i=$scale_2_i;var $y_0_i=$y_2_i;var $x_0_i=$x_2_i;label=79;break;
 case 93: 
 var $271=___shgetc($f);
 var $c_2_i=$271;var $dc_0_i$1=$dc_1_i$1;var $dc_0_i$0=$dc_1_i$0;var $rp_1_i$1=$rp_2_i$1;var $rp_1_i$0=$rp_2_i$0;var $gotdig_2_i=$gotdig_3_i;var $gotrad_0_i=$gotrad_1_i;var $gottail_0_i=$gottail_2_i;var $scale_0_i=$scale_2_i;var $y_0_i=$y_2_i;var $x_0_i=$x_2_i;label=79;break;
 case 94: 
 var $c_2_lcssa_i;
 var $273=($gotdig_2_i|0)==0;
 if($273){label=95;break;}else{label=103;break;}
 case 95: 
 var $275=HEAP32[(($4)>>2)];
 var $276=($275|0)==0;
 if($276){label=97;break;}else{label=96;break;}
 case 96: 
 var $278=HEAP32[(($3)>>2)];
 var $279=((($278)-(1))|0);
 HEAP32[(($3)>>2)]=$279;
 label=97;break;
 case 97: 
 var $281=($pok|0)==0;
 if($281){label=101;break;}else{label=98;break;}
 case 98: 
 if($276){label=102;break;}else{label=99;break;}
 case 99: 
 var $284=HEAP32[(($3)>>2)];
 var $285=((($284)-(1))|0);
 HEAP32[(($3)>>2)]=$285;
 var $286=($gotrad_0_i|0)==0;
 if($286){label=102;break;}else{label=100;break;}
 case 100: 
 var $288=((($284)-(2))|0);
 HEAP32[(($3)>>2)]=$288;
 label=102;break;
 case 101: 
 var $290=(($f+104)|0);
 HEAP32[(($290)>>2)]=0;
 var $291=(($f+8)|0);
 var $292=HEAP32[(($291)>>2)];
 var $293=HEAP32[(($3)>>2)];
 var $294=$292;
 var $295=$293;
 var $296=((($294)-($295))|0);
 var $297=(($f+108)|0);
 HEAP32[(($297)>>2)]=$296;
 HEAP32[(($4)>>2)]=$292;
 label=102;break;
 case 102: 
 var $298=($sign_0|0);
 var $299=($298)*(0);
 var $_0=$299;label=300;break;
 case 103: 
 var $301=($gotrad_0_i|0)==0;
 var $dc_0_rp_1_i$0=($301?$dc_0_i$0:$rp_1_i$0);
 var $dc_0_rp_1_i$1=($301?$dc_0_i$1:$rp_1_i$1);
 var $$etemp$4$0=8;
 var $$etemp$4$1=0;
 var $302=(($dc_0_i$1|0) < ($$etemp$4$1|0)) | (((($dc_0_i$1|0) == ($$etemp$4$1|0) & ($dc_0_i$0>>>0) <  ($$etemp$4$0>>>0))));
 if($302){var $x_318_i=$x_0_i;var $dc_219_i$1=$dc_0_i$1;var $dc_219_i$0=$dc_0_i$0;label=104;break;}else{var $x_3_lcssa_i=$x_0_i;label=105;break;}
 case 104: 
 var $dc_219_i$0;
 var $dc_219_i$1;
 var $x_318_i;
 var $303=$x_318_i<<4;
 var $$etemp$5$0=1;
 var $$etemp$5$1=0;
 var $304$0=_i64Add($dc_219_i$0,$dc_219_i$1,$$etemp$5$0,$$etemp$5$1);var $304$1=tempRet0;
 var $$etemp$6$0=8;
 var $$etemp$6$1=0;
 var $305=(($304$1|0) < ($$etemp$6$1|0)) | (((($304$1|0) == ($$etemp$6$1|0) & ($304$0>>>0) <  ($$etemp$6$0>>>0))));
 if($305){var $x_318_i=$303;var $dc_219_i$1=$304$1;var $dc_219_i$0=$304$0;label=104;break;}else{var $x_3_lcssa_i=$303;label=105;break;}
 case 105: 
 var $x_3_lcssa_i;
 var $306=$c_2_lcssa_i|32;
 var $307=($306|0)==112;
 if($307){label=106;break;}else{label=111;break;}
 case 106: 
 var $309$0=_scanexp($f,$pok);
 var $309$1=tempRet0;
 var $$etemp$7$0=0;
 var $$etemp$7$1=-2147483648;
 var $310=(($309$0|0) == ($$etemp$7$0|0)) & (($309$1|0) == ($$etemp$7$1|0));
 if($310){label=107;break;}else{var $e2_0_i$1=$309$1;var $e2_0_i$0=$309$0;label=113;break;}
 case 107: 
 var $312=($pok|0)==0;
 if($312){label=110;break;}else{label=108;break;}
 case 108: 
 var $314=HEAP32[(($4)>>2)];
 var $315=($314|0)==0;
 if($315){var $e2_0_i$1=0;var $e2_0_i$0=0;label=113;break;}else{label=109;break;}
 case 109: 
 var $317=HEAP32[(($3)>>2)];
 var $318=((($317)-(1))|0);
 HEAP32[(($3)>>2)]=$318;
 var $e2_0_i$1=0;var $e2_0_i$0=0;label=113;break;
 case 110: 
 var $320=(($f+104)|0);
 HEAP32[(($320)>>2)]=0;
 var $321=(($f+8)|0);
 var $322=HEAP32[(($321)>>2)];
 var $323=HEAP32[(($3)>>2)];
 var $324=$322;
 var $325=$323;
 var $326=((($324)-($325))|0);
 var $327=(($f+108)|0);
 HEAP32[(($327)>>2)]=$326;
 HEAP32[(($4)>>2)]=$322;
 var $_0=0;label=300;break;
 case 111: 
 var $329=HEAP32[(($4)>>2)];
 var $330=($329|0)==0;
 if($330){var $e2_0_i$1=0;var $e2_0_i$0=0;label=113;break;}else{label=112;break;}
 case 112: 
 var $332=HEAP32[(($3)>>2)];
 var $333=((($332)-(1))|0);
 HEAP32[(($3)>>2)]=$333;
 var $e2_0_i$1=0;var $e2_0_i$0=0;label=113;break;
 case 113: 
 var $e2_0_i$0;
 var $e2_0_i$1;
 var $335$0=($dc_0_rp_1_i$0<<2)|(0>>>30);
 var $335$1=($dc_0_rp_1_i$1<<2)|($dc_0_rp_1_i$0>>>30);
 var $$etemp$8$0=-32;
 var $$etemp$8$1=-1;
 var $336$0=_i64Add($335$0,$335$1,$$etemp$8$0,$$etemp$8$1);var $336$1=tempRet0;
 var $337$0=_i64Add($336$0,$336$1,$e2_0_i$0,$e2_0_i$1);var $337$1=tempRet0;
 var $338=($x_3_lcssa_i|0)==0;
 if($338){label=114;break;}else{label=115;break;}
 case 114: 
 var $340=($sign_0|0);
 var $341=($340)*(0);
 var $_0=$341;label=300;break;
 case 115: 
 var $343=(((-$emin_0_ph))|0);
 var $344$0=$343;
 var $344$1=0;
 var $345=(($337$1|0) > ($344$1|0)) | (((($337$1|0) == ($344$1|0) & ($337$0>>>0) >  ($344$0>>>0))));
 if($345){label=116;break;}else{label=117;break;}
 case 116: 
 var $347=___errno_location();
 HEAP32[(($347)>>2)]=34;
 var $348=($sign_0|0);
 var $349=($348)*((1.7976931348623157e+308));
 var $350=($349)*((1.7976931348623157e+308));
 var $_0=$350;label=300;break;
 case 117: 
 var $352=((($emin_0_ph)-(106))|0);
 var $353$0=$352;
 var $353$1=((((($352|0)<0))|0)?-1:0);
 var $354=(($337$1|0) < ($353$1|0)) | (((($337$1|0) == ($353$1|0) & ($337$0>>>0) <  ($353$0>>>0))));
 if($354){label=119;break;}else{label=118;break;}
 case 118: 
 var $355=($x_3_lcssa_i|0)>-1;
 if($355){var $x_413_i=$x_3_lcssa_i;var $y_314_i=$y_0_i;var $e2_115_i$1=$337$1;var $e2_115_i$0=$337$0;label=120;break;}else{var $x_4_lcssa_i=$x_3_lcssa_i;var $y_3_lcssa_i=$y_0_i;var $e2_1_lcssa_i$1=$337$1;var $e2_1_lcssa_i$0=$337$0;label=123;break;}
 case 119: 
 var $357=___errno_location();
 HEAP32[(($357)>>2)]=34;
 var $358=($sign_0|0);
 var $359=($358)*((2.2250738585072014e-308));
 var $360=($359)*((2.2250738585072014e-308));
 var $_0=$360;label=300;break;
 case 120: 
 var $e2_115_i$0;
 var $e2_115_i$1;
 var $y_314_i;
 var $x_413_i;
 var $361=$y_314_i<(0.5);
 var $362=$x_413_i<<1;
 if($361){var $_pn_i=$y_314_i;var $x_5_i=$362;label=122;break;}else{label=121;break;}
 case 121: 
 var $364=$362|1;
 var $365=($y_314_i)-(1);
 var $_pn_i=$365;var $x_5_i=$364;label=122;break;
 case 122: 
 var $x_5_i;
 var $_pn_i;
 var $y_4_i=($y_314_i)+($_pn_i);
 var $$etemp$9$0=-1;
 var $$etemp$9$1=-1;
 var $367$0=_i64Add($e2_115_i$0,$e2_115_i$1,$$etemp$9$0,$$etemp$9$1);var $367$1=tempRet0;
 var $368=($x_5_i|0)>-1;
 if($368){var $x_413_i=$x_5_i;var $y_314_i=$y_4_i;var $e2_115_i$1=$367$1;var $e2_115_i$0=$367$0;label=120;break;}else{var $x_4_lcssa_i=$x_5_i;var $y_3_lcssa_i=$y_4_i;var $e2_1_lcssa_i$1=$367$1;var $e2_1_lcssa_i$0=$367$0;label=123;break;}
 case 123: 
 var $e2_1_lcssa_i$0;
 var $e2_1_lcssa_i$1;
 var $y_3_lcssa_i;
 var $x_4_lcssa_i;
 var $369$0=$bits_0_ph;
 var $369$1=0;
 var $370$0=$emin_0_ph;
 var $370$1=((((($emin_0_ph|0)<0))|0)?-1:0);
 var $$etemp$10$0=32;
 var $$etemp$10$1=0;
 var $371$0=_i64Subtract($$etemp$10$0,$$etemp$10$1,$370$0,$370$1);var $371$1=tempRet0;
 var $372$0=_i64Add($e2_1_lcssa_i$0,$e2_1_lcssa_i$1,$371$0,$371$1);var $372$1=tempRet0;
 var $373=(($369$1|0) > ($372$1|0)) | (((($369$1|0) == ($372$1|0) & ($369$0>>>0) >  ($372$0>>>0))));
 if($373){label=124;break;}else{var $_06_i=$bits_0_ph;label=125;break;}
 case 124: 
 var $375$0=$372$0;
 var $375=$375$0;
 var $376=($375|0)<0;
 if($376){var $_0611_i=0;label=127;break;}else{var $_06_i=$375;label=125;break;}
 case 125: 
 var $_06_i;
 var $378=($_06_i|0)<53;
 if($378){var $_0611_i=$_06_i;label=127;break;}else{label=126;break;}
 case 126: 
 var $_pre_i=($sign_0|0);
 var $bias_0_i=0;var $_0612_i=$_06_i;var $_pre_phi_i=$_pre_i;label=134;break;
 case 127: 
 var $_0611_i;
 var $379=(((84)-($_0611_i))|0);
 var $380=($379|0)>1023;
 if($380){label=128;break;}else{label=130;break;}
 case 128: 
 var $382=((($379)-(1023))|0);
 var $383=($382|0)>1023;
 if($383){label=129;break;}else{var $y_0_i11=8.98846567431158e+307;var $_0_i10=$382;label=133;break;}
 case 129: 
 var $385=((($379)-(2046))|0);
 var $386=($385|0)>1023;
 var $__i8=($386?1023:$385);
 var $y_0_i11=Infinity;var $_0_i10=$__i8;label=133;break;
 case 130: 
 var $388=($379|0)<-1022;
 if($388){label=131;break;}else{var $y_0_i11=1;var $_0_i10=$379;label=133;break;}
 case 131: 
 var $390=((($379)+(1022))|0);
 var $391=($390|0)<-1022;
 if($391){label=132;break;}else{var $y_0_i11=2.2250738585072014e-308;var $_0_i10=$390;label=133;break;}
 case 132: 
 var $393=((($379)+(2044))|0);
 var $394=($393|0)<-1022;
 var $_1_i9=($394?-1022:$393);
 var $y_0_i11=0;var $_0_i10=$_1_i9;label=133;break;
 case 133: 
 var $_0_i10;
 var $y_0_i11;
 var $395=((($_0_i10)+(1023))|0);
 var $396$0=$395;
 var $396$1=0;
 var $397$0=(0<<20)|(0>>>12);
 var $397$1=($396$0<<20)|(0>>>12);
 var $398=(HEAP32[((tempDoublePtr)>>2)]=$397$0, HEAP32[(((tempDoublePtr)+(4))>>2)]=$397$1, HEAPF64[(tempDoublePtr)>>3]);
 var $399=($y_0_i11)*($398);
 var $400=($sign_0|0);
 HEAPF64[(tempDoublePtr)>>3]=$399; var $401$0=HEAP32[((tempDoublePtr)>>2)];var $401$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 HEAPF64[(tempDoublePtr)>>3]=$400; var $402$0=HEAP32[((tempDoublePtr)>>2)];var $402$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 var $$etemp$11$0=-1;
 var $$etemp$11$1=2147483647;
 var $403$0=$401$0&$$etemp$11$0;
 var $403$1=$401$1&$$etemp$11$1;
 var $$etemp$12$0=0;
 var $$etemp$12$1=-2147483648;
 var $404$0=$402$0&$$etemp$12$0;
 var $404$1=$402$1&$$etemp$12$1;
 var $405$0=$404$0|$403$0;
 var $405$1=$404$1|$403$1;
 var $406=(HEAP32[((tempDoublePtr)>>2)]=$405$0, HEAP32[(((tempDoublePtr)+(4))>>2)]=$405$1, HEAPF64[(tempDoublePtr)>>3]);
 var $bias_0_i=$406;var $_0612_i=$_0611_i;var $_pre_phi_i=$400;label=134;break;
 case 134: 
 var $_pre_phi_i;
 var $_0612_i;
 var $bias_0_i;
 var $408=($_0612_i|0)<32;
 var $409=$y_3_lcssa_i!=0;
 var $or_cond5_i=$408&$409;
 var $410=$x_4_lcssa_i&1;
 var $411=($410|0)==0;
 var $or_cond8_i=$or_cond5_i&$411;
 var $412=($or_cond8_i&1);
 var $x_6_i=((($412)+($x_4_lcssa_i))|0);
 var $y_5_i=($or_cond8_i?0:$y_3_lcssa_i);
 var $413=($x_6_i>>>0);
 var $414=($_pre_phi_i)*($413);
 var $415=($bias_0_i)+($414);
 var $416=($_pre_phi_i)*($y_5_i);
 var $417=($416)+($415);
 var $418=($417)-($bias_0_i);
 var $419=$418!=0;
 if($419){label=136;break;}else{label=135;break;}
 case 135: 
 var $421=___errno_location();
 HEAP32[(($421)>>2)]=34;
 label=136;break;
 case 136: 
 var $423$0=$e2_1_lcssa_i$0;
 var $423=$423$0;
 var $424=($423|0)>1023;
 if($424){label=137;break;}else{label=139;break;}
 case 137: 
 var $426=($418)*((8.98846567431158e+307));
 var $427=((($423)-(1023))|0);
 var $428=($427|0)>1023;
 if($428){label=138;break;}else{var $y_0_i_i16=$426;var $_0_i_i15=$427;label=142;break;}
 case 138: 
 var $430=($426)*((8.98846567431158e+307));
 var $431=((($423)-(2046))|0);
 var $432=($431|0)>1023;
 var $__i_i13=($432?1023:$431);
 var $y_0_i_i16=$430;var $_0_i_i15=$__i_i13;label=142;break;
 case 139: 
 var $434=($423|0)<-1022;
 if($434){label=140;break;}else{var $y_0_i_i16=$418;var $_0_i_i15=$423;label=142;break;}
 case 140: 
 var $436=($418)*((2.2250738585072014e-308));
 var $437=((($423)+(1022))|0);
 var $438=($437|0)<-1022;
 if($438){label=141;break;}else{var $y_0_i_i16=$436;var $_0_i_i15=$437;label=142;break;}
 case 141: 
 var $440=($436)*((2.2250738585072014e-308));
 var $441=((($423)+(2044))|0);
 var $442=($441|0)<-1022;
 var $_1_i_i14=($442?-1022:$441);
 var $y_0_i_i16=$440;var $_0_i_i15=$_1_i_i14;label=142;break;
 case 142: 
 var $_0_i_i15;
 var $y_0_i_i16;
 var $443=((($_0_i_i15)+(1023))|0);
 var $444$0=$443;
 var $444$1=0;
 var $445$0=(0<<20)|(0>>>12);
 var $445$1=($444$0<<20)|(0>>>12);
 var $446=(HEAP32[((tempDoublePtr)>>2)]=$445$0, HEAP32[(((tempDoublePtr)+(4))>>2)]=$445$1, HEAPF64[(tempDoublePtr)>>3]);
 var $447=($y_0_i_i16)*($446);
 var $_0=$447;label=300;break;
 case 143: 
 var $449=HEAP32[(($4)>>2)];
 var $450=($449|0)==0;
 if($450){var $c_6=48;label=145;break;}else{label=144;break;}
 case 144: 
 var $452=HEAP32[(($3)>>2)];
 var $453=((($452)-(1))|0);
 HEAP32[(($3)>>2)]=$453;
 var $c_6=48;label=145;break;
 case 145: 
 var $c_6;
 var $455=$x_i;
 var $$etemp$13$0=512;
 var $$etemp$13$1=0;

 var $sum_i=((($emin_0_ph)+($bits_0_ph))|0);
 var $456=(((-$sum_i))|0);
 var $_011_i=$c_6;var $gotdig_0_i11=0;label=146;break;
 case 146: 
 var $gotdig_0_i11;
 var $_011_i;
 if(($_011_i|0)==48){ label=147;break;}else if(($_011_i|0)==46){ label=150;break;}else{var $_2_i=$_011_i;var $gotrad_0_i13=0;var $gotdig_2_i12=$gotdig_0_i11;var $lrp_1_i$1=0;var $lrp_1_i$0=0;label=158;break;}
 case 147: 
 var $458=HEAP32[(($3)>>2)];
 var $459=HEAP32[(($4)>>2)];
 var $460=($458>>>0)<($459>>>0);
 if($460){label=148;break;}else{label=149;break;}
 case 148: 
 var $462=(($458+1)|0);
 HEAP32[(($3)>>2)]=$462;
 var $463=HEAP8[(($458)>>0)];
 var $464=($463&255);
 var $_011_i=$464;var $gotdig_0_i11=1;label=146;break;
 case 149: 
 var $466=___shgetc($f);
 var $_011_i=$466;var $gotdig_0_i11=1;label=146;break;
 case 150: 
 var $468=HEAP32[(($3)>>2)];
 var $469=HEAP32[(($4)>>2)];
 var $470=($468>>>0)<($469>>>0);
 if($470){label=151;break;}else{label=152;break;}
 case 151: 
 var $472=(($468+1)|0);
 HEAP32[(($3)>>2)]=$472;
 var $473=HEAP8[(($468)>>0)];
 var $474=($473&255);
 var $_1_ph_i=$474;label=153;break;
 case 152: 
 var $476=___shgetc($f);
 var $_1_ph_i=$476;label=153;break;
 case 153: 
 var $_1_ph_i;
 var $477=($_1_ph_i|0)==48;
 if($477){var $lrp_0134_i$1=0;var $lrp_0134_i$0=0;label=154;break;}else{var $_2_i=$_1_ph_i;var $gotrad_0_i13=1;var $gotdig_2_i12=$gotdig_0_i11;var $lrp_1_i$1=0;var $lrp_1_i$0=0;label=158;break;}
 case 154: 
 var $lrp_0134_i$0;
 var $lrp_0134_i$1;
 var $$etemp$14$0=-1;
 var $$etemp$14$1=-1;
 var $478$0=_i64Add($lrp_0134_i$0,$lrp_0134_i$1,$$etemp$14$0,$$etemp$14$1);var $478$1=tempRet0;
 var $479=HEAP32[(($3)>>2)];
 var $480=HEAP32[(($4)>>2)];
 var $481=($479>>>0)<($480>>>0);
 if($481){label=155;break;}else{label=156;break;}
 case 155: 
 var $483=(($479+1)|0);
 HEAP32[(($3)>>2)]=$483;
 var $484=HEAP8[(($479)>>0)];
 var $485=($484&255);
 var $_1_be_i=$485;label=157;break;
 case 156: 
 var $487=___shgetc($f);
 var $_1_be_i=$487;label=157;break;
 case 157: 
 var $_1_be_i;
 var $488=($_1_be_i|0)==48;
 if($488){var $lrp_0134_i$1=$478$1;var $lrp_0134_i$0=$478$0;label=154;break;}else{var $_2_i=$_1_be_i;var $gotrad_0_i13=1;var $gotdig_2_i12=1;var $lrp_1_i$1=$478$1;var $lrp_1_i$0=$478$0;label=158;break;}
 case 158: 
 var $lrp_1_i$0;
 var $lrp_1_i$1;
 var $gotdig_2_i12;
 var $gotrad_0_i13;
 var $_2_i;
 var $489=(($x_i)|0);
 HEAP32[(($489)>>2)]=0;
 var $490=((($_2_i)-(48))|0);
 var $491=($490>>>0)<10;
 var $492=($_2_i|0)==46;
 var $or_cond112_i=$491|$492;
 if($or_cond112_i){label=159;break;}else{var $lrp_2_lcssa_i$1=$lrp_1_i$1;var $lrp_2_lcssa_i$0=$lrp_1_i$0;var $dc_0_lcssa_i$1=0;var $dc_0_lcssa_i$0=0;var $lnz_0_lcssa_i=0;var $gotdig_3_lcssa_i=$gotdig_2_i12;var $gotrad_1_lcssa_i=$gotrad_0_i13;var $k_0_lcssa_i=0;var $j_0_lcssa_i=0;var $_3_lcssa_i=$_2_i;label=173;break;}
 case 159: 
 var $493=(($x_i+496)|0);
 var $lrp_2113_i$1=$lrp_1_i$1;var $lrp_2113_i$0=$lrp_1_i$0;var $dc_0114_i$1=0;var $dc_0114_i$0=0;var $lnz_0115_i=0;var $gotdig_3116_i=$gotdig_2_i12;var $gotrad_1117_i=$gotrad_0_i13;var $k_0118_i=0;var $j_0119_i=0;var $_3120_i=$_2_i;var $496=$490;var $495=$492;label=160;break;
 case 160: 
 var $495;
 var $496;
 var $_3120_i;
 var $j_0119_i;
 var $k_0118_i;
 var $gotrad_1117_i;
 var $gotdig_3116_i;
 var $lnz_0115_i;
 var $dc_0114_i$0;
 var $dc_0114_i$1;
 var $lrp_2113_i$0;
 var $lrp_2113_i$1;
 if($495){label=161;break;}else{label=163;break;}
 case 161: 
 var $cond_i=($gotrad_1117_i|0)==0;
 if($cond_i){var $j_2_i=$j_0119_i;var $k_2_i=$k_0118_i;var $gotrad_2_i=1;var $gotdig_4_i=$gotdig_3116_i;var $lnz_2_i=$lnz_0115_i;var $dc_1_i14$1=$dc_0114_i$1;var $dc_1_i14$0=$dc_0114_i$0;var $lrp_3_i$1=$dc_0114_i$1;var $lrp_3_i$0=$dc_0114_i$0;label=169;break;}else{label=162;break;}
 case 162: 
 var $498=($gotdig_3116_i|0)!=0;
 var $562=$498;var $lrp_42426_i$1=$lrp_2113_i$1;var $lrp_42426_i$0=$lrp_2113_i$0;var $dc_096_i$1=$dc_0114_i$1;var $dc_096_i$0=$dc_0114_i$0;var $lnz_0100_i=$lnz_0115_i;var $k_0106_i=$k_0118_i;var $j_0110_i=$j_0119_i;label=181;break;
 case 163: 
 var $500=($k_0118_i|0)<125;
 var $$etemp$15$0=1;
 var $$etemp$15$1=0;
 var $501$0=_i64Add($dc_0114_i$0,$dc_0114_i$1,$$etemp$15$0,$$etemp$15$1);var $501$1=tempRet0;
 var $502=($_3120_i|0)!=48;
 if($500){label=164;break;}else{label=167;break;}
 case 164: 
 var $504$0=$501$0;
 var $504=$504$0;
 var $_lnz_0_i=($502?$504:$lnz_0115_i);
 var $505=($j_0119_i|0)==0;
 var $506=(($x_i+($k_0118_i<<2))|0);
 if($505){var $storemerge_i=$496;label=166;break;}else{label=165;break;}
 case 165: 
 var $508=HEAP32[(($506)>>2)];
 var $509=((($508)*(10))&-1);
 var $510=((($_3120_i)-(48))|0);
 var $511=((($510)+($509))|0);
 var $storemerge_i=$511;label=166;break;
 case 166: 
 var $storemerge_i;
 HEAP32[(($506)>>2)]=$storemerge_i;
 var $513=((($j_0119_i)+(1))|0);
 var $514=($513|0)==9;
 var $515=($514&1);
 var $_k_0_i=((($515)+($k_0118_i))|0);
 var $_13_i=($514?0:$513);
 var $j_2_i=$_13_i;var $k_2_i=$_k_0_i;var $gotrad_2_i=$gotrad_1117_i;var $gotdig_4_i=1;var $lnz_2_i=$_lnz_0_i;var $dc_1_i14$1=$501$1;var $dc_1_i14$0=$501$0;var $lrp_3_i$1=$lrp_2113_i$1;var $lrp_3_i$0=$lrp_2113_i$0;label=169;break;
 case 167: 
 if($502){label=168;break;}else{var $j_2_i=$j_0119_i;var $k_2_i=$k_0118_i;var $gotrad_2_i=$gotrad_1117_i;var $gotdig_4_i=$gotdig_3116_i;var $lnz_2_i=$lnz_0115_i;var $dc_1_i14$1=$501$1;var $dc_1_i14$0=$501$0;var $lrp_3_i$1=$lrp_2113_i$1;var $lrp_3_i$0=$lrp_2113_i$0;label=169;break;}
 case 168: 
 var $518=HEAP32[(($493)>>2)];
 var $519=$518|1;
 HEAP32[(($493)>>2)]=$519;
 var $j_2_i=$j_0119_i;var $k_2_i=$k_0118_i;var $gotrad_2_i=$gotrad_1117_i;var $gotdig_4_i=$gotdig_3116_i;var $lnz_2_i=$lnz_0115_i;var $dc_1_i14$1=$501$1;var $dc_1_i14$0=$501$0;var $lrp_3_i$1=$lrp_2113_i$1;var $lrp_3_i$0=$lrp_2113_i$0;label=169;break;
 case 169: 
 var $lrp_3_i$0;
 var $lrp_3_i$1;
 var $dc_1_i14$0;
 var $dc_1_i14$1;
 var $lnz_2_i;
 var $gotdig_4_i;
 var $gotrad_2_i;
 var $k_2_i;
 var $j_2_i;
 var $521=HEAP32[(($3)>>2)];
 var $522=HEAP32[(($4)>>2)];
 var $523=($521>>>0)<($522>>>0);
 if($523){label=170;break;}else{label=171;break;}
 case 170: 
 var $525=(($521+1)|0);
 HEAP32[(($3)>>2)]=$525;
 var $526=HEAP8[(($521)>>0)];
 var $527=($526&255);
 var $_3_be_i=$527;label=172;break;
 case 171: 
 var $529=___shgetc($f);
 var $_3_be_i=$529;label=172;break;
 case 172: 
 var $_3_be_i;
 var $530=((($_3_be_i)-(48))|0);
 var $531=($530>>>0)<10;
 var $532=($_3_be_i|0)==46;
 var $or_cond_i15=$531|$532;
 if($or_cond_i15){var $lrp_2113_i$1=$lrp_3_i$1;var $lrp_2113_i$0=$lrp_3_i$0;var $dc_0114_i$1=$dc_1_i14$1;var $dc_0114_i$0=$dc_1_i14$0;var $lnz_0115_i=$lnz_2_i;var $gotdig_3116_i=$gotdig_4_i;var $gotrad_1117_i=$gotrad_2_i;var $k_0118_i=$k_2_i;var $j_0119_i=$j_2_i;var $_3120_i=$_3_be_i;var $496=$530;var $495=$532;label=160;break;}else{var $lrp_2_lcssa_i$1=$lrp_3_i$1;var $lrp_2_lcssa_i$0=$lrp_3_i$0;var $dc_0_lcssa_i$1=$dc_1_i14$1;var $dc_0_lcssa_i$0=$dc_1_i14$0;var $lnz_0_lcssa_i=$lnz_2_i;var $gotdig_3_lcssa_i=$gotdig_4_i;var $gotrad_1_lcssa_i=$gotrad_2_i;var $k_0_lcssa_i=$k_2_i;var $j_0_lcssa_i=$j_2_i;var $_3_lcssa_i=$_3_be_i;label=173;break;}
 case 173: 
 var $_3_lcssa_i;
 var $j_0_lcssa_i;
 var $k_0_lcssa_i;
 var $gotrad_1_lcssa_i;
 var $gotdig_3_lcssa_i;
 var $lnz_0_lcssa_i;
 var $dc_0_lcssa_i$0;
 var $dc_0_lcssa_i$1;
 var $lrp_2_lcssa_i$0;
 var $lrp_2_lcssa_i$1;
 var $533=($gotrad_1_lcssa_i|0)==0;
 var $dc_0_lrp_2_i$0=($533?$dc_0_lcssa_i$0:$lrp_2_lcssa_i$0);
 var $dc_0_lrp_2_i$1=($533?$dc_0_lcssa_i$1:$lrp_2_lcssa_i$1);
 var $534=($gotdig_3_lcssa_i|0)!=0;
 var $535=$_3_lcssa_i|32;
 var $536=($535|0)==101;
 var $or_cond15_i=$534&$536;
 if($or_cond15_i){label=174;break;}else{label=180;break;}
 case 174: 
 var $538$0=_scanexp($f,$pok);
 var $538$1=tempRet0;
 var $$etemp$16$0=0;
 var $$etemp$16$1=-2147483648;
 var $539=(($538$0|0) == ($$etemp$16$0|0)) & (($538$1|0) == ($$etemp$16$1|0));
 if($539){label=175;break;}else{var $e10_0_i$1=$538$1;var $e10_0_i$0=$538$0;label=179;break;}
 case 175: 
 var $541=($pok|0)==0;
 if($541){label=178;break;}else{label=176;break;}
 case 176: 
 var $543=HEAP32[(($4)>>2)];
 var $544=($543|0)==0;
 if($544){var $e10_0_i$1=0;var $e10_0_i$0=0;label=179;break;}else{label=177;break;}
 case 177: 
 var $546=HEAP32[(($3)>>2)];
 var $547=((($546)-(1))|0);
 HEAP32[(($3)>>2)]=$547;
 var $e10_0_i$1=0;var $e10_0_i$0=0;label=179;break;
 case 178: 
 var $549=(($f+104)|0);
 HEAP32[(($549)>>2)]=0;
 var $550=(($f+8)|0);
 var $551=HEAP32[(($550)>>2)];
 var $552=HEAP32[(($3)>>2)];
 var $553=$551;
 var $554=$552;
 var $555=((($553)-($554))|0);
 var $556=(($f+108)|0);
 HEAP32[(($556)>>2)]=$555;
 HEAP32[(($4)>>2)]=$551;
 var $_0=0;label=300;break;
 case 179: 
 var $e10_0_i$0;
 var $e10_0_i$1;
 var $558$0=_i64Add($e10_0_i$0,$e10_0_i$1,$dc_0_lrp_2_i$0,$dc_0_lrp_2_i$1);var $558$1=tempRet0;
 var $lrp_527_i$1=$558$1;var $lrp_527_i$0=$558$0;var $dc_094_i$1=$dc_0_lcssa_i$1;var $dc_094_i$0=$dc_0_lcssa_i$0;var $lnz_098_i=$lnz_0_lcssa_i;var $k_0104_i=$k_0_lcssa_i;var $j_0108_i=$j_0_lcssa_i;label=186;break;
 case 180: 
 var $560=($_3_lcssa_i|0)>-1;
 if($560){var $562=$534;var $lrp_42426_i$1=$dc_0_lrp_2_i$1;var $lrp_42426_i$0=$dc_0_lrp_2_i$0;var $dc_096_i$1=$dc_0_lcssa_i$1;var $dc_096_i$0=$dc_0_lcssa_i$0;var $lnz_0100_i=$lnz_0_lcssa_i;var $k_0106_i=$k_0_lcssa_i;var $j_0110_i=$j_0_lcssa_i;label=181;break;}else{var $lrp_5_i$1=$dc_0_lrp_2_i$1;var $lrp_5_i$0=$dc_0_lrp_2_i$0;var $569=$534;var $dc_095_i$1=$dc_0_lcssa_i$1;var $dc_095_i$0=$dc_0_lcssa_i$0;var $lnz_099_i=$lnz_0_lcssa_i;var $k_0105_i=$k_0_lcssa_i;var $j_0109_i=$j_0_lcssa_i;label=183;break;}
 case 181: 
 var $j_0110_i;
 var $k_0106_i;
 var $lnz_0100_i;
 var $dc_096_i$0;
 var $dc_096_i$1;
 var $lrp_42426_i$0;
 var $lrp_42426_i$1;
 var $562;
 var $563=HEAP32[(($4)>>2)];
 var $564=($563|0)==0;
 if($564){var $lrp_5_i$1=$lrp_42426_i$1;var $lrp_5_i$0=$lrp_42426_i$0;var $569=$562;var $dc_095_i$1=$dc_096_i$1;var $dc_095_i$0=$dc_096_i$0;var $lnz_099_i=$lnz_0100_i;var $k_0105_i=$k_0106_i;var $j_0109_i=$j_0110_i;label=183;break;}else{label=182;break;}
 case 182: 
 var $566=HEAP32[(($3)>>2)];
 var $567=((($566)-(1))|0);
 HEAP32[(($3)>>2)]=$567;
 if($562){var $lrp_527_i$1=$lrp_42426_i$1;var $lrp_527_i$0=$lrp_42426_i$0;var $dc_094_i$1=$dc_096_i$1;var $dc_094_i$0=$dc_096_i$0;var $lnz_098_i=$lnz_0100_i;var $k_0104_i=$k_0106_i;var $j_0108_i=$j_0110_i;label=186;break;}else{var $571=$567;label=185;break;}
 case 183: 
 var $j_0109_i;
 var $k_0105_i;
 var $lnz_099_i;
 var $dc_095_i$0;
 var $dc_095_i$1;
 var $569;
 var $lrp_5_i$0;
 var $lrp_5_i$1;
 if($569){var $lrp_527_i$1=$lrp_5_i$1;var $lrp_527_i$0=$lrp_5_i$0;var $dc_094_i$1=$dc_095_i$1;var $dc_094_i$0=$dc_095_i$0;var $lnz_098_i=$lnz_099_i;var $k_0104_i=$k_0105_i;var $j_0108_i=$j_0109_i;label=186;break;}else{label=184;break;}
 case 184: 
 var $_pre29=HEAP32[(($3)>>2)];
 var $571=$_pre29;label=185;break;
 case 185: 
 var $571;
 var $572=___errno_location();
 HEAP32[(($572)>>2)]=22;
 var $573=(($f+104)|0);
 HEAP32[(($573)>>2)]=0;
 var $574=(($f+8)|0);
 var $575=HEAP32[(($574)>>2)];
 var $576=$575;
 var $577=$571;
 var $578=((($576)-($577))|0);
 var $579=(($f+108)|0);
 HEAP32[(($579)>>2)]=$578;
 HEAP32[(($4)>>2)]=$575;
 var $_0=0;label=300;break;
 case 186: 
 var $j_0108_i;
 var $k_0104_i;
 var $lnz_098_i;
 var $dc_094_i$0;
 var $dc_094_i$1;
 var $lrp_527_i$0;
 var $lrp_527_i$1;
 var $581=HEAP32[(($489)>>2)];
 var $582=($581|0)==0;
 if($582){label=187;break;}else{label=188;break;}
 case 187: 
 var $584=($sign_0|0);
 var $585=($584)*(0);
 var $_0=$585;label=300;break;
 case 188: 
 var $587=(($lrp_527_i$0|0) == ($dc_094_i$0|0)) & (($lrp_527_i$1|0) == ($dc_094_i$1|0));
 var $$etemp$17$0=10;
 var $$etemp$17$1=0;
 var $588=(($dc_094_i$1|0) < ($$etemp$17$1|0)) | (((($dc_094_i$1|0) == ($$etemp$17$1|0) & ($dc_094_i$0>>>0) <  ($$etemp$17$0>>>0))));
 var $or_cond3_i16=$587&$588;
 if($or_cond3_i16){label=189;break;}else{label=191;break;}
 case 189: 
 var $590=($bits_0_ph>>>0)>30;
 var $591=$581>>>($bits_0_ph>>>0);
 var $592=($591|0)==0;
 var $or_cond17_i=$590|$592;
 if($or_cond17_i){label=190;break;}else{label=191;break;}
 case 190: 
 var $594=($sign_0|0);
 var $595=($581>>>0);
 var $596=($594)*($595);
 var $_0=$596;label=300;break;
 case 191: 
 var $598=(((($emin_0_ph|0))/(-2))&-1);
 var $599$0=$598;
 var $599$1=((((($598|0)<0))|0)?-1:0);
 var $600=(($lrp_527_i$1|0) > ($599$1|0)) | (((($lrp_527_i$1|0) == ($599$1|0) & ($lrp_527_i$0>>>0) >  ($599$0>>>0))));
 if($600){label=192;break;}else{label=193;break;}
 case 192: 
 var $602=___errno_location();
 HEAP32[(($602)>>2)]=34;
 var $603=($sign_0|0);
 var $604=($603)*((1.7976931348623157e+308));
 var $605=($604)*((1.7976931348623157e+308));
 var $_0=$605;label=300;break;
 case 193: 
 var $607=((($emin_0_ph)-(106))|0);
 var $608$0=$607;
 var $608$1=((((($607|0)<0))|0)?-1:0);
 var $609=(($lrp_527_i$1|0) < ($608$1|0)) | (((($lrp_527_i$1|0) == ($608$1|0) & ($lrp_527_i$0>>>0) <  ($608$0>>>0))));
 if($609){label=194;break;}else{label=195;break;}
 case 194: 
 var $611=___errno_location();
 HEAP32[(($611)>>2)]=34;
 var $612=($sign_0|0);
 var $613=($612)*((2.2250738585072014e-308));
 var $614=($613)*((2.2250738585072014e-308));
 var $_0=$614;label=300;break;
 case 195: 
 var $616=($j_0108_i|0)==0;
 if($616){var $k_3_i=$k_0104_i;label=201;break;}else{label=196;break;}
 case 196: 
 var $617=($j_0108_i|0)<9;
 if($617){label=197;break;}else{label=200;break;}
 case 197: 
 var $618=(($x_i+($k_0104_i<<2))|0);
 var $_promoted_i=HEAP32[(($618)>>2)];
 var $j_388_i=$j_0108_i;var $620=$_promoted_i;label=198;break;
 case 198: 
 var $620;
 var $j_388_i;
 var $621=((($620)*(10))&-1);
 var $622=((($j_388_i)+(1))|0);
 var $623=($622|0)<9;
 if($623){var $j_388_i=$622;var $620=$621;label=198;break;}else{label=199;break;}
 case 199: 
 HEAP32[(($618)>>2)]=$621;
 label=200;break;
 case 200: 
 var $625=((($k_0104_i)+(1))|0);
 var $k_3_i=$625;label=201;break;
 case 201: 
 var $k_3_i;
 var $627$0=$lrp_527_i$0;
 var $627=$627$0;
 var $628=($lnz_098_i|0)<9;
 if($628){label=202;break;}else{label=209;break;}
 case 202: 
 var $630=($lnz_098_i|0)<=($627|0);
 var $631=($627|0)<18;
 var $or_cond5_i17=$630&$631;
 if($or_cond5_i17){label=203;break;}else{label=209;break;}
 case 203: 
 var $633=($627|0)==9;
 if($633){label=204;break;}else{label=205;break;}
 case 204: 
 var $635=($sign_0|0);
 var $636=HEAP32[(($489)>>2)];
 var $637=($636>>>0);
 var $638=($635)*($637);
 var $_0=$638;label=300;break;
 case 205: 
 var $640=($627|0)<9;
 if($640){label=206;break;}else{label=207;break;}
 case 206: 
 var $642=($sign_0|0);
 var $643=HEAP32[(($489)>>2)];
 var $644=($643>>>0);
 var $645=($642)*($644);
 var $646=(((8)-($627))|0);
 var $647=((896+($646<<2))|0);
 var $648=HEAP32[(($647)>>2)];
 var $649=($648|0);
 var $650=($645)/($649);
 var $_0=$650;label=300;break;
 case 207: 
 var $652=((($627)*(-3))&-1);
 var $_neg37_i=((($bits_0_ph)+(27))|0);
 var $653=((($_neg37_i)+($652))|0);
 var $654=($653|0)>30;
 var $_pre_i18=HEAP32[(($489)>>2)];
 var $655=$_pre_i18>>>($653>>>0);
 var $656=($655|0)==0;
 var $or_cond187_i=$654|$656;
 if($or_cond187_i){label=208;break;}else{label=209;break;}
 case 208: 
 var $657=($sign_0|0);
 var $658=($_pre_i18>>>0);
 var $659=($657)*($658);
 var $660=((($627)-(10))|0);
 var $661=((896+($660<<2))|0);
 var $662=HEAP32[(($661)>>2)];
 var $663=($662|0);
 var $664=($659)*($663);
 var $_0=$664;label=300;break;
 case 209: 
 var $666=(((($627|0))%(9))&-1);
 var $667=($666|0)==0;
 if($667){var $a_2_ph57_i=0;var $z_1_ph56_i=$k_3_i;var $e2_0_ph_i=0;var $rp_2_ph55_i=$627;label=218;break;}else{label=210;break;}
 case 210: 
 var $669=($627|0)>-1;
 var $670=((($666)+(9))|0);
 var $671=($669?$666:$670);
 var $672=(((8)-($671))|0);
 var $673=((896+($672<<2))|0);
 var $674=HEAP32[(($673)>>2)];
 var $675=($k_3_i|0)==0;
 if($675){var $z_0_i=0;var $a_0_lcssa182_i=0;var $rp_0_lcssa183_i=$627;label=217;break;}else{label=211;break;}
 case 211: 
 var $676=(((1000000000)/(($674|0)))&-1);
 var $rp_077_i=$627;var $a_078_i=0;var $k_479_i=0;var $carry_080_i=0;label=212;break;
 case 212: 
 var $carry_080_i;
 var $k_479_i;
 var $a_078_i;
 var $rp_077_i;
 var $678=(($x_i+($k_479_i<<2))|0);
 var $679=HEAP32[(($678)>>2)];
 var $680=(((($679>>>0))%(($674>>>0)))&-1);
 var $681=(((($679>>>0))/(($674>>>0)))&-1);
 var $682=((($681)+($carry_080_i))|0);
 HEAP32[(($678)>>2)]=$682;
 var $683=(Math_imul($680,$676)|0);
 var $684=($k_479_i|0)==($a_078_i|0);
 var $685=($682|0)==0;
 var $or_cond18_i=$684&$685;
 var $686=((($k_479_i)+(1))|0);
 if($or_cond18_i){label=213;break;}else{var $a_1_i=$a_078_i;var $rp_1_i19=$rp_077_i;label=214;break;}
 case 213: 
 var $688=$686&127;
 var $689=((($rp_077_i)-(9))|0);
 var $a_1_i=$688;var $rp_1_i19=$689;label=214;break;
 case 214: 
 var $rp_1_i19;
 var $a_1_i;
 var $690=($686|0)==($k_3_i|0);
 if($690){label=215;break;}else{var $rp_077_i=$rp_1_i19;var $a_078_i=$a_1_i;var $k_479_i=$686;var $carry_080_i=$683;label=212;break;}
 case 215: 
 var $691=($683|0)==0;
 if($691){var $z_0_i=$k_3_i;var $a_0_lcssa182_i=$a_1_i;var $rp_0_lcssa183_i=$rp_1_i19;label=217;break;}else{label=216;break;}
 case 216: 
 var $693=((($k_3_i)+(1))|0);
 var $694=(($x_i+($k_3_i<<2))|0);
 HEAP32[(($694)>>2)]=$683;
 var $z_0_i=$693;var $a_0_lcssa182_i=$a_1_i;var $rp_0_lcssa183_i=$rp_1_i19;label=217;break;
 case 217: 
 var $rp_0_lcssa183_i;
 var $a_0_lcssa182_i;
 var $z_0_i;
 var $695=(((9)-($671))|0);
 var $696=((($695)+($rp_0_lcssa183_i))|0);
 var $a_2_ph57_i=$a_0_lcssa182_i;var $z_1_ph56_i=$z_0_i;var $e2_0_ph_i=0;var $rp_2_ph55_i=$696;label=218;break;
 case 218: 
 var $rp_2_ph55_i;
 var $e2_0_ph_i;
 var $z_1_ph56_i;
 var $a_2_ph57_i;
 var $697=($rp_2_ph55_i|0)<18;
 var $698=(($x_i+($a_2_ph57_i<<2))|0);
 if($697){var $z_1_us_i=$z_1_ph56_i;var $e2_0_us_i=$e2_0_ph_i;label=220;break;}else{label=219;break;}
 case 219: 
 var $699=($rp_2_ph55_i|0)==18;
 if($699){var $z_1_us62_i=$z_1_ph56_i;var $e2_0_us61_i=$e2_0_ph_i;label=227;break;}else{var $a_3_ph_i=$a_2_ph57_i;var $z_5_ph_i=$z_1_ph56_i;var $e2_1_ph_i=$e2_0_ph_i;var $rp_3_ph50_i=$rp_2_ph55_i;label=251;break;}
 case 220: 
 var $e2_0_us_i;
 var $z_1_us_i;
 var $700=((($z_1_us_i)+(127))|0);
 var $carry1_0_us_i=0;var $k_5_in_us_i=$700;var $z_2_us_i=$z_1_us_i;label=221;break;
 case 221: 
 var $z_2_us_i;
 var $k_5_in_us_i;
 var $carry1_0_us_i;
 var $k_5_us_i=$k_5_in_us_i&127;
 var $702=(($x_i+($k_5_us_i<<2))|0);
 var $703=HEAP32[(($702)>>2)];
 var $704$0=$703;
 var $704$1=0;
 var $705$0=($704$0<<29)|(0>>>3);
 var $705$1=($704$1<<29)|($704$0>>>3);
 var $706$0=$carry1_0_us_i;
 var $706$1=0;
 var $707$0=_i64Add($705$0,$705$1,$706$0,$706$1);var $707$1=tempRet0;
 var $$etemp$18$0=1000000000;
 var $$etemp$18$1=0;
 var $708=(($707$1>>>0) > ($$etemp$18$1>>>0)) | (((($707$1>>>0) == ($$etemp$18$1>>>0) & ($707$0>>>0) >  ($$etemp$18$0>>>0))));
 var $extract_t36_us_i$0=$707$0;
 var $extract_t36_us_i=$extract_t36_us_i$0;
 if($708){label=222;break;}else{var $carry1_1_us_i=0;var $_sink_off0_us_i=$extract_t36_us_i;label=223;break;}
 case 222: 
 var $$etemp$19$0=1000000000;
 var $$etemp$19$1=0;
 var $710$0=___udivdi3($707$0,$707$1,$$etemp$19$0,$$etemp$19$1);var $710$1=tempRet0;
 var $711$0=$710$0;
 var $711=$711$0;
 var $$etemp$20$0=1000000000;
 var $$etemp$20$1=0;
 var $712$0=___uremdi3($707$0,$707$1,$$etemp$20$0,$$etemp$20$1);var $712$1=tempRet0;
 var $extract_t_us_i$0=$712$0;
 var $extract_t_us_i=$extract_t_us_i$0;
 var $carry1_1_us_i=$711;var $_sink_off0_us_i=$extract_t_us_i;label=223;break;
 case 223: 
 var $_sink_off0_us_i;
 var $carry1_1_us_i;
 HEAP32[(($702)>>2)]=$_sink_off0_us_i;
 var $714=((($z_2_us_i)+(127))|0);
 var $715=$714&127;
 var $716=($k_5_us_i|0)!=($715|0);
 var $717=($k_5_us_i|0)==($a_2_ph57_i|0);
 var $or_cond19_us_i=$716|$717;
 if($or_cond19_us_i){var $z_3_us_i=$z_2_us_i;label=225;break;}else{label=224;break;}
 case 224: 
 var $719=($_sink_off0_us_i|0)==0;
 var $k_5_z_2_us_i=($719?$k_5_us_i:$z_2_us_i);
 var $z_3_us_i=$k_5_z_2_us_i;label=225;break;
 case 225: 
 var $z_3_us_i;
 var $721=((($k_5_us_i)-(1))|0);
 if($717){label=226;break;}else{var $carry1_0_us_i=$carry1_1_us_i;var $k_5_in_us_i=$721;var $z_2_us_i=$z_3_us_i;label=221;break;}
 case 226: 
 var $723=((($e2_0_us_i)-(29))|0);
 var $724=($carry1_1_us_i|0)==0;
 if($724){var $z_1_us_i=$z_3_us_i;var $e2_0_us_i=$723;label=220;break;}else{var $_lcssa60_i=$723;var $z_3_lcssa_lcssa_i=$z_3_us_i;var $carry1_1_lcssa_lcssa_i=$carry1_1_us_i;label=235;break;}
 case 227: 
 var $e2_0_us61_i;
 var $z_1_us62_i;
 var $725=HEAP32[(($698)>>2)];
 var $726=($725>>>0)<9007199;
 if($726){label=228;break;}else{var $a_3_ph_i=$a_2_ph57_i;var $z_5_ph_i=$z_1_us62_i;var $e2_1_ph_i=$e2_0_us61_i;var $rp_3_ph50_i=18;label=251;break;}
 case 228: 
 var $727=((($z_1_us62_i)+(127))|0);
 var $carry1_0_us66_i=0;var $k_5_in_us65_i=$727;var $z_2_us64_i=$z_1_us62_i;label=229;break;
 case 229: 
 var $z_2_us64_i;
 var $k_5_in_us65_i;
 var $carry1_0_us66_i;
 var $k_5_us67_i=$k_5_in_us65_i&127;
 var $729=(($x_i+($k_5_us67_i<<2))|0);
 var $730=HEAP32[(($729)>>2)];
 var $731$0=$730;
 var $731$1=0;
 var $732$0=($731$0<<29)|(0>>>3);
 var $732$1=($731$1<<29)|($731$0>>>3);
 var $733$0=$carry1_0_us66_i;
 var $733$1=0;
 var $734$0=_i64Add($732$0,$732$1,$733$0,$733$1);var $734$1=tempRet0;
 var $$etemp$21$0=1000000000;
 var $$etemp$21$1=0;
 var $735=(($734$1>>>0) > ($$etemp$21$1>>>0)) | (((($734$1>>>0) == ($$etemp$21$1>>>0) & ($734$0>>>0) >  ($$etemp$21$0>>>0))));
 var $extract_t36_us68_i$0=$734$0;
 var $extract_t36_us68_i=$extract_t36_us68_i$0;
 if($735){label=230;break;}else{var $carry1_1_us71_i=0;var $_sink_off0_us70_i=$extract_t36_us68_i;label=231;break;}
 case 230: 
 var $$etemp$22$0=1000000000;
 var $$etemp$22$1=0;
 var $737$0=___udivdi3($734$0,$734$1,$$etemp$22$0,$$etemp$22$1);var $737$1=tempRet0;
 var $738$0=$737$0;
 var $738=$738$0;
 var $$etemp$23$0=1000000000;
 var $$etemp$23$1=0;
 var $739$0=___uremdi3($734$0,$734$1,$$etemp$23$0,$$etemp$23$1);var $739$1=tempRet0;
 var $extract_t_us69_i$0=$739$0;
 var $extract_t_us69_i=$extract_t_us69_i$0;
 var $carry1_1_us71_i=$738;var $_sink_off0_us70_i=$extract_t_us69_i;label=231;break;
 case 231: 
 var $_sink_off0_us70_i;
 var $carry1_1_us71_i;
 HEAP32[(($729)>>2)]=$_sink_off0_us70_i;
 var $741=((($z_2_us64_i)+(127))|0);
 var $742=$741&127;
 var $743=($k_5_us67_i|0)!=($742|0);
 var $744=($k_5_us67_i|0)==($a_2_ph57_i|0);
 var $or_cond19_us72_i=$743|$744;
 if($or_cond19_us72_i){var $z_3_us74_i=$z_2_us64_i;label=233;break;}else{label=232;break;}
 case 232: 
 var $746=($_sink_off0_us70_i|0)==0;
 var $k_5_z_2_us73_i=($746?$k_5_us67_i:$z_2_us64_i);
 var $z_3_us74_i=$k_5_z_2_us73_i;label=233;break;
 case 233: 
 var $z_3_us74_i;
 var $748=((($k_5_us67_i)-(1))|0);
 if($744){label=234;break;}else{var $carry1_0_us66_i=$carry1_1_us71_i;var $k_5_in_us65_i=$748;var $z_2_us64_i=$z_3_us74_i;label=229;break;}
 case 234: 
 var $750=((($e2_0_us61_i)-(29))|0);
 var $751=($carry1_1_us71_i|0)==0;
 if($751){var $z_1_us62_i=$z_3_us74_i;var $e2_0_us61_i=$750;label=227;break;}else{var $_lcssa60_i=$750;var $z_3_lcssa_lcssa_i=$z_3_us74_i;var $carry1_1_lcssa_lcssa_i=$carry1_1_us71_i;label=235;break;}
 case 235: 
 var $carry1_1_lcssa_lcssa_i;
 var $z_3_lcssa_lcssa_i;
 var $_lcssa60_i;
 var $752=((($rp_2_ph55_i)+(9))|0);
 var $753=((($a_2_ph57_i)+(127))|0);
 var $754=$753&127;
 var $755=($754|0)==($z_3_lcssa_lcssa_i|0);
 if($755){label=236;break;}else{var $z_4_i=$z_3_lcssa_lcssa_i;label=237;break;}
 case 236: 
 var $757=((($z_3_lcssa_lcssa_i)+(127))|0);
 var $758=$757&127;
 var $759=(($x_i+($758<<2))|0);
 var $760=HEAP32[(($759)>>2)];
 var $761=((($z_3_lcssa_lcssa_i)+(126))|0);
 var $762=$761&127;
 var $763=(($x_i+($762<<2))|0);
 var $764=HEAP32[(($763)>>2)];
 var $765=$764|$760;
 HEAP32[(($763)>>2)]=$765;
 var $z_4_i=$758;label=237;break;
 case 237: 
 var $z_4_i;
 var $767=(($x_i+($754<<2))|0);
 HEAP32[(($767)>>2)]=$carry1_1_lcssa_lcssa_i;
 var $a_2_ph57_i=$754;var $z_1_ph56_i=$z_4_i;var $e2_0_ph_i=$_lcssa60_i;var $rp_2_ph55_i=$752;label=218;break;
 case 238: 
 var $e2_1_i;
 var $a_3_i;
 var $i_042_i=0;label=240;break;
 case 239: 
 var $769=($782|0)<2;
 if($769){var $i_042_i=$782;label=240;break;}else{var $i_1_i=$782;label=243;break;}
 case 240: 
 var $i_042_i;
 var $771=((($i_042_i)+($a_3_i))|0);
 var $772=$771&127;
 var $773=($772|0)==($z_5_ph_i|0);
 if($773){var $i_1_i=2;label=243;break;}else{label=241;break;}
 case 241: 
 var $775=(($x_i+($772<<2))|0);
 var $776=HEAP32[(($775)>>2)];
 var $777=((888+($i_042_i<<2))|0);
 var $778=HEAP32[(($777)>>2)];
 var $779=($776>>>0)<($778>>>0);
 if($779){var $i_1_i=2;label=243;break;}else{label=242;break;}
 case 242: 
 var $781=($776>>>0)>($778>>>0);
 var $782=((($i_042_i)+(1))|0);
 if($781){var $i_1_i=$i_042_i;label=243;break;}else{label=239;break;}
 case 243: 
 var $i_1_i;
 var $784=($i_1_i|0)==2;
 var $or_cond8_i20=$784&$815;
 if($or_cond8_i20){label=244;break;}else{label=245;break;}
 case 244: 
 var $785=$a_3_i&127;
 var $786=($785|0)==($z_5_ph_i|0);
 if($786){label=254;break;}else{var $z_7_i=$z_5_ph_i;label=255;break;}
 case 245: 
 var $788=((($_20_i)+($e2_1_i))|0);
 var $789=($a_3_i|0)==($z_5_ph_i|0);
 if($789){var $a_3_i=$z_5_ph_i;var $e2_1_i=$788;label=238;break;}else{label=246;break;}
 case 246: 
 var $790=1<<$_20_i;
 var $791=((($790)-(1))|0);
 var $792=1000000000>>>($_20_i>>>0);
 var $rp_443_i=$rp_3_i_ph;var $a_444_i=$a_3_i;var $k_645_i=$a_3_i;var $carry3_047_i=0;label=247;break;
 case 247: 
 var $carry3_047_i;
 var $k_645_i;
 var $a_444_i;
 var $rp_443_i;
 var $793=(($x_i+($k_645_i<<2))|0);
 var $794=HEAP32[(($793)>>2)];
 var $795=$794&$791;
 var $796=$794>>>($_20_i>>>0);
 var $797=((($796)+($carry3_047_i))|0);
 HEAP32[(($793)>>2)]=$797;
 var $798=(Math_imul($795,$792)|0);
 var $799=($k_645_i|0)==($a_444_i|0);
 var $800=($797|0)==0;
 var $or_cond21_i=$799&$800;
 var $801=((($k_645_i)+(1))|0);
 var $802=$801&127;
 var $803=((($rp_443_i)-(9))|0);
 var $rp_5_i=($or_cond21_i?$803:$rp_443_i);
 var $a_5_i=($or_cond21_i?$802:$a_444_i);
 var $804=($802|0)==($z_5_ph_i|0);
 if($804){label=248;break;}else{var $rp_443_i=$rp_5_i;var $a_444_i=$a_5_i;var $k_645_i=$802;var $carry3_047_i=$798;label=247;break;}
 case 248: 
 var $805=($798|0)==0;
 if($805){var $a_3_i_ph=$a_5_i;var $e2_1_i_ph=$788;var $rp_3_i_ph=$rp_5_i;label=252;break;}else{label=249;break;}
 case 249: 
 var $807=($811|0)==($a_5_i|0);
 if($807){label=253;break;}else{label=250;break;}
 case 250: 
 var $809=(($x_i+($z_5_ph_i<<2))|0);
 HEAP32[(($809)>>2)]=$798;
 var $a_3_ph_i=$a_5_i;var $z_5_ph_i=$811;var $e2_1_ph_i=$788;var $rp_3_ph50_i=$rp_5_i;label=251;break;
 case 251: 
 var $rp_3_ph50_i;
 var $e2_1_ph_i;
 var $z_5_ph_i;
 var $a_3_ph_i;
 var $810=((($z_5_ph_i)+(1))|0);
 var $811=$810&127;
 var $812=((($z_5_ph_i)+(127))|0);
 var $813=$812&127;
 var $814=(($x_i+($813<<2))|0);
 var $a_3_i_ph=$a_3_ph_i;var $e2_1_i_ph=$e2_1_ph_i;var $rp_3_i_ph=$rp_3_ph50_i;label=252;break;
 case 252: 
 var $rp_3_i_ph;
 var $e2_1_i_ph;
 var $a_3_i_ph;
 var $815=($rp_3_i_ph|0)==18;
 var $816=($rp_3_i_ph|0)>27;
 var $_20_i=($816?9:1);
 var $a_3_i=$a_3_i_ph;var $e2_1_i=$e2_1_i_ph;label=238;break;
 case 253: 
 var $818=HEAP32[(($814)>>2)];
 var $819=$818|1;
 HEAP32[(($814)>>2)]=$819;
 var $a_3_i_ph=$a_5_i;var $e2_1_i_ph=$788;var $rp_3_i_ph=$rp_5_i;label=252;break;
 case 254: 
 var $821=((($811)-(1))|0);
 var $822=(($x_i+($821<<2))|0);
 HEAP32[(($822)>>2)]=0;
 var $z_7_i=$811;label=255;break;
 case 255: 
 var $z_7_i;
 var $824=(($x_i+($785<<2))|0);
 var $825=HEAP32[(($824)>>2)];
 var $826=($825>>>0);
 var $827=((($a_3_i)+(1))|0);
 var $828=$827&127;
 var $829=($828|0)==($z_7_i|0);
 if($829){label=297;break;}else{var $z_7_1_i=$z_7_i;label=298;break;}
 case 256: 
 var $831=($986|0)<0;
 if($831){var $denormal_030_i=1;var $_01231_i=0;label=258;break;}else{var $_012_i=$986;var $denormal_0_i=1;label=257;break;}
 case 257: 
 var $denormal_0_i;
 var $_012_i;
 var $833=($_012_i|0)<53;
 if($833){var $denormal_030_i=$denormal_0_i;var $_01231_i=$_012_i;label=258;break;}else{var $bias_0_i25=0;var $frac_0_i=0;var $y_1_i24=$984;var $denormal_029_i=$denormal_0_i;var $_01232_i=$_012_i;label=271;break;}
 case 258: 
 var $_01231_i;
 var $denormal_030_i;
 var $834=(((105)-($_01231_i))|0);
 var $835=($834|0)>1023;
 if($835){label=259;break;}else{label=261;break;}
 case 259: 
 var $837=((($834)-(1023))|0);
 var $838=($837|0)>1023;
 if($838){label=260;break;}else{var $y_0_i6=8.98846567431158e+307;var $_0_i5=$837;label=264;break;}
 case 260: 
 var $840=((($834)-(2046))|0);
 var $841=($840|0)>1023;
 var $__i3=($841?1023:$840);
 var $y_0_i6=Infinity;var $_0_i5=$__i3;label=264;break;
 case 261: 
 var $843=($834|0)<-1022;
 if($843){label=262;break;}else{var $y_0_i6=1;var $_0_i5=$834;label=264;break;}
 case 262: 
 var $845=((($834)+(1022))|0);
 var $846=($845|0)<-1022;
 if($846){label=263;break;}else{var $y_0_i6=2.2250738585072014e-308;var $_0_i5=$845;label=264;break;}
 case 263: 
 var $848=((($834)+(2044))|0);
 var $849=($848|0)<-1022;
 var $_1_i4=($849?-1022:$848);
 var $y_0_i6=0;var $_0_i5=$_1_i4;label=264;break;
 case 264: 
 var $_0_i5;
 var $y_0_i6;
 var $850=((($_0_i5)+(1023))|0);
 var $851$0=$850;
 var $851$1=0;
 var $852$0=(0<<20)|(0>>>12);
 var $852$1=($851$0<<20)|(0>>>12);
 var $853=(HEAP32[((tempDoublePtr)>>2)]=$852$0, HEAP32[(((tempDoublePtr)+(4))>>2)]=$852$1, HEAPF64[(tempDoublePtr)>>3]);
 var $854=($y_0_i6)*($853);
 HEAPF64[(tempDoublePtr)>>3]=$854; var $855$0=HEAP32[((tempDoublePtr)>>2)];var $855$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 HEAPF64[(tempDoublePtr)>>3]=$984; var $856$0=HEAP32[((tempDoublePtr)>>2)];var $856$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 var $$etemp$24$0=-1;
 var $$etemp$24$1=2147483647;
 var $857$0=$855$0&$$etemp$24$0;
 var $857$1=$855$1&$$etemp$24$1;
 var $$etemp$25$0=0;
 var $$etemp$25$1=-2147483648;
 var $858$0=$856$0&$$etemp$25$0;
 var $858$1=$856$1&$$etemp$25$1;
 var $859$0=$858$0|$857$0;
 var $859$1=$858$1|$857$1;
 var $860=(HEAP32[((tempDoublePtr)>>2)]=$859$0, HEAP32[(((tempDoublePtr)+(4))>>2)]=$859$1, HEAPF64[(tempDoublePtr)>>3]);
 var $861=(((53)-($_01231_i))|0);
 var $862=($861|0)>1023;
 if($862){label=265;break;}else{label=267;break;}
 case 265: 
 var $864=((($861)-(1023))|0);
 var $865=($864|0)>1023;
 if($865){label=266;break;}else{var $y_0_i2=8.98846567431158e+307;var $_0_i=$864;label=270;break;}
 case 266: 
 var $867=((($861)-(2046))|0);
 var $868=($867|0)>1023;
 var $__i1=($868?1023:$867);
 var $y_0_i2=Infinity;var $_0_i=$__i1;label=270;break;
 case 267: 
 var $870=($861|0)<-1022;
 if($870){label=268;break;}else{var $y_0_i2=1;var $_0_i=$861;label=270;break;}
 case 268: 
 var $872=((($861)+(1022))|0);
 var $873=($872|0)<-1022;
 if($873){label=269;break;}else{var $y_0_i2=2.2250738585072014e-308;var $_0_i=$872;label=270;break;}
 case 269: 
 var $875=((($861)+(2044))|0);
 var $876=($875|0)<-1022;
 var $_1_i=($876?-1022:$875);
 var $y_0_i2=0;var $_0_i=$_1_i;label=270;break;
 case 270: 
 var $_0_i;
 var $y_0_i2;
 var $877=((($_0_i)+(1023))|0);
 var $878$0=$877;
 var $878$1=0;
 var $879$0=(0<<20)|(0>>>12);
 var $879$1=($878$0<<20)|(0>>>12);
 var $880=(HEAP32[((tempDoublePtr)>>2)]=$879$0, HEAP32[(((tempDoublePtr)+(4))>>2)]=$879$1, HEAPF64[(tempDoublePtr)>>3]);
 var $881=($y_0_i2)*($880);
 var $882=_fmodl($984,$881);
 var $883=($984)-($882);
 var $884=($860)+($883);
 var $bias_0_i25=$860;var $frac_0_i=$882;var $y_1_i24=$884;var $denormal_029_i=$denormal_030_i;var $_01232_i=$_01231_i;label=271;break;
 case 271: 
 var $_01232_i;
 var $denormal_029_i;
 var $y_1_i24;
 var $frac_0_i;
 var $bias_0_i25;
 var $886=((($a_3_i)+(2))|0);
 var $887=$886&127;
 var $888=($887|0)==($z_7_1_i|0);
 if($888){var $frac_2_i=$frac_0_i;label=284;break;}else{label=272;break;}
 case 272: 
 var $890=(($x_i+($887<<2))|0);
 var $891=HEAP32[(($890)>>2)];
 var $892=($891>>>0)<500000000;
 if($892){label=273;break;}else{label=276;break;}
 case 273: 
 var $894=($891|0)==0;
 if($894){label=274;break;}else{label=275;break;}
 case 274: 
 var $896=((($a_3_i)+(3))|0);
 var $897=$896&127;
 var $898=($897|0)==($z_7_1_i|0);
 if($898){var $frac_1_i=$frac_0_i;label=281;break;}else{label=275;break;}
 case 275: 
 var $900=($983)*((0.25));
 var $901=($900)+($frac_0_i);
 var $frac_1_i=$901;label=281;break;
 case 276: 
 var $903=($891>>>0)>500000000;
 if($903){label=277;break;}else{label=278;break;}
 case 277: 
 var $905=($983)*((0.75));
 var $906=($905)+($frac_0_i);
 var $frac_1_i=$906;label=281;break;
 case 278: 
 var $908=((($a_3_i)+(3))|0);
 var $909=$908&127;
 var $910=($909|0)==($z_7_1_i|0);
 if($910){label=279;break;}else{label=280;break;}
 case 279: 
 var $912=($983)*((0.5));
 var $913=($912)+($frac_0_i);
 var $frac_1_i=$913;label=281;break;
 case 280: 
 var $915=($983)*((0.75));
 var $916=($915)+($frac_0_i);
 var $frac_1_i=$916;label=281;break;
 case 281: 
 var $frac_1_i;
 var $918=(((53)-($_01232_i))|0);
 var $919=($918|0)>1;
 if($919){label=282;break;}else{var $frac_2_i=$frac_1_i;label=284;break;}
 case 282: 
 var $921=_fmodl($frac_1_i,1);
 var $922=$921!=0;
 if($922){var $frac_2_i=$frac_1_i;label=284;break;}else{label=283;break;}
 case 283: 
 var $924=($frac_1_i)+(1);
 var $frac_2_i=$924;label=284;break;
 case 284: 
 var $frac_2_i;
 var $926=($y_1_i24)+($frac_2_i);
 var $927=($926)-($bias_0_i25);
 var $928=$985&2147483647;
 var $929=(((-2)-($sum_i))|0);
 var $930=($928|0)>($929|0);
 if($930){label=285;break;}else{var $y_3_i=$927;var $e2_3_i=$e2_1_i;label=290;break;}
 case 285: 
 var $932=Math_abs($927);
 var $933=$932<9007199254740992;
 if($933){var $y_2_i26=$927;var $denormal_2_i=$denormal_029_i;var $e2_2_i=$e2_1_i;label=287;break;}else{label=286;break;}
 case 286: 
 var $935=($denormal_029_i|0)!=0;
 var $936=($_01232_i|0)==($986|0);
 var $or_cond22_i=$935&$936;
 var $denormal_1_i=($or_cond22_i?0:$denormal_029_i);
 var $937=($927)*((0.5));
 var $938=((($e2_1_i)+(1))|0);
 var $y_2_i26=$937;var $denormal_2_i=$denormal_1_i;var $e2_2_i=$938;label=287;break;
 case 287: 
 var $e2_2_i;
 var $denormal_2_i;
 var $y_2_i26;
 var $940=((($e2_2_i)+(50))|0);
 var $941=($940|0)>($456|0);
 if($941){label=289;break;}else{label=288;break;}
 case 288: 
 var $943=($denormal_2_i|0)!=0;
 var $944=$frac_2_i!=0;
 var $or_cond10_i=$943&$944;
 if($or_cond10_i){label=289;break;}else{var $y_3_i=$y_2_i26;var $e2_3_i=$e2_2_i;label=290;break;}
 case 289: 
 var $946=___errno_location();
 HEAP32[(($946)>>2)]=34;
 var $y_3_i=$y_2_i26;var $e2_3_i=$e2_2_i;label=290;break;
 case 290: 
 var $e2_3_i;
 var $y_3_i;
 var $948=($e2_3_i|0)>1023;
 if($948){label=291;break;}else{label=293;break;}
 case 291: 
 var $950=($y_3_i)*((8.98846567431158e+307));
 var $951=((($e2_3_i)-(1023))|0);
 var $952=($951|0)>1023;
 if($952){label=292;break;}else{var $y_0_i_i=$950;var $_0_i_i=$951;label=296;break;}
 case 292: 
 var $954=($950)*((8.98846567431158e+307));
 var $955=((($e2_3_i)-(2046))|0);
 var $956=($955|0)>1023;
 var $__i_i=($956?1023:$955);
 var $y_0_i_i=$954;var $_0_i_i=$__i_i;label=296;break;
 case 293: 
 var $958=($e2_3_i|0)<-1022;
 if($958){label=294;break;}else{var $y_0_i_i=$y_3_i;var $_0_i_i=$e2_3_i;label=296;break;}
 case 294: 
 var $960=($y_3_i)*((2.2250738585072014e-308));
 var $961=((($e2_3_i)+(1022))|0);
 var $962=($961|0)<-1022;
 if($962){label=295;break;}else{var $y_0_i_i=$960;var $_0_i_i=$961;label=296;break;}
 case 295: 
 var $964=($960)*((2.2250738585072014e-308));
 var $965=((($e2_3_i)+(2044))|0);
 var $966=($965|0)<-1022;
 var $_1_i_i=($966?-1022:$965);
 var $y_0_i_i=$964;var $_0_i_i=$_1_i_i;label=296;break;
 case 296: 
 var $_0_i_i;
 var $y_0_i_i;
 var $967=((($_0_i_i)+(1023))|0);
 var $968$0=$967;
 var $968$1=0;
 var $969$0=(0<<20)|(0>>>12);
 var $969$1=($968$0<<20)|(0>>>12);
 var $970=(HEAP32[((tempDoublePtr)>>2)]=$969$0, HEAP32[(((tempDoublePtr)+(4))>>2)]=$969$1, HEAPF64[(tempDoublePtr)>>3]);
 var $971=($y_0_i_i)*($970);
 var $_0=$971;label=300;break;
 case 297: 
 var $973=((($z_7_i)+(1))|0);
 var $974=$973&127;
 var $975=((($974)-(1))|0);
 var $976=(($x_i+($975<<2))|0);
 HEAP32[(($976)>>2)]=0;
 var $z_7_1_i=$974;label=298;break;
 case 298: 
 var $z_7_1_i;
 var $978=($826)*(1000000000);
 var $979=(($x_i+($828<<2))|0);
 var $980=HEAP32[(($979)>>2)];
 var $981=($980>>>0);
 var $982=($978)+($981);
 var $983=($sign_0|0);
 var $984=($983)*($982);
 var $985=((($e2_1_i)+(53))|0);
 var $986=((($985)-($emin_0_ph))|0);
 var $987=($986|0)<($bits_0_ph|0);
 if($987){label=256;break;}else{var $_012_i=$bits_0_ph;var $denormal_0_i=0;label=257;break;}
 case 299: 
 HEAP32[(($3)>>2)]=$152;
 var $_0=NaN;label=300;break;
 case 300: 
 var $_0;
 STACKTOP=sp;return $_0;
  default: assert(0, "bad label: " + label);
 }

}

//Func
function ___shgetc($f){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=(($f+104)|0);
 var $2=HEAP32[(($1)>>2)];
 var $3=($2|0)==0;
 if($3){label=3;break;}else{label=2;break;}
 case 2: 
 var $5=(($f+108)|0);
 var $6=HEAP32[(($5)>>2)];
 var $7=($6|0)<($2|0);
 if($7){label=3;break;}else{label=4;break;}
 case 3: 
 var $9=$f;
 var $10=___uflow($9);
 var $11=($10|0)<0;
 if($11){label=4;break;}else{label=5;break;}
 case 4: 
 var $13=(($f+100)|0);
 HEAP32[(($13)>>2)]=0;
 var $_0=-1;label=13;break;
 case 5: 
 var $15=HEAP32[(($1)>>2)];
 var $16=($15|0)==0;
 var $_phi_trans_insert=(($f+8)|0);
 var $_pre=HEAP32[(($_phi_trans_insert)>>2)];
 var $_phi_trans_insert2_phi_trans_insert_phi_trans_insert=(($f+4)|0);
 var $_pre3_pre_pre=HEAP32[(($_phi_trans_insert2_phi_trans_insert_phi_trans_insert)>>2)];
 if($16){var $_pre3_pre=$_pre3_pre_pre;label=8;break;}else{label=6;break;}
 case 6: 
 var $18=$_pre;
 var $19=$_pre3_pre_pre;
 var $20=((($18)-($19))|0);
 var $21=(($f+108)|0);
 var $22=HEAP32[(($21)>>2)];
 var $23=((($15)-($22))|0);
 var $24=((($23)-(1))|0);
 var $25=($20|0)>($24|0);
 if($25){label=7;break;}else{var $_pre3_pre=$_pre3_pre_pre;label=8;break;}
 case 7: 
 var $27=(($_pre3_pre_pre+$24)|0);
 var $28=(($f+100)|0);
 HEAP32[(($28)>>2)]=$27;
 var $_pre3=$_pre3_pre_pre;label=9;break;
 case 8: 
 var $_pre3_pre;
 var $29=(($f+100)|0);
 HEAP32[(($29)>>2)]=$_pre;
 var $_pre3=$_pre3_pre;label=9;break;
 case 9: 
 var $_pre3;
 var $31=($_pre|0)==0;
 if($31){label=11;break;}else{label=10;break;}
 case 10: 
 var $33=$_pre;
 var $34=$_pre3;
 var $35=(($f+108)|0);
 var $36=HEAP32[(($35)>>2)];
 var $37=((($33)+(1))|0);
 var $38=((($37)-($34))|0);
 var $39=((($38)+($36))|0);
 HEAP32[(($35)>>2)]=$39;
 label=11;break;
 case 11: 
 var $40=((($_pre3)-(1))|0);
 var $41=HEAP8[(($40)>>0)];
 var $42=($41&255);
 var $43=($42|0)==($10|0);
 if($43){var $_0=$10;label=13;break;}else{label=12;break;}
 case 12: 
 var $45=(($10)&255);
 HEAP8[(($40)>>0)]=$45;
 var $_0=$10;label=13;break;
 case 13: 
 var $_0;
 return $_0;
  default: assert(0, "bad label: " + label);
 }

}

//Func
function _fmodl($x,$y){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 HEAPF64[(tempDoublePtr)>>3]=$x; var $1$0=HEAP32[((tempDoublePtr)>>2)];var $1$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 HEAPF64[(tempDoublePtr)>>3]=$y; var $2$0=HEAP32[((tempDoublePtr)>>2)];var $2$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 var $3$0=($1$1>>>20)|(0<<12);
 var $3$1=(0>>>20)|(0<<12);
 var $_tr_i$0=$3$0;
 var $_tr_i=$_tr_i$0;
 var $4=$_tr_i&2047;
 var $5$0=($2$1>>>20)|(0<<12);
 var $5$1=(0>>>20)|(0<<12);
 var $_tr2_i$0=$5$0;
 var $_tr2_i=$_tr2_i$0;
 var $6=$_tr2_i&2047;
 var $$etemp$0$0=0;
 var $$etemp$0$1=-2147483648;
 var $7$0=$1$0&$$etemp$0$0;
 var $7$1=$1$1&$$etemp$0$1;
 var $8$0=($2$0<<1)|(0>>>31);
 var $8$1=($2$1<<1)|($2$0>>>31);
 var $$etemp$1$0=0;
 var $$etemp$1$1=0;
 var $9=(($8$0|0) == ($$etemp$1$0|0)) & (($8$1|0) == ($$etemp$1$1|0));
 if($9){label=3;break;}else{label=2;break;}
 case 2: 
 var $$etemp$2$0=-1;
 var $$etemp$2$1=2147483647;
 var $11$0=$2$0&$$etemp$2$0;
 var $11$1=$2$1&$$etemp$2$1;
 var $$etemp$3$0=0;
 var $$etemp$3$1=2146435072;
 var $12=(($11$1>>>0) > ($$etemp$3$1>>>0)) | (((($11$1>>>0) == ($$etemp$3$1>>>0) & ($11$0>>>0) >  ($$etemp$3$0>>>0))));
 var $13=($4|0)==2047;
 var $or_cond_i=$12|$13;
 if($or_cond_i){label=3;break;}else{label=4;break;}
 case 3: 
 var $15=($x)*($y);
 var $16=($15)/($15);
 var $_0_i=$16;label=31;break;
 case 4: 
 var $18$0=($1$0<<1)|(0>>>31);
 var $18$1=($1$1<<1)|($1$0>>>31);
 var $19=(($18$1>>>0) > ($8$1>>>0)) | (((($18$1>>>0) == ($8$1>>>0) & ($18$0>>>0) >  ($8$0>>>0))));
 if($19){label=7;break;}else{label=5;break;}
 case 5: 
 var $21=(($18$0|0) == ($8$0|0)) & (($18$1|0) == ($8$1|0));
 if($21){label=6;break;}else{var $_0_i=$x;label=31;break;}
 case 6: 
 var $23=($x)*(0);
 var $_0_i=$23;label=31;break;
 case 7: 
 var $25=($4|0)==0;
 if($25){label=8;break;}else{label=11;break;}
 case 8: 
 var $27$0=($1$0<<12)|(0>>>20);
 var $27$1=($1$1<<12)|($1$0>>>20);
 var $$etemp$4$0=-1;
 var $$etemp$4$1=-1;
 var $28=(($27$1|0) > ($$etemp$4$1|0)) | (((($27$1|0) == ($$etemp$4$1|0) & ($27$0>>>0) >  ($$etemp$4$0>>>0))));
 if($28){var $ex_026_i=0;var $i_027_i$1=$27$1;var $i_027_i$0=$27$0;label=9;break;}else{var $ex_0_lcssa_i=0;label=10;break;}
 case 9: 
 var $i_027_i$0;
 var $i_027_i$1;
 var $ex_026_i;
 var $29=((($ex_026_i)-(1))|0);
 var $30$0=($i_027_i$0<<1)|(0>>>31);
 var $30$1=($i_027_i$1<<1)|($i_027_i$0>>>31);
 var $$etemp$5$0=-1;
 var $$etemp$5$1=-1;
 var $31=(($30$1|0) > ($$etemp$5$1|0)) | (((($30$1|0) == ($$etemp$5$1|0) & ($30$0>>>0) >  ($$etemp$5$0>>>0))));
 if($31){var $ex_026_i=$29;var $i_027_i$1=$30$1;var $i_027_i$0=$30$0;label=9;break;}else{var $ex_0_lcssa_i=$29;label=10;break;}
 case 10: 
 var $ex_0_lcssa_i;
 var $32=(((1)-($ex_0_lcssa_i))|0);
 var $33$0=$32;
 var $33$1=0;
 var $34$0=_bitshift64Shl($1$0,$1$1,$33$0);var $34$1=tempRet0;
 var $uxi_0_i$1=$34$1;var $uxi_0_i$0=$34$0;var $ex_1_i=$ex_0_lcssa_i;label=12;break;
 case 11: 
 var $$etemp$6$0=-1;
 var $$etemp$6$1=1048575;
 var $36$0=$1$0&$$etemp$6$0;
 var $36$1=$1$1&$$etemp$6$1;
 var $$etemp$7$0=0;
 var $$etemp$7$1=1048576;
 var $37$0=$36$0|$$etemp$7$0;
 var $37$1=$36$1|$$etemp$7$1;
 var $uxi_0_i$1=$37$1;var $uxi_0_i$0=$37$0;var $ex_1_i=$4;label=12;break;
 case 12: 
 var $ex_1_i;
 var $uxi_0_i$0;
 var $uxi_0_i$1;
 var $39=($6|0)==0;
 if($39){label=13;break;}else{label=16;break;}
 case 13: 
 var $41$0=($2$0<<12)|(0>>>20);
 var $41$1=($2$1<<12)|($2$0>>>20);
 var $$etemp$8$0=-1;
 var $$etemp$8$1=-1;
 var $42=(($41$1|0) > ($$etemp$8$1|0)) | (((($41$1|0) == ($$etemp$8$1|0) & ($41$0>>>0) >  ($$etemp$8$0>>>0))));
 if($42){var $ey_020_i=0;var $i_121_i$1=$41$1;var $i_121_i$0=$41$0;label=14;break;}else{var $ey_0_lcssa_i=0;label=15;break;}
 case 14: 
 var $i_121_i$0;
 var $i_121_i$1;
 var $ey_020_i;
 var $43=((($ey_020_i)-(1))|0);
 var $44$0=($i_121_i$0<<1)|(0>>>31);
 var $44$1=($i_121_i$1<<1)|($i_121_i$0>>>31);
 var $$etemp$9$0=-1;
 var $$etemp$9$1=-1;
 var $45=(($44$1|0) > ($$etemp$9$1|0)) | (((($44$1|0) == ($$etemp$9$1|0) & ($44$0>>>0) >  ($$etemp$9$0>>>0))));
 if($45){var $ey_020_i=$43;var $i_121_i$1=$44$1;var $i_121_i$0=$44$0;label=14;break;}else{var $ey_0_lcssa_i=$43;label=15;break;}
 case 15: 
 var $ey_0_lcssa_i;
 var $46=(((1)-($ey_0_lcssa_i))|0);
 var $47$0=$46;
 var $47$1=0;
 var $48$0=_bitshift64Shl($2$0,$2$1,$47$0);var $48$1=tempRet0;
 var $ey_1_ph_i=$ey_0_lcssa_i;var $uy_sroa_0_0_ph_i$1=$48$1;var $uy_sroa_0_0_ph_i$0=$48$0;label=17;break;
 case 16: 
 var $$etemp$10$0=-1;
 var $$etemp$10$1=1048575;
 var $50$0=$2$0&$$etemp$10$0;
 var $50$1=$2$1&$$etemp$10$1;
 var $$etemp$11$0=0;
 var $$etemp$11$1=1048576;
 var $51$0=$50$0|$$etemp$11$0;
 var $51$1=$50$1|$$etemp$11$1;
 var $ey_1_ph_i=$6;var $uy_sroa_0_0_ph_i$1=$51$1;var $uy_sroa_0_0_ph_i$0=$51$0;label=17;break;
 case 17: 
 var $uy_sroa_0_0_ph_i$0;
 var $uy_sroa_0_0_ph_i$1;
 var $ey_1_ph_i;
 var $52=($ex_1_i|0)>($ey_1_ph_i|0);
 var $53$0=_i64Subtract($uxi_0_i$0,$uxi_0_i$1,$uy_sroa_0_0_ph_i$0,$uy_sroa_0_0_ph_i$1);var $53$1=tempRet0;
 var $$etemp$12$0=-1;
 var $$etemp$12$1=-1;
 var $54=(($53$1|0) > ($$etemp$12$1|0)) | (((($53$1|0) == ($$etemp$12$1|0) & ($53$0>>>0) >  ($$etemp$12$0>>>0))));
 if($52){var $ex_212_i=$ex_1_i;var $uxi_113_i$1=$uxi_0_i$1;var $uxi_113_i$0=$uxi_0_i$0;var $56$1=$53$1;var $56$0=$53$0;var $55=$54;label=18;break;}else{var $ex_2_lcssa_i=$ex_1_i;var $uxi_1_lcssa_i$1=$uxi_0_i$1;var $uxi_1_lcssa_i$0=$uxi_0_i$0;var $_lcssa_i$1=$53$1;var $_lcssa_i$0=$53$0;var $_lcssa10_i=$54;label=22;break;}
 case 18: 
 var $55;
 var $56$0;
 var $56$1;
 var $uxi_113_i$0;
 var $uxi_113_i$1;
 var $ex_212_i;
 if($55){label=19;break;}else{var $uxi_2_i$1=$uxi_113_i$1;var $uxi_2_i$0=$uxi_113_i$0;label=21;break;}
 case 19: 
 var $58=(($uxi_113_i$0|0) == ($uy_sroa_0_0_ph_i$0|0)) & (($uxi_113_i$1|0) == ($uy_sroa_0_0_ph_i$1|0));
 if($58){label=20;break;}else{var $uxi_2_i$1=$56$1;var $uxi_2_i$0=$56$0;label=21;break;}
 case 20: 
 var $60=($x)*(0);
 var $_0_i=$60;label=31;break;
 case 21: 
 var $uxi_2_i$0;
 var $uxi_2_i$1;
 var $62$0=($uxi_2_i$0<<1)|(0>>>31);
 var $62$1=($uxi_2_i$1<<1)|($uxi_2_i$0>>>31);
 var $63=((($ex_212_i)-(1))|0);
 var $64=($63|0)>($ey_1_ph_i|0);
 var $65$0=_i64Subtract($62$0,$62$1,$uy_sroa_0_0_ph_i$0,$uy_sroa_0_0_ph_i$1);var $65$1=tempRet0;
 var $$etemp$13$0=-1;
 var $$etemp$13$1=-1;
 var $66=(($65$1|0) > ($$etemp$13$1|0)) | (((($65$1|0) == ($$etemp$13$1|0) & ($65$0>>>0) >  ($$etemp$13$0>>>0))));
 if($64){var $ex_212_i=$63;var $uxi_113_i$1=$62$1;var $uxi_113_i$0=$62$0;var $56$1=$65$1;var $56$0=$65$0;var $55=$66;label=18;break;}else{var $ex_2_lcssa_i=$63;var $uxi_1_lcssa_i$1=$62$1;var $uxi_1_lcssa_i$0=$62$0;var $_lcssa_i$1=$65$1;var $_lcssa_i$0=$65$0;var $_lcssa10_i=$66;label=22;break;}
 case 22: 
 var $_lcssa10_i;
 var $_lcssa_i$0;
 var $_lcssa_i$1;
 var $uxi_1_lcssa_i$0;
 var $uxi_1_lcssa_i$1;
 var $ex_2_lcssa_i;
 if($_lcssa10_i){label=23;break;}else{var $uxi_3_ph_i$1=$uxi_1_lcssa_i$1;var $uxi_3_ph_i$0=$uxi_1_lcssa_i$0;label=24;break;}
 case 23: 
 var $68=(($uxi_1_lcssa_i$0|0) == ($uy_sroa_0_0_ph_i$0|0)) & (($uxi_1_lcssa_i$1|0) == ($uy_sroa_0_0_ph_i$1|0));
 if($68){label=25;break;}else{var $uxi_3_ph_i$1=$_lcssa_i$1;var $uxi_3_ph_i$0=$_lcssa_i$0;label=24;break;}
 case 24: 
 var $uxi_3_ph_i$0;
 var $uxi_3_ph_i$1;
 var $$etemp$14$0=0;
 var $$etemp$14$1=1048576;
 var $69=(($uxi_3_ph_i$1>>>0) < ($$etemp$14$1>>>0)) | (((($uxi_3_ph_i$1>>>0) == ($$etemp$14$1>>>0) & ($uxi_3_ph_i$0>>>0) <  ($$etemp$14$0>>>0))));
 if($69){var $ex_33_i=$ex_2_lcssa_i;var $uxi_34_i$1=$uxi_3_ph_i$1;var $uxi_34_i$0=$uxi_3_ph_i$0;label=26;break;}else{var $ex_3_lcssa_i=$ex_2_lcssa_i;var $uxi_3_lcssa_i$1=$uxi_3_ph_i$1;var $uxi_3_lcssa_i$0=$uxi_3_ph_i$0;label=27;break;}
 case 25: 
 var $71=($x)*(0);
 var $_0_i=$71;label=31;break;
 case 26: 
 var $uxi_34_i$0;
 var $uxi_34_i$1;
 var $ex_33_i;
 var $72$0=($uxi_34_i$0<<1)|(0>>>31);
 var $72$1=($uxi_34_i$1<<1)|($uxi_34_i$0>>>31);
 var $73=((($ex_33_i)-(1))|0);
 var $$etemp$15$0=0;
 var $$etemp$15$1=1048576;
 var $74=(($72$1>>>0) < ($$etemp$15$1>>>0)) | (((($72$1>>>0) == ($$etemp$15$1>>>0) & ($72$0>>>0) <  ($$etemp$15$0>>>0))));
 if($74){var $ex_33_i=$73;var $uxi_34_i$1=$72$1;var $uxi_34_i$0=$72$0;label=26;break;}else{var $ex_3_lcssa_i=$73;var $uxi_3_lcssa_i$1=$72$1;var $uxi_3_lcssa_i$0=$72$0;label=27;break;}
 case 27: 
 var $uxi_3_lcssa_i$0;
 var $uxi_3_lcssa_i$1;
 var $ex_3_lcssa_i;
 var $75=($ex_3_lcssa_i|0)>0;
 if($75){label=28;break;}else{label=29;break;}
 case 28: 
 var $$etemp$16$0=0;
 var $$etemp$16$1=-1048576;
 var $77$0=_i64Add($uxi_3_lcssa_i$0,$uxi_3_lcssa_i$1,$$etemp$16$0,$$etemp$16$1);var $77$1=tempRet0;
 var $78$0=$ex_3_lcssa_i;
 var $78$1=0;
 var $79$0=(0<<20)|(0>>>12);
 var $79$1=($78$0<<20)|(0>>>12);
 var $80$0=$77$0|$79$0;
 var $80$1=$77$1|$79$1;
 var $uxi_4_i$1=$80$1;var $uxi_4_i$0=$80$0;label=30;break;
 case 29: 
 var $82=(((1)-($ex_3_lcssa_i))|0);
 var $83$0=$82;
 var $83$1=0;
 var $84$0=_bitshift64Lshr($uxi_3_lcssa_i$0,$uxi_3_lcssa_i$1,$83$0);var $84$1=tempRet0;
 var $uxi_4_i$1=$84$1;var $uxi_4_i$0=$84$0;label=30;break;
 case 30: 
 var $uxi_4_i$0;
 var $uxi_4_i$1;
 var $86$0=$uxi_4_i$0|$7$0;
 var $86$1=$uxi_4_i$1|$7$1;
 var $87=(HEAP32[((tempDoublePtr)>>2)]=$86$0, HEAP32[(((tempDoublePtr)+(4))>>2)]=$86$1, HEAPF64[(tempDoublePtr)>>3]);
 var $_0_i=$87;label=31;break;
 case 31: 
 var $_0_i;
 return $_0_i;
  default: assert(0, "bad label: " + label);
 }

}

//Func
function _frexp($x,$e){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 HEAPF64[(tempDoublePtr)>>3]=$x; var $1$0=HEAP32[((tempDoublePtr)>>2)];var $1$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 var $2$0=($1$1>>>20)|(0<<12);
 var $2$1=(0>>>20)|(0<<12);
 var $_tr$0=$2$0;
 var $_tr=$_tr$0;
 var $3=$_tr&2047;
 if(($3|0)==0){ label=2;break;}else if(($3|0)==2047){ var $_0=$x;label=6;break;}else{label=5;break;}
 case 2: 
 var $5=$x!=0;
 if($5){label=3;break;}else{var $_01=$x;var $storemerge=0;label=4;break;}
 case 3: 
 var $7=($x)*(18446744073709552000);
 var $8=_frexp($7,$e);
 var $9=HEAP32[(($e)>>2)];
 var $10=((($9)-(64))|0);
 var $_01=$8;var $storemerge=$10;label=4;break;
 case 4: 
 var $storemerge;
 var $_01;
 HEAP32[(($e)>>2)]=$storemerge;
 var $_0=$_01;label=6;break;
 case 5: 
 var $13=((($3)-(1022))|0);
 HEAP32[(($e)>>2)]=$13;
 var $$etemp$0$0=-1;
 var $$etemp$0$1=-2146435073;
 var $14$0=$1$0&$$etemp$0$0;
 var $14$1=$1$1&$$etemp$0$1;
 var $$etemp$1$0=0;
 var $$etemp$1$1=1071644672;
 var $15$0=$14$0|$$etemp$1$0;
 var $15$1=$14$1|$$etemp$1$1;
 var $16=(HEAP32[((tempDoublePtr)>>2)]=$15$0, HEAP32[(((tempDoublePtr)+(4))>>2)]=$15$1, HEAPF64[(tempDoublePtr)>>3]);
 var $_0=$16;label=6;break;
 case 6: 
 var $_0;
 return $_0;
  default: assert(0, "bad label: " + label);
 }

}

//Func
function _wcrtomb($s,$wc){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=($s|0)==0;
 if($1){var $_0=1;label=11;break;}else{label=2;break;}
 case 2: 
 var $3=($wc>>>0)<128;
 if($3){label=3;break;}else{label=4;break;}
 case 3: 
 var $5=(($wc)&255);
 HEAP8[(($s)>>0)]=$5;
 var $_0=1;label=11;break;
 case 4: 
 var $7=($wc>>>0)<2048;
 if($7){label=5;break;}else{label=6;break;}
 case 5: 
 var $9=$wc>>>6;
 var $10=$9|192;
 var $11=(($10)&255);
 var $12=(($s+1)|0);
 HEAP8[(($s)>>0)]=$11;
 var $13=$wc&63;
 var $14=$13|128;
 var $15=(($14)&255);
 HEAP8[(($12)>>0)]=$15;
 var $_0=2;label=11;break;
 case 6: 
 var $17=($wc>>>0)<55296;
 var $18=$wc&-8192;
 var $19=($18|0)==57344;
 var $or_cond=$17|$19;
 if($or_cond){label=7;break;}else{label=8;break;}
 case 7: 
 var $21=$wc>>>12;
 var $22=$21|224;
 var $23=(($22)&255);
 var $24=(($s+1)|0);
 HEAP8[(($s)>>0)]=$23;
 var $25=$wc>>>6;
 var $26=$25&63;
 var $27=$26|128;
 var $28=(($27)&255);
 var $29=(($s+2)|0);
 HEAP8[(($24)>>0)]=$28;
 var $30=$wc&63;
 var $31=$30|128;
 var $32=(($31)&255);
 HEAP8[(($29)>>0)]=$32;
 var $_0=3;label=11;break;
 case 8: 
 var $34=((($wc)-(65536))|0);
 var $35=($34>>>0)<1048576;
 if($35){label=9;break;}else{label=10;break;}
 case 9: 
 var $37=$wc>>>18;
 var $38=$37|240;
 var $39=(($38)&255);
 var $40=(($s+1)|0);
 HEAP8[(($s)>>0)]=$39;
 var $41=$wc>>>12;
 var $42=$41&63;
 var $43=$42|128;
 var $44=(($43)&255);
 var $45=(($s+2)|0);
 HEAP8[(($40)>>0)]=$44;
 var $46=$wc>>>6;
 var $47=$46&63;
 var $48=$47|128;
 var $49=(($48)&255);
 var $50=(($s+3)|0);
 HEAP8[(($45)>>0)]=$49;
 var $51=$wc&63;
 var $52=$51|128;
 var $53=(($52)&255);
 HEAP8[(($50)>>0)]=$53;
 var $_0=4;label=11;break;
 case 10: 
 var $55=___errno_location();
 HEAP32[(($55)>>2)]=84;
 var $_0=-1;label=11;break;
 case 11: 
 var $_0;
 return $_0;
  default: assert(0, "bad label: " + label);
 }

}

//Func
function ___uflow($f){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+8)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $c=sp;
 var $1=(($f+8)|0);
 var $2=HEAP32[(($1)>>2)];
 var $3=($2|0)==0;
 if($3){label=2;break;}else{label=8;break;}
 case 2: 
 var $5=(($f+74)|0);
 var $6=HEAP8[(($5)>>0)];
 var $7=((($6)-(1))&255);
 var $8=$7|$6;
 HEAP8[(($5)>>0)]=$8;
 var $9=(($f+20)|0);
 var $10=HEAP32[(($9)>>2)];
 var $11=(($f+44)|0);
 var $12=HEAP32[(($11)>>2)];
 var $13=($10>>>0)>($12>>>0);
 if($13){label=3;break;}else{label=4;break;}
 case 3: 
 var $15=(($f+36)|0);
 var $16=HEAP32[(($15)>>2)];
 var $17=FUNCTION_TABLE[$16]($f,0,0);
 label=4;break;
 case 4: 
 var $19=(($f+16)|0);
 HEAP32[(($19)>>2)]=0;
 var $20=(($f+28)|0);
 HEAP32[(($20)>>2)]=0;
 HEAP32[(($9)>>2)]=0;
 var $21=(($f)|0);
 var $22=HEAP32[(($21)>>2)];
 var $23=$22&20;
 var $24=($23|0)==0;
 if($24){label=7;break;}else{label=5;break;}
 case 5: 
 var $26=$22&4;
 var $27=($26|0)==0;
 if($27){var $_0=-1;label=10;break;}else{label=6;break;}
 case 6: 
 var $29=$22|32;
 HEAP32[(($21)>>2)]=$29;
 var $_0=-1;label=10;break;
 case 7: 
 var $30=HEAP32[(($11)>>2)];
 HEAP32[(($1)>>2)]=$30;
 var $31=(($f+4)|0);
 HEAP32[(($31)>>2)]=$30;
 label=8;break;
 case 8: 
 var $33=(($f+32)|0);
 var $34=HEAP32[(($33)>>2)];
 var $35=FUNCTION_TABLE[$34]($f,$c,1);
 var $36=($35|0)==1;
 if($36){label=9;break;}else{var $_0=-1;label=10;break;}
 case 9: 
 var $38=HEAP8[(($c)>>0)];
 var $39=($38&255);
 var $_0=$39;label=10;break;
 case 10: 
 var $_0;
 STACKTOP=sp;return $_0;
  default: assert(0, "bad label: " + label);
 }

}

//Func
function ___fwritex($s,$l,$f){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=(($f+16)|0);
 var $2=HEAP32[(($1)>>2)];
 var $3=($2|0)==0;
 if($3){label=3;break;}else{label=2;break;}
 case 2: 
 var $_phi_trans_insert=(($f+20)|0);
 var $_pre=HEAP32[(($_phi_trans_insert)>>2)];
 var $25=$2;var $24=$_pre;label=6;break;
 case 3: 
 var $5=(($f+74)|0);
 var $6=HEAP8[(($5)>>0)];
 var $7=((($6)-(1))&255);
 var $8=$7|$6;
 HEAP8[(($5)>>0)]=$8;
 var $9=(($f)|0);
 var $10=HEAP32[(($9)>>2)];
 var $11=$10&8;
 var $12=($11|0)==0;
 if($12){label=5;break;}else{label=4;break;}
 case 4: 
 var $13=$10|32;
 HEAP32[(($9)>>2)]=$13;
 label=14;break;
 case 5: 
 var $14=(($f+8)|0);
 HEAP32[(($14)>>2)]=0;
 var $15=(($f+4)|0);
 HEAP32[(($15)>>2)]=0;
 var $16=(($f+44)|0);
 var $17=HEAP32[(($16)>>2)];
 var $18=(($f+28)|0);
 HEAP32[(($18)>>2)]=$17;
 var $19=(($f+20)|0);
 HEAP32[(($19)>>2)]=$17;
 var $20=(($f+48)|0);
 var $21=HEAP32[(($20)>>2)];
 var $22=(($17+$21)|0);
 HEAP32[(($1)>>2)]=$22;
 var $25=$22;var $24=$17;label=6;break;
 case 6: 
 var $24;
 var $25;
 var $26=(($f+20)|0);
 var $27=$25;
 var $28=$24;
 var $29=((($27)-($28))|0);
 var $30=($29>>>0)<($l>>>0);
 if($30){label=7;break;}else{label=8;break;}
 case 7: 
 var $32=(($f+36)|0);
 var $33=HEAP32[(($32)>>2)];
 var $34=FUNCTION_TABLE[$33]($f,$s,$l);
 label=14;break;
 case 8: 
 var $36=(($f+75)|0);
 var $37=HEAP8[(($36)>>0)];
 var $38=(($37<<24)>>24)>-1;
 if($38){var $i_0=$l;label=9;break;}else{var $_01=$l;var $_02=$s;var $53=$24;label=13;break;}
 case 9: 
 var $i_0;
 var $39=($i_0|0)==0;
 if($39){var $_01=$l;var $_02=$s;var $53=$24;label=13;break;}else{label=10;break;}
 case 10: 
 var $41=((($i_0)-(1))|0);
 var $42=(($s+$41)|0);
 var $43=HEAP8[(($42)>>0)];
 var $44=(($43<<24)>>24)==10;
 if($44){label=11;break;}else{var $i_0=$41;label=9;break;}
 case 11: 
 var $46=(($f+36)|0);
 var $47=HEAP32[(($46)>>2)];
 var $48=FUNCTION_TABLE[$47]($f,$s,$i_0);
 var $49=($48>>>0)<($i_0>>>0);
 if($49){label=14;break;}else{label=12;break;}
 case 12: 
 var $51=(($s+$i_0)|0);
 var $52=((($l)-($i_0))|0);
 var $_pre5=HEAP32[(($26)>>2)];
 var $_01=$52;var $_02=$51;var $53=$_pre5;label=13;break;
 case 13: 
 var $53;
 var $_02;
 var $_01;
 assert($_01 % 1 === 0);(_memcpy($53, $_02, $_01)|0);
 var $54=HEAP32[(($26)>>2)];
 var $55=(($54+$_01)|0);
 HEAP32[(($26)>>2)]=$55;
 label=14;break;
 case 14: 
 return;
  default: assert(0, "bad label: " + label);
 }

}

//Func
function _snprintf($s,$n,$fmt,varrp){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $ap=sp;
 var $1=(($ap)|0);
 var $2=$ap;
 HEAP32[(($2)>>2)]=varrp;HEAP32[((($2)+(4))>>2)]=0;
 var $3=_vsnprintf($s,$n,$fmt,$1);

 STACKTOP=sp;return $3;
}

//Func
function _sprintf($s,varrp){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+16)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);

 var $ap=sp;
 var $1=(($ap)|0);
 var $2=$ap;
 HEAP32[(($2)>>2)]=varrp;HEAP32[((($2)+(4))>>2)]=0;
 var $3=_vsnprintf($s,2147483647,3744,$1);

 STACKTOP=sp;return;
}

//Func
function _vsnprintf($s,$n,$fmt,$ap){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+336)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $ap2_i=sp;
 var $nl_type_i=(sp)+(16);
 var $nl_arg_i=(sp)+(56);
 var $internal_buf_i=(sp)+(136);
 var $b=(sp)+(216);
 var $f=(sp)+(224);
 var $1=$f;
 var $$etemp$0$0=112;
 var $$etemp$0$1=0;

 assert(112 % 1 === 0);(_memcpy($1, 24, 112)|0);
 var $2=((($n)-(1))|0);
 var $3=($2>>>0)>2147483646;
 if($3){label=2;break;}else{var $9=$s;var $_02=$n;label=4;break;}
 case 2: 
 var $5=($n|0)==0;
 if($5){var $9=$b;var $_02=1;label=4;break;}else{label=3;break;}
 case 3: 
 var $7=___errno_location();
 HEAP32[(($7)>>2)]=75;
 var $_0=-1;label=13;break;
 case 4: 
 var $_02;
 var $9;
 var $10=$9;
 var $11=(((-2)-($10))|0);
 var $12=($_02>>>0)>($11>>>0);
 var $__02=($12?$11:$_02);
 var $13=(($f+48)|0);
 HEAP32[(($13)>>2)]=$__02;
 var $14=(($f+20)|0);
 HEAP32[(($14)>>2)]=$9;
 var $15=(($f+44)|0);
 HEAP32[(($15)>>2)]=$9;
 var $16=(($9+$__02)|0);
 var $17=(($f+16)|0);
 HEAP32[(($17)>>2)]=$16;
 var $18=(($f+28)|0);
 HEAP32[(($18)>>2)]=$16;
 var $19=$ap2_i;
 var $$etemp$1$0=16;
 var $$etemp$1$1=0;

 var $20=$nl_type_i;
 var $$etemp$2$0=40;
 var $$etemp$2$1=0;

 _memset($20, 0, 40)|0;
 var $21=$nl_arg_i;
 var $$etemp$3$0=80;
 var $$etemp$3$1=0;

 var $22=(($internal_buf_i)|0);
 var $$etemp$4$0=80;
 var $$etemp$4$1=0;

 var $23=$ap;
 _llvm_va_copy($19,$23);
 var $24=(($nl_arg_i)|0);
 var $25=(($nl_type_i)|0);
 var $26=_printf_core(0,$fmt,$ap2_i,$24,$25);
 var $27=($26|0)<0;
 if($27){label=5;break;}else{label=6;break;}
 case 5: 

 var $_0_i=-1;label=11;break;
 case 6: 
 var $30=($__02|0)==0;
 if($30){label=8;break;}else{label=7;break;}
 case 7: 
 var $31=_printf_core($f,$fmt,$ap2_i,$24,$25);
 var $ret_1_i=$31;label=10;break;
 case 8: 
 HEAP32[(($15)>>2)]=$22;
 HEAP32[(($18)>>2)]=$22;
 HEAP32[(($14)>>2)]=$22;
 HEAP32[(($13)>>2)]=80;
 var $33=(($internal_buf_i+80)|0);
 HEAP32[(($17)>>2)]=$33;
 var $34=_printf_core($f,$fmt,$ap2_i,$24,$25);
 var $35=($9|0)==0;
 if($35){var $ret_1_i=$34;label=10;break;}else{label=9;break;}
 case 9: 
 var $37=(($f+36)|0);
 var $38=HEAP32[(($37)>>2)];
 var $39=FUNCTION_TABLE[$38]($f,0,0);
 var $40=HEAP32[(($14)>>2)];
 var $41=($40|0)==0;
 var $__i=($41?-1:$34);
 HEAP32[(($15)>>2)]=$9;
 HEAP32[(($13)>>2)]=0;
 HEAP32[(($17)>>2)]=0;
 HEAP32[(($18)>>2)]=0;
 HEAP32[(($14)>>2)]=0;
 var $ret_1_i=$__i;label=10;break;
 case 10: 
 var $ret_1_i;

 var $_0_i=$ret_1_i;label=11;break;
 case 11: 
 var $_0_i;
 var $$etemp$5$0=80;
 var $$etemp$5$1=0;

 var $$etemp$6$0=80;
 var $$etemp$6$1=0;

 var $$etemp$7$0=40;
 var $$etemp$7$1=0;

 var $$etemp$8$0=16;
 var $$etemp$8$1=0;

 var $43=($__02|0)==0;
 if($43){var $_0=$_0_i;label=13;break;}else{label=12;break;}
 case 12: 
 var $45=HEAP32[(($14)>>2)];
 var $46=HEAP32[(($17)>>2)];
 var $47=($45|0)==($46|0);
 var $48=(($47<<31)>>31);
 var $49=(($45+$48)|0);
 HEAP8[(($49)>>0)]=0;
 var $_0=$_0_i;label=13;break;
 case 13: 
 var $_0;
 var $$etemp$9$0=112;
 var $$etemp$9$1=0;

 STACKTOP=sp;return $_0;
  default: assert(0, "bad label: " + label);
 }

}

//Func
function _strtold_l($s,$p){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+112)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $f_i_i=sp;
 var $1=$f_i_i;
 var $$etemp$0$0=112;
 var $$etemp$0$1=0;

 _memset($1, 0, 108)|0;
 var $2=(($f_i_i+4)|0);
 HEAP32[(($2)>>2)]=$s;
 var $3=(($f_i_i+8)|0);
 HEAP32[(($3)>>2)]=-1;
 var $4=(($f_i_i+44)|0);
 HEAP32[(($4)>>2)]=$s;
 var $5=(($f_i_i+76)|0);
 HEAP32[(($5)>>2)]=-1;
 var $6=(($f_i_i+104)|0);
 HEAP32[(($6)>>2)]=0;
 var $7=$s;
 var $8=$7^-1;
 var $9=(($f_i_i+108)|0);
 HEAP32[(($9)>>2)]=$8;
 var $10=(($f_i_i+100)|0);
 HEAP32[(($10)>>2)]=-1;
 var $11=___floatscan($f_i_i,2,1);
 var $12=HEAP32[(($9)>>2)];
 var $13=HEAP32[(($2)>>2)];
 var $14=HEAP32[(($3)>>2)];
 var $15=$13;
 var $16=$14;
 var $17=((($15)-($16))|0);
 var $18=((($17)+($12))|0);
 var $19=($p|0)==0;
 if($19){label=5;break;}else{label=2;break;}
 case 2: 
 var $21=($18|0)==0;
 if($21){var $25=$s;label=4;break;}else{label=3;break;}
 case 3: 
 var $23=(($s+$18)|0);
 var $25=$23;label=4;break;
 case 4: 
 var $25;
 HEAP32[(($p)>>2)]=$25;
 label=5;break;
 case 5: 
 var $$etemp$1$0=112;
 var $$etemp$1$1=0;

 STACKTOP=sp;return $11;
  default: assert(0, "bad label: " + label);
 }

}

//Func
function _strtoull($s,$p,$base){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+112)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $f_i=sp;
 var $1=$f_i;
 var $$etemp$0$0=112;
 var $$etemp$0$1=0;

 var $2=(($f_i)|0);
 HEAP32[(($2)>>2)]=0;
 var $3=(($f_i+4)|0);
 HEAP32[(($3)>>2)]=$s;
 var $4=(($f_i+44)|0);
 HEAP32[(($4)>>2)]=$s;
 var $5=($s|0)<0;
 if($5){label=2;break;}else{label=3;break;}
 case 2: 
 var $7=(($f_i+8)|0);
 HEAP32[(($7)>>2)]=-1;
 var $12=-1;label=4;break;
 case 3: 
 var $9=(($s+2147483647)|0);
 var $10=(($f_i+8)|0);
 HEAP32[(($10)>>2)]=$9;
 var $12=$9;label=4;break;
 case 4: 
 var $12;
 var $13=(($f_i+76)|0);
 HEAP32[(($13)>>2)]=-1;
 var $14=(($f_i+104)|0);
 HEAP32[(($14)>>2)]=0;
 var $15=$12;
 var $16=$s;
 var $17=((($15)-($16))|0);
 var $18=(($f_i+108)|0);
 HEAP32[(($18)>>2)]=$17;
 var $19=(($f_i+100)|0);
 HEAP32[(($19)>>2)]=$12;
 var $$etemp$1$0=-1;
 var $$etemp$1$1=-1;
 var $20$0=___intscan($f_i,$base,1,$$etemp$1$0,$$etemp$1$1);
 var $20$1=tempRet0;
 var $21=($p|0)==0;
 if($21){label=6;break;}else{label=5;break;}
 case 5: 
 var $23=(($f_i+8)|0);
 var $24=HEAP32[(($18)>>2)];
 var $25=HEAP32[(($3)>>2)];
 var $26=HEAP32[(($23)>>2)];
 var $27=$25;
 var $28=$26;
 var $29=((($27)+($24))|0);
 var $30=((($29)-($28))|0);
 var $31=(($s+$30)|0);
 HEAP32[(($p)>>2)]=$31;
 label=6;break;
 case 6: 
 var $$etemp$2$0=112;
 var $$etemp$2$1=0;

 STACKTOP=sp;return (tempRet0=$20$1,$20$0);
  default: assert(0, "bad label: " + label);
 }

}

//Func
function _strtoll($s,$p,$base){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+112)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $f_i=sp;
 var $1=$f_i;
 var $$etemp$0$0=112;
 var $$etemp$0$1=0;

 var $2=(($f_i)|0);
 HEAP32[(($2)>>2)]=0;
 var $3=(($f_i+4)|0);
 HEAP32[(($3)>>2)]=$s;
 var $4=(($f_i+44)|0);
 HEAP32[(($4)>>2)]=$s;
 var $5=($s|0)<0;
 if($5){label=2;break;}else{label=3;break;}
 case 2: 
 var $7=(($f_i+8)|0);
 HEAP32[(($7)>>2)]=-1;
 var $12=-1;label=4;break;
 case 3: 
 var $9=(($s+2147483647)|0);
 var $10=(($f_i+8)|0);
 HEAP32[(($10)>>2)]=$9;
 var $12=$9;label=4;break;
 case 4: 
 var $12;
 var $13=(($f_i+76)|0);
 HEAP32[(($13)>>2)]=-1;
 var $14=(($f_i+104)|0);
 HEAP32[(($14)>>2)]=0;
 var $15=$12;
 var $16=$s;
 var $17=((($15)-($16))|0);
 var $18=(($f_i+108)|0);
 HEAP32[(($18)>>2)]=$17;
 var $19=(($f_i+100)|0);
 HEAP32[(($19)>>2)]=$12;
 var $$etemp$1$0=0;
 var $$etemp$1$1=-2147483648;
 var $20$0=___intscan($f_i,$base,1,$$etemp$1$0,$$etemp$1$1);
 var $20$1=tempRet0;
 var $21=($p|0)==0;
 if($21){label=6;break;}else{label=5;break;}
 case 5: 
 var $23=(($f_i+8)|0);
 var $24=HEAP32[(($18)>>2)];
 var $25=HEAP32[(($3)>>2)];
 var $26=HEAP32[(($23)>>2)];
 var $27=$25;
 var $28=$26;
 var $29=((($27)+($24))|0);
 var $30=((($29)-($28))|0);
 var $31=(($s+$30)|0);
 HEAP32[(($p)>>2)]=$31;
 label=6;break;
 case 6: 
 var $$etemp$2$0=112;
 var $$etemp$2$1=0;

 STACKTOP=sp;return (tempRet0=$20$1,$20$0);
  default: assert(0, "bad label: " + label);
 }

}

//Func
function _sn_write($f,$s,$l){
 var label=0;


 var $1=(($f+16)|0);
 var $2=HEAP32[(($1)>>2)];
 var $3=(($f+20)|0);
 var $4=HEAP32[(($3)>>2)];
 var $5=$2;
 var $6=$4;
 var $7=((($5)-($6))|0);
 var $8=($7>>>0)>($l>>>0);
 var $l_=($8?$l:$7);
 assert($l_ % 1 === 0);(_memcpy($4, $s, $l_)|0);
 var $9=HEAP32[(($3)>>2)];
 var $10=(($9+$l_)|0);
 HEAP32[(($3)>>2)]=$10;
 return $l;
}

//Func
function _dispose_chunk($p,$psize){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=$p;
 var $2=(($1+$psize)|0);
 var $3=$2;
 var $4=(($p+4)|0);
 var $5=HEAP32[(($4)>>2)];
 var $6=$5&1;
 var $7=($6|0)==0;
 if($7){label=2;break;}else{var $_0=$p;var $_02=$psize;label=54;break;}
 case 2: 
 var $9=(($p)|0);
 var $10=HEAP32[(($9)>>2)];
 var $11=$5&3;
 var $12=($11|0)==0;
 if($12){label=134;break;}else{label=3;break;}
 case 3: 
 var $14=(((-$10))|0);
 var $15=(($1+$14)|0);
 var $16=$15;
 var $17=((($10)+($psize))|0);
 var $18=HEAP32[((28904)>>2)];
 var $19=($15>>>0)<($18>>>0);
 if($19){label=53;break;}else{label=4;break;}
 case 4: 
 var $21=HEAP32[((28908)>>2)];
 var $22=($16|0)==($21|0);
 if($22){label=51;break;}else{label=5;break;}
 case 5: 
 var $24=$10>>>3;
 var $25=($10>>>0)<256;
 if($25){label=6;break;}else{label=18;break;}
 case 6: 
 var $_sum35=(((8)-($10))|0);
 var $27=(($1+$_sum35)|0);
 var $28=$27;
 var $29=HEAP32[(($28)>>2)];
 var $_sum36=(((12)-($10))|0);
 var $30=(($1+$_sum36)|0);
 var $31=$30;
 var $32=HEAP32[(($31)>>2)];
 var $33=$24<<1;
 var $34=((28928+($33<<2))|0);
 var $35=$34;
 var $36=($29|0)==($35|0);
 if($36){label=9;break;}else{label=7;break;}
 case 7: 
 var $38=$29;
 var $39=($38>>>0)<($18>>>0);
 if($39){label=17;break;}else{label=8;break;}
 case 8: 
 var $41=(($29+12)|0);
 var $42=HEAP32[(($41)>>2)];
 var $43=($42|0)==($16|0);
 if($43){label=9;break;}else{label=17;break;}
 case 9: 
 var $44=($32|0)==($29|0);
 if($44){label=10;break;}else{label=11;break;}
 case 10: 
 var $46=1<<$24;
 var $47=$46^-1;
 var $48=HEAP32[((28888)>>2)];
 var $49=$48&$47;
 HEAP32[((28888)>>2)]=$49;
 var $_0=$16;var $_02=$17;label=54;break;
 case 11: 
 var $51=($32|0)==($35|0);
 if($51){label=12;break;}else{label=13;break;}
 case 12: 
 var $_pre65=(($32+8)|0);
 var $_pre_phi66=$_pre65;label=15;break;
 case 13: 
 var $53=$32;
 var $54=($53>>>0)<($18>>>0);
 if($54){label=16;break;}else{label=14;break;}
 case 14: 
 var $56=(($32+8)|0);
 var $57=HEAP32[(($56)>>2)];
 var $58=($57|0)==($16|0);
 if($58){var $_pre_phi66=$56;label=15;break;}else{label=16;break;}
 case 15: 
 var $_pre_phi66;
 var $59=(($29+12)|0);
 HEAP32[(($59)>>2)]=$32;
 HEAP32[(($_pre_phi66)>>2)]=$29;
 var $_0=$16;var $_02=$17;label=54;break;
 case 16: 
 _abort();
 throw "Reached an unreachable!";
 case 17: 
 _abort();
 throw "Reached an unreachable!";
 case 18: 
 var $61=$15;
 var $_sum26=(((24)-($10))|0);
 var $62=(($1+$_sum26)|0);
 var $63=$62;
 var $64=HEAP32[(($63)>>2)];
 var $_sum27=(((12)-($10))|0);
 var $65=(($1+$_sum27)|0);
 var $66=$65;
 var $67=HEAP32[(($66)>>2)];
 var $68=($67|0)==($61|0);
 if($68){label=24;break;}else{label=19;break;}
 case 19: 
 var $_sum33=(((8)-($10))|0);
 var $70=(($1+$_sum33)|0);
 var $71=$70;
 var $72=HEAP32[(($71)>>2)];
 var $73=$72;
 var $74=($73>>>0)<($18>>>0);
 if($74){label=23;break;}else{label=20;break;}
 case 20: 
 var $76=(($72+12)|0);
 var $77=HEAP32[(($76)>>2)];
 var $78=($77|0)==($61|0);
 if($78){label=21;break;}else{label=23;break;}
 case 21: 
 var $80=(($67+8)|0);
 var $81=HEAP32[(($80)>>2)];
 var $82=($81|0)==($61|0);
 if($82){label=22;break;}else{label=23;break;}
 case 22: 
 HEAP32[(($76)>>2)]=$67;
 HEAP32[(($80)>>2)]=$72;
 var $R_1=$67;label=31;break;
 case 23: 
 _abort();
 throw "Reached an unreachable!";
 case 24: 
 var $_sum28=(((16)-($10))|0);
 var $_sum29=((($_sum28)+(4))|0);
 var $85=(($1+$_sum29)|0);
 var $86=$85;
 var $87=HEAP32[(($86)>>2)];
 var $88=($87|0)==0;
 if($88){label=25;break;}else{var $R_0=$87;var $RP_0=$86;label=26;break;}
 case 25: 
 var $90=(($1+$_sum28)|0);
 var $91=$90;
 var $92=HEAP32[(($91)>>2)];
 var $93=($92|0)==0;
 if($93){var $R_1=0;label=31;break;}else{var $R_0=$92;var $RP_0=$91;label=26;break;}
 case 26: 
 var $RP_0;
 var $R_0;
 var $94=(($R_0+20)|0);
 var $95=HEAP32[(($94)>>2)];
 var $96=($95|0)==0;
 if($96){label=27;break;}else{var $R_0=$95;var $RP_0=$94;label=26;break;}
 case 27: 
 var $98=(($R_0+16)|0);
 var $99=HEAP32[(($98)>>2)];
 var $100=($99|0)==0;
 if($100){label=28;break;}else{var $R_0=$99;var $RP_0=$98;label=26;break;}
 case 28: 
 var $102=$RP_0;
 var $103=($102>>>0)<($18>>>0);
 if($103){label=30;break;}else{label=29;break;}
 case 29: 
 HEAP32[(($RP_0)>>2)]=0;
 var $R_1=$R_0;label=31;break;
 case 30: 
 _abort();
 throw "Reached an unreachable!";
 case 31: 
 var $R_1;
 var $107=($64|0)==0;
 if($107){var $_0=$16;var $_02=$17;label=54;break;}else{label=32;break;}
 case 32: 
 var $_sum30=(((28)-($10))|0);
 var $109=(($1+$_sum30)|0);
 var $110=$109;
 var $111=HEAP32[(($110)>>2)];
 var $112=((29192+($111<<2))|0);
 var $113=HEAP32[(($112)>>2)];
 var $114=($61|0)==($113|0);
 if($114){label=33;break;}else{label=35;break;}
 case 33: 
 HEAP32[(($112)>>2)]=$R_1;
 var $cond=($R_1|0)==0;
 if($cond){label=34;break;}else{label=41;break;}
 case 34: 
 var $116=1<<$111;
 var $117=$116^-1;
 var $118=HEAP32[((28892)>>2)];
 var $119=$118&$117;
 HEAP32[((28892)>>2)]=$119;
 var $_0=$16;var $_02=$17;label=54;break;
 case 35: 
 var $121=$64;
 var $122=HEAP32[((28904)>>2)];
 var $123=($121>>>0)<($122>>>0);
 if($123){label=39;break;}else{label=36;break;}
 case 36: 
 var $125=(($64+16)|0);
 var $126=HEAP32[(($125)>>2)];
 var $127=($126|0)==($61|0);
 if($127){label=37;break;}else{label=38;break;}
 case 37: 
 HEAP32[(($125)>>2)]=$R_1;
 label=40;break;
 case 38: 
 var $130=(($64+20)|0);
 HEAP32[(($130)>>2)]=$R_1;
 label=40;break;
 case 39: 
 _abort();
 throw "Reached an unreachable!";
 case 40: 
 var $133=($R_1|0)==0;
 if($133){var $_0=$16;var $_02=$17;label=54;break;}else{label=41;break;}
 case 41: 
 var $135=$R_1;
 var $136=HEAP32[((28904)>>2)];
 var $137=($135>>>0)<($136>>>0);
 if($137){label=50;break;}else{label=42;break;}
 case 42: 
 var $139=(($R_1+24)|0);
 HEAP32[(($139)>>2)]=$64;
 var $_sum31=(((16)-($10))|0);
 var $140=(($1+$_sum31)|0);
 var $141=$140;
 var $142=HEAP32[(($141)>>2)];
 var $143=($142|0)==0;
 if($143){label=46;break;}else{label=43;break;}
 case 43: 
 var $145=$142;
 var $146=($145>>>0)<($136>>>0);
 if($146){label=45;break;}else{label=44;break;}
 case 44: 
 var $148=(($R_1+16)|0);
 HEAP32[(($148)>>2)]=$142;
 var $149=(($142+24)|0);
 HEAP32[(($149)>>2)]=$R_1;
 label=46;break;
 case 45: 
 _abort();
 throw "Reached an unreachable!";
 case 46: 
 var $_sum32=((($_sum31)+(4))|0);
 var $152=(($1+$_sum32)|0);
 var $153=$152;
 var $154=HEAP32[(($153)>>2)];
 var $155=($154|0)==0;
 if($155){var $_0=$16;var $_02=$17;label=54;break;}else{label=47;break;}
 case 47: 
 var $157=$154;
 var $158=HEAP32[((28904)>>2)];
 var $159=($157>>>0)<($158>>>0);
 if($159){label=49;break;}else{label=48;break;}
 case 48: 
 var $161=(($R_1+20)|0);
 HEAP32[(($161)>>2)]=$154;
 var $162=(($154+24)|0);
 HEAP32[(($162)>>2)]=$R_1;
 var $_0=$16;var $_02=$17;label=54;break;
 case 49: 
 _abort();
 throw "Reached an unreachable!";
 case 50: 
 _abort();
 throw "Reached an unreachable!";
 case 51: 
 var $_sum=((($psize)+(4))|0);
 var $166=(($1+$_sum)|0);
 var $167=$166;
 var $168=HEAP32[(($167)>>2)];
 var $169=$168&3;
 var $170=($169|0)==3;
 if($170){label=52;break;}else{var $_0=$16;var $_02=$17;label=54;break;}
 case 52: 
 HEAP32[((28896)>>2)]=$17;
 var $172=$168&-2;
 HEAP32[(($167)>>2)]=$172;
 var $173=$17|1;
 var $_sum24=(((4)-($10))|0);
 var $174=(($1+$_sum24)|0);
 var $175=$174;
 HEAP32[(($175)>>2)]=$173;
 var $176=$2;
 HEAP32[(($176)>>2)]=$17;
 label=134;break;
 case 53: 
 _abort();
 throw "Reached an unreachable!";
 case 54: 
 var $_02;
 var $_0;
 var $179=HEAP32[((28904)>>2)];
 var $180=($2>>>0)<($179>>>0);
 if($180){label=133;break;}else{label=55;break;}
 case 55: 
 var $_sum1=((($psize)+(4))|0);
 var $182=(($1+$_sum1)|0);
 var $183=$182;
 var $184=HEAP32[(($183)>>2)];
 var $185=$184&2;
 var $186=($185|0)==0;
 if($186){label=56;break;}else{label=109;break;}
 case 56: 
 var $188=HEAP32[((28912)>>2)];
 var $189=($3|0)==($188|0);
 if($189){label=57;break;}else{label=59;break;}
 case 57: 
 var $191=HEAP32[((28900)>>2)];
 var $192=((($191)+($_02))|0);
 HEAP32[((28900)>>2)]=$192;
 HEAP32[((28912)>>2)]=$_0;
 var $193=$192|1;
 var $194=(($_0+4)|0);
 HEAP32[(($194)>>2)]=$193;
 var $195=HEAP32[((28908)>>2)];
 var $196=($_0|0)==($195|0);
 if($196){label=58;break;}else{label=134;break;}
 case 58: 
 HEAP32[((28908)>>2)]=0;
 HEAP32[((28896)>>2)]=0;
 label=134;break;
 case 59: 
 var $199=HEAP32[((28908)>>2)];
 var $200=($3|0)==($199|0);
 if($200){label=60;break;}else{label=61;break;}
 case 60: 
 var $202=HEAP32[((28896)>>2)];
 var $203=((($202)+($_02))|0);
 HEAP32[((28896)>>2)]=$203;
 HEAP32[((28908)>>2)]=$_0;
 var $204=$203|1;
 var $205=(($_0+4)|0);
 HEAP32[(($205)>>2)]=$204;
 var $206=$_0;
 var $207=(($206+$203)|0);
 var $208=$207;
 HEAP32[(($208)>>2)]=$203;
 label=134;break;
 case 61: 
 var $210=$184&-8;
 var $211=((($210)+($_02))|0);
 var $212=$184>>>3;
 var $213=($184>>>0)<256;
 if($213){label=62;break;}else{label=74;break;}
 case 62: 
 var $_sum20=((($psize)+(8))|0);
 var $215=(($1+$_sum20)|0);
 var $216=$215;
 var $217=HEAP32[(($216)>>2)];
 var $_sum21=((($psize)+(12))|0);
 var $218=(($1+$_sum21)|0);
 var $219=$218;
 var $220=HEAP32[(($219)>>2)];
 var $221=$212<<1;
 var $222=((28928+($221<<2))|0);
 var $223=$222;
 var $224=($217|0)==($223|0);
 if($224){label=65;break;}else{label=63;break;}
 case 63: 
 var $226=$217;
 var $227=($226>>>0)<($179>>>0);
 if($227){label=73;break;}else{label=64;break;}
 case 64: 
 var $229=(($217+12)|0);
 var $230=HEAP32[(($229)>>2)];
 var $231=($230|0)==($3|0);
 if($231){label=65;break;}else{label=73;break;}
 case 65: 
 var $232=($220|0)==($217|0);
 if($232){label=66;break;}else{label=67;break;}
 case 66: 
 var $234=1<<$212;
 var $235=$234^-1;
 var $236=HEAP32[((28888)>>2)];
 var $237=$236&$235;
 HEAP32[((28888)>>2)]=$237;
 label=107;break;
 case 67: 
 var $239=($220|0)==($223|0);
 if($239){label=68;break;}else{label=69;break;}
 case 68: 
 var $_pre63=(($220+8)|0);
 var $_pre_phi64=$_pre63;label=71;break;
 case 69: 
 var $241=$220;
 var $242=($241>>>0)<($179>>>0);
 if($242){label=72;break;}else{label=70;break;}
 case 70: 
 var $244=(($220+8)|0);
 var $245=HEAP32[(($244)>>2)];
 var $246=($245|0)==($3|0);
 if($246){var $_pre_phi64=$244;label=71;break;}else{label=72;break;}
 case 71: 
 var $_pre_phi64;
 var $247=(($217+12)|0);
 HEAP32[(($247)>>2)]=$220;
 HEAP32[(($_pre_phi64)>>2)]=$217;
 label=107;break;
 case 72: 
 _abort();
 throw "Reached an unreachable!";
 case 73: 
 _abort();
 throw "Reached an unreachable!";
 case 74: 
 var $249=$2;
 var $_sum2=((($psize)+(24))|0);
 var $250=(($1+$_sum2)|0);
 var $251=$250;
 var $252=HEAP32[(($251)>>2)];
 var $_sum3=((($psize)+(12))|0);
 var $253=(($1+$_sum3)|0);
 var $254=$253;
 var $255=HEAP32[(($254)>>2)];
 var $256=($255|0)==($249|0);
 if($256){label=80;break;}else{label=75;break;}
 case 75: 
 var $_sum18=((($psize)+(8))|0);
 var $258=(($1+$_sum18)|0);
 var $259=$258;
 var $260=HEAP32[(($259)>>2)];
 var $261=$260;
 var $262=($261>>>0)<($179>>>0);
 if($262){label=79;break;}else{label=76;break;}
 case 76: 
 var $264=(($260+12)|0);
 var $265=HEAP32[(($264)>>2)];
 var $266=($265|0)==($249|0);
 if($266){label=77;break;}else{label=79;break;}
 case 77: 
 var $268=(($255+8)|0);
 var $269=HEAP32[(($268)>>2)];
 var $270=($269|0)==($249|0);
 if($270){label=78;break;}else{label=79;break;}
 case 78: 
 HEAP32[(($264)>>2)]=$255;
 HEAP32[(($268)>>2)]=$260;
 var $R7_1=$255;label=87;break;
 case 79: 
 _abort();
 throw "Reached an unreachable!";
 case 80: 
 var $_sum5=((($psize)+(20))|0);
 var $273=(($1+$_sum5)|0);
 var $274=$273;
 var $275=HEAP32[(($274)>>2)];
 var $276=($275|0)==0;
 if($276){label=81;break;}else{var $R7_0=$275;var $RP9_0=$274;label=82;break;}
 case 81: 
 var $_sum4=((($psize)+(16))|0);
 var $278=(($1+$_sum4)|0);
 var $279=$278;
 var $280=HEAP32[(($279)>>2)];
 var $281=($280|0)==0;
 if($281){var $R7_1=0;label=87;break;}else{var $R7_0=$280;var $RP9_0=$279;label=82;break;}
 case 82: 
 var $RP9_0;
 var $R7_0;
 var $282=(($R7_0+20)|0);
 var $283=HEAP32[(($282)>>2)];
 var $284=($283|0)==0;
 if($284){label=83;break;}else{var $R7_0=$283;var $RP9_0=$282;label=82;break;}
 case 83: 
 var $286=(($R7_0+16)|0);
 var $287=HEAP32[(($286)>>2)];
 var $288=($287|0)==0;
 if($288){label=84;break;}else{var $R7_0=$287;var $RP9_0=$286;label=82;break;}
 case 84: 
 var $290=$RP9_0;
 var $291=($290>>>0)<($179>>>0);
 if($291){label=86;break;}else{label=85;break;}
 case 85: 
 HEAP32[(($RP9_0)>>2)]=0;
 var $R7_1=$R7_0;label=87;break;
 case 86: 
 _abort();
 throw "Reached an unreachable!";
 case 87: 
 var $R7_1;
 var $295=($252|0)==0;
 if($295){label=107;break;}else{label=88;break;}
 case 88: 
 var $_sum15=((($psize)+(28))|0);
 var $297=(($1+$_sum15)|0);
 var $298=$297;
 var $299=HEAP32[(($298)>>2)];
 var $300=((29192+($299<<2))|0);
 var $301=HEAP32[(($300)>>2)];
 var $302=($249|0)==($301|0);
 if($302){label=89;break;}else{label=91;break;}
 case 89: 
 HEAP32[(($300)>>2)]=$R7_1;
 var $cond53=($R7_1|0)==0;
 if($cond53){label=90;break;}else{label=97;break;}
 case 90: 
 var $304=1<<$299;
 var $305=$304^-1;
 var $306=HEAP32[((28892)>>2)];
 var $307=$306&$305;
 HEAP32[((28892)>>2)]=$307;
 label=107;break;
 case 91: 
 var $309=$252;
 var $310=HEAP32[((28904)>>2)];
 var $311=($309>>>0)<($310>>>0);
 if($311){label=95;break;}else{label=92;break;}
 case 92: 
 var $313=(($252+16)|0);
 var $314=HEAP32[(($313)>>2)];
 var $315=($314|0)==($249|0);
 if($315){label=93;break;}else{label=94;break;}
 case 93: 
 HEAP32[(($313)>>2)]=$R7_1;
 label=96;break;
 case 94: 
 var $318=(($252+20)|0);
 HEAP32[(($318)>>2)]=$R7_1;
 label=96;break;
 case 95: 
 _abort();
 throw "Reached an unreachable!";
 case 96: 
 var $321=($R7_1|0)==0;
 if($321){label=107;break;}else{label=97;break;}
 case 97: 
 var $323=$R7_1;
 var $324=HEAP32[((28904)>>2)];
 var $325=($323>>>0)<($324>>>0);
 if($325){label=106;break;}else{label=98;break;}
 case 98: 
 var $327=(($R7_1+24)|0);
 HEAP32[(($327)>>2)]=$252;
 var $_sum16=((($psize)+(16))|0);
 var $328=(($1+$_sum16)|0);
 var $329=$328;
 var $330=HEAP32[(($329)>>2)];
 var $331=($330|0)==0;
 if($331){label=102;break;}else{label=99;break;}
 case 99: 
 var $333=$330;
 var $334=($333>>>0)<($324>>>0);
 if($334){label=101;break;}else{label=100;break;}
 case 100: 
 var $336=(($R7_1+16)|0);
 HEAP32[(($336)>>2)]=$330;
 var $337=(($330+24)|0);
 HEAP32[(($337)>>2)]=$R7_1;
 label=102;break;
 case 101: 
 _abort();
 throw "Reached an unreachable!";
 case 102: 
 var $_sum17=((($psize)+(20))|0);
 var $340=(($1+$_sum17)|0);
 var $341=$340;
 var $342=HEAP32[(($341)>>2)];
 var $343=($342|0)==0;
 if($343){label=107;break;}else{label=103;break;}
 case 103: 
 var $345=$342;
 var $346=HEAP32[((28904)>>2)];
 var $347=($345>>>0)<($346>>>0);
 if($347){label=105;break;}else{label=104;break;}
 case 104: 
 var $349=(($R7_1+20)|0);
 HEAP32[(($349)>>2)]=$342;
 var $350=(($342+24)|0);
 HEAP32[(($350)>>2)]=$R7_1;
 label=107;break;
 case 105: 
 _abort();
 throw "Reached an unreachable!";
 case 106: 
 _abort();
 throw "Reached an unreachable!";
 case 107: 
 var $354=$211|1;
 var $355=(($_0+4)|0);
 HEAP32[(($355)>>2)]=$354;
 var $356=$_0;
 var $357=(($356+$211)|0);
 var $358=$357;
 HEAP32[(($358)>>2)]=$211;
 var $359=HEAP32[((28908)>>2)];
 var $360=($_0|0)==($359|0);
 if($360){label=108;break;}else{var $_1=$211;label=110;break;}
 case 108: 
 HEAP32[((28896)>>2)]=$211;
 label=134;break;
 case 109: 
 var $363=$184&-2;
 HEAP32[(($183)>>2)]=$363;
 var $364=$_02|1;
 var $365=(($_0+4)|0);
 HEAP32[(($365)>>2)]=$364;
 var $366=$_0;
 var $367=(($366+$_02)|0);
 var $368=$367;
 HEAP32[(($368)>>2)]=$_02;
 var $_1=$_02;label=110;break;
 case 110: 
 var $_1;
 var $370=$_1>>>3;
 var $371=($_1>>>0)<256;
 if($371){label=111;break;}else{label=116;break;}
 case 111: 
 var $373=$370<<1;
 var $374=((28928+($373<<2))|0);
 var $375=$374;
 var $376=HEAP32[((28888)>>2)];
 var $377=1<<$370;
 var $378=$376&$377;
 var $379=($378|0)==0;
 if($379){label=112;break;}else{label=113;break;}
 case 112: 
 var $381=$376|$377;
 HEAP32[((28888)>>2)]=$381;
 var $_sum13_pre=((($373)+(2))|0);
 var $_pre=((28928+($_sum13_pre<<2))|0);
 var $F16_0=$375;var $_pre_phi=$_pre;label=115;break;
 case 113: 
 var $_sum14=((($373)+(2))|0);
 var $383=((28928+($_sum14<<2))|0);
 var $384=HEAP32[(($383)>>2)];
 var $385=$384;
 var $386=HEAP32[((28904)>>2)];
 var $387=($385>>>0)<($386>>>0);
 if($387){label=114;break;}else{var $F16_0=$384;var $_pre_phi=$383;label=115;break;}
 case 114: 
 _abort();
 throw "Reached an unreachable!";
 case 115: 
 var $_pre_phi;
 var $F16_0;
 HEAP32[(($_pre_phi)>>2)]=$_0;
 var $390=(($F16_0+12)|0);
 HEAP32[(($390)>>2)]=$_0;
 var $391=(($_0+8)|0);
 HEAP32[(($391)>>2)]=$F16_0;
 var $392=(($_0+12)|0);
 HEAP32[(($392)>>2)]=$375;
 label=134;break;
 case 116: 
 var $394=$_0;
 var $395=$_1>>>8;
 var $396=($395|0)==0;
 if($396){var $I19_0=0;label=119;break;}else{label=117;break;}
 case 117: 
 var $398=($_1>>>0)>16777215;
 if($398){var $I19_0=31;label=119;break;}else{label=118;break;}
 case 118: 
 var $400=((($395)+(1048320))|0);
 var $401=$400>>>16;
 var $402=$401&8;
 var $403=$395<<$402;
 var $404=((($403)+(520192))|0);
 var $405=$404>>>16;
 var $406=$405&4;
 var $407=$406|$402;
 var $408=$403<<$406;
 var $409=((($408)+(245760))|0);
 var $410=$409>>>16;
 var $411=$410&2;
 var $412=$407|$411;
 var $413=(((14)-($412))|0);
 var $414=$408<<$411;
 var $415=$414>>>15;
 var $416=((($413)+($415))|0);
 var $417=$416<<1;
 var $418=((($416)+(7))|0);
 var $419=$_1>>>($418>>>0);
 var $420=$419&1;
 var $421=$420|$417;
 var $I19_0=$421;label=119;break;
 case 119: 
 var $I19_0;
 var $423=((29192+($I19_0<<2))|0);
 var $424=(($_0+28)|0);
 var $I19_0_c=$I19_0;
 HEAP32[(($424)>>2)]=$I19_0_c;
 var $425=(($_0+20)|0);
 HEAP32[(($425)>>2)]=0;
 var $426=(($_0+16)|0);
 HEAP32[(($426)>>2)]=0;
 var $427=HEAP32[((28892)>>2)];
 var $428=1<<$I19_0;
 var $429=$427&$428;
 var $430=($429|0)==0;
 if($430){label=120;break;}else{label=121;break;}
 case 120: 
 var $432=$427|$428;
 HEAP32[((28892)>>2)]=$432;
 HEAP32[(($423)>>2)]=$394;
 var $433=(($_0+24)|0);
 var $_c=$423;
 HEAP32[(($433)>>2)]=$_c;
 var $434=(($_0+12)|0);
 HEAP32[(($434)>>2)]=$_0;
 var $435=(($_0+8)|0);
 HEAP32[(($435)>>2)]=$_0;
 label=134;break;
 case 121: 
 var $437=HEAP32[(($423)>>2)];
 var $438=($I19_0|0)==31;
 if($438){var $443=0;label=123;break;}else{label=122;break;}
 case 122: 
 var $440=$I19_0>>>1;
 var $441=(((25)-($440))|0);
 var $443=$441;label=123;break;
 case 123: 
 var $443;
 var $444=(($437+4)|0);
 var $445=HEAP32[(($444)>>2)];
 var $446=$445&-8;
 var $447=($446|0)==($_1|0);
 if($447){var $T_0_lcssa=$437;label=130;break;}else{label=124;break;}
 case 124: 
 var $448=$_1<<$443;
 var $T_056=$437;var $K20_057=$448;label=126;break;
 case 125: 
 var $450=$K20_057<<1;
 var $451=(($458+4)|0);
 var $452=HEAP32[(($451)>>2)];
 var $453=$452&-8;
 var $454=($453|0)==($_1|0);
 if($454){var $T_0_lcssa=$458;label=130;break;}else{var $T_056=$458;var $K20_057=$450;label=126;break;}
 case 126: 
 var $K20_057;
 var $T_056;
 var $456=$K20_057>>>31;
 var $457=(($T_056+16+($456<<2))|0);
 var $458=HEAP32[(($457)>>2)];
 var $459=($458|0)==0;
 if($459){label=127;break;}else{label=125;break;}
 case 127: 
 var $461=$457;
 var $462=HEAP32[((28904)>>2)];
 var $463=($461>>>0)<($462>>>0);
 if($463){label=129;break;}else{label=128;break;}
 case 128: 
 HEAP32[(($457)>>2)]=$394;
 var $465=(($_0+24)|0);
 var $T_0_c10=$T_056;
 HEAP32[(($465)>>2)]=$T_0_c10;
 var $466=(($_0+12)|0);
 HEAP32[(($466)>>2)]=$_0;
 var $467=(($_0+8)|0);
 HEAP32[(($467)>>2)]=$_0;
 label=134;break;
 case 129: 
 _abort();
 throw "Reached an unreachable!";
 case 130: 
 var $T_0_lcssa;
 var $469=(($T_0_lcssa+8)|0);
 var $470=HEAP32[(($469)>>2)];
 var $471=$T_0_lcssa;
 var $472=HEAP32[((28904)>>2)];
 var $473=($471>>>0)>=($472>>>0);
 var $474=$470;
 var $475=($474>>>0)>=($472>>>0);
 var $or_cond=$473&$475;
 if($or_cond){label=131;break;}else{label=132;break;}
 case 131: 
 var $477=(($470+12)|0);
 HEAP32[(($477)>>2)]=$394;
 HEAP32[(($469)>>2)]=$394;
 var $478=(($_0+8)|0);
 var $_c9=$470;
 HEAP32[(($478)>>2)]=$_c9;
 var $479=(($_0+12)|0);
 var $T_0_c=$T_0_lcssa;
 HEAP32[(($479)>>2)]=$T_0_c;
 var $480=(($_0+24)|0);
 HEAP32[(($480)>>2)]=0;
 label=134;break;
 case 132: 
 _abort();
 throw "Reached an unreachable!";
 case 133: 
 _abort();
 throw "Reached an unreachable!";
 case 134: 
 return;
  default: assert(0, "bad label: " + label);
 }

}

//Func
function _scanexp($f,$pok){
 var label=0;

 label = 1; 
 while(1)switch(label){
 case 1: 
 var $1=(($f+4)|0);
 var $2=HEAP32[(($1)>>2)];
 var $3=(($f+100)|0);
 var $4=HEAP32[(($3)>>2)];
 var $5=($2>>>0)<($4>>>0);
 if($5){label=2;break;}else{label=3;break;}
 case 2: 
 var $7=(($2+1)|0);
 HEAP32[(($1)>>2)]=$7;
 var $8=HEAP8[(($2)>>0)];
 var $9=($8&255);
 var $13=$9;label=4;break;
 case 3: 
 var $11=___shgetc($f);
 var $13=$11;label=4;break;
 case 4: 
 var $13;
 var $14=($13|0)==45;
 if(($13|0)==45|($13|0)==43){ label=5;break;}else{var $neg_0=0;var $c_0=$13;label=11;break;}
 case 5: 
 var $15=HEAP32[(($1)>>2)];
 var $16=($14&1);
 var $17=HEAP32[(($3)>>2)];
 var $18=($15>>>0)<($17>>>0);
 if($18){label=6;break;}else{label=7;break;}
 case 6: 
 var $20=(($15+1)|0);
 HEAP32[(($1)>>2)]=$20;
 var $21=HEAP8[(($15)>>0)];
 var $22=($21&255);
 var $26=$22;label=8;break;
 case 7: 
 var $24=___shgetc($f);
 var $26=$24;label=8;break;
 case 8: 
 var $26;
 var $27=((($26)-(48))|0);
 var $28=($27>>>0)>9;
 var $29=($pok|0)!=0;
 var $or_cond3=$28&$29;
 if($or_cond3){label=9;break;}else{var $neg_0=$16;var $c_0=$26;label=11;break;}
 case 9: 
 var $31=HEAP32[(($3)>>2)];
 var $32=($31|0)==0;
 if($32){var $neg_0=$16;var $c_0=$26;label=11;break;}else{label=10;break;}
 case 10: 
 var $34=HEAP32[(($1)>>2)];
 var $35=((($34)-(1))|0);
 HEAP32[(($1)>>2)]=$35;
 var $neg_0=$16;var $c_0=$26;label=11;break;
 case 11: 
 var $c_0;
 var $neg_0;
 var $37=((($c_0)-(48))|0);
 var $38=($37>>>0)>9;
 if($38){label=12;break;}else{var $c_116=$c_0;var $x_017=0;label=14;break;}
 case 12: 
 var $40=HEAP32[(($3)>>2)];
 var $41=($40|0)==0;
 if($41){var $_0$1=-2147483648;var $_0$0=0;label=31;break;}else{label=13;break;}
 case 13: 
 var $43=HEAP32[(($1)>>2)];
 var $44=((($43)-(1))|0);
 HEAP32[(($1)>>2)]=$44;
 var $_0$1=-2147483648;var $_0$0=0;label=31;break;
 case 14: 
 var $x_017;
 var $c_116;
 var $45=((($x_017)*(10))&-1);
 var $46=((($c_116)-(48))|0);
 var $47=((($46)+($45))|0);
 var $48=HEAP32[(($1)>>2)];
 var $49=HEAP32[(($3)>>2)];
 var $50=($48>>>0)<($49>>>0);
 if($50){label=15;break;}else{label=16;break;}
 case 15: 
 var $52=(($48+1)|0);
 HEAP32[(($1)>>2)]=$52;
 var $53=HEAP8[(($48)>>0)];
 var $54=($53&255);
 var $c_1_be=$54;label=17;break;
 case 16: 
 var $56=___shgetc($f);
 var $c_1_be=$56;label=17;break;
 case 17: 
 var $c_1_be;
 var $57=((($c_1_be)-(48))|0);
 var $58=($57>>>0)<10;
 var $59=($47|0)<214748364;
 var $or_cond5=$58&$59;
 if($or_cond5){var $c_116=$c_1_be;var $x_017=$47;label=14;break;}else{label=18;break;}
 case 18: 
 var $phitmp$0=$47;
 var $phitmp$1=((((($47|0)<0))|0)?-1:0);
 if($58){var $c_29=$c_1_be;var $y_010$1=$phitmp$1;var $y_010$0=$phitmp$0;label=20;break;}else{var $c_2_lcssa=$c_1_be;var $y_0_lcssa$1=$phitmp$1;var $y_0_lcssa$0=$phitmp$0;label=19;break;}
 case 19: 
 var $y_0_lcssa$0;
 var $y_0_lcssa$1;
 var $c_2_lcssa;
 var $61=((($c_2_lcssa)-(48))|0);
 var $62=($61>>>0)<10;
 if($62){label=24;break;}else{label=28;break;}
 case 20: 
 var $y_010$0;
 var $y_010$1;
 var $c_29;
 var $$etemp$0$0=10;
 var $$etemp$0$1=0;
 var $63$0=___muldi3($y_010$0,$y_010$1,$$etemp$0$0,$$etemp$0$1);var $63$1=tempRet0;
 var $64$0=$c_29;
 var $64$1=((((($c_29|0)<0))|0)?-1:0);
 var $$etemp$1$0=-48;
 var $$etemp$1$1=-1;
 var $65$0=_i64Add($64$0,$64$1,$$etemp$1$0,$$etemp$1$1);var $65$1=tempRet0;
 var $66$0=_i64Add($65$0,$65$1,$63$0,$63$1);var $66$1=tempRet0;
 var $67=HEAP32[(($1)>>2)];
 var $68=HEAP32[(($3)>>2)];
 var $69=($67>>>0)<($68>>>0);
 if($69){label=21;break;}else{label=22;break;}
 case 21: 
 var $71=(($67+1)|0);
 HEAP32[(($1)>>2)]=$71;
 var $72=HEAP8[(($67)>>0)];
 var $73=($72&255);
 var $c_2_be=$73;label=23;break;
 case 22: 
 var $75=___shgetc($f);
 var $c_2_be=$75;label=23;break;
 case 23: 
 var $c_2_be;
 var $76=((($c_2_be)-(48))|0);
 var $77=($76>>>0)<10;
 var $$etemp$2$0=2061584302;
 var $$etemp$2$1=21474836;
 var $78=(($66$1|0) < ($$etemp$2$1|0)) | (((($66$1|0) == ($$etemp$2$1|0) & ($66$0>>>0) <  ($$etemp$2$0>>>0))));
 var $or_cond7=$77&$78;
 if($or_cond7){var $c_29=$c_2_be;var $y_010$1=$66$1;var $y_010$0=$66$0;label=20;break;}else{var $c_2_lcssa=$c_2_be;var $y_0_lcssa$1=$66$1;var $y_0_lcssa$0=$66$0;label=19;break;}
 case 24: 
 var $79=HEAP32[(($1)>>2)];
 var $80=HEAP32[(($3)>>2)];
 var $81=($79>>>0)<($80>>>0);
 if($81){label=25;break;}else{label=26;break;}
 case 25: 
 var $83=(($79+1)|0);
 HEAP32[(($1)>>2)]=$83;
 var $84=HEAP8[(($79)>>0)];
 var $85=($84&255);
 var $c_3_be=$85;label=27;break;
 case 26: 
 var $87=___shgetc($f);
 var $c_3_be=$87;label=27;break;
 case 27: 
 var $c_3_be;
 var $88=((($c_3_be)-(48))|0);
 var $89=($88>>>0)<10;
 if($89){label=24;break;}else{label=28;break;}
 case 28: 
 var $90=HEAP32[(($3)>>2)];
 var $91=($90|0)==0;
 if($91){label=30;break;}else{label=29;break;}
 case 29: 
 var $93=HEAP32[(($1)>>2)];
 var $94=((($93)-(1))|0);
 HEAP32[(($1)>>2)]=$94;
 label=30;break;
 case 30: 
 var $96=($neg_0|0)!=0;
 var $$etemp$3$0=0;
 var $$etemp$3$1=0;
 var $97$0=_i64Subtract($$etemp$3$0,$$etemp$3$1,$y_0_lcssa$0,$y_0_lcssa$1);var $97$1=tempRet0;
 var $98$0=($96?$97$0:$y_0_lcssa$0);
 var $98$1=($96?$97$1:$y_0_lcssa$1);
 var $_0$1=$98$1;var $_0$0=$98$0;label=31;break;
 case 31: 
 var $_0$0;
 var $_0$1;
 return (tempRet0=$_0$1,$_0$0);
  default: assert(0, "bad label: " + label);
 }

}

//Func
function _printf_core($f,$fmt,$ap,$nl_arg,$nl_type){
 var label=0;
 var sp=STACKTOP;STACKTOP=(STACKTOP+536)|0; (assert((STACKTOP|0) < (STACK_MAX|0))|0);
 label = 1; 
 while(1)switch(label){
 case 1: 
 var $big_i=sp;
 var $e2_i=(sp)+(504);
 var $buf_i=(sp)+(512);
 var $1=$buf_i;
 var $ebuf0_i=STACKTOP;STACKTOP = (STACKTOP + 12)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $pad_i=STACKTOP;STACKTOP = (STACKTOP + 256)|0;(assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $buf=STACKTOP;STACKTOP = (STACKTOP + 40)|0;(assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $wc=STACKTOP;STACKTOP = (STACKTOP + 8)|0;(assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $mb=STACKTOP;STACKTOP = (STACKTOP + 4)|0;STACKTOP = (((STACKTOP)+7)&-8);(assert((STACKTOP|0) < (STACK_MAX|0))|0);
 var $2=(($buf)|0);
 var $$etemp$0$0=40;
 var $$etemp$0$1=0;

 var $3=($f|0)!=0;
 var $4=(($ap)|0);
 var $5=(($buf+40)|0);
 var $6=(($pad_i)|0);
 var $7=$5;
 var $8=(($buf+39)|0);
 var $9=(($wc)|0);
 var $10=(($wc+4)|0);
 var $11=$wc;
 var $12=(($mb)|0);
 var $13=$e2_i;
 var $14=(($buf_i)|0);
 var $15=(($ebuf0_i)|0);
 var $16=$big_i;
 var $17=(($ebuf0_i+12)|0);
 var $18=(($ebuf0_i+11)|0);
 var $19=$17;
 var $20=((($19)-($1))|0);
 var $21=(((-2)-($1))|0);
 var $22=((($19)+(2))|0);
 var $23=(($big_i)|0);
 var $24=(($big_i+288)|0);
 var $25=(($buf_i+9)|0);
 var $26=$25;
 var $27=(($buf_i+8)|0);
 var $l_0=0;var $cnt_0=0;var $l10n_0=0;var $29=0;var $28=0;var $fmt83=$fmt;label=2;break;
 case 2: 
 var $fmt83;
 var $28;
 var $29;
 var $l10n_0;
 var $cnt_0;
 var $l_0;
 var $30=($cnt_0|0)>-1;
 if($30){label=3;break;}else{var $cnt_1=$cnt_0;label=6;break;}
 case 3: 
 var $32=(((2147483647)-($cnt_0))|0);
 var $33=($l_0|0)>($32|0);
 if($33){label=4;break;}else{label=5;break;}
 case 4: 
 var $35=___errno_location();
 HEAP32[(($35)>>2)]=75;
 var $cnt_1=-1;label=6;break;
 case 5: 
 var $37=((($l_0)+($cnt_0))|0);
 var $cnt_1=$37;label=6;break;
 case 6: 
 var $cnt_1;
 var $39=HEAP8[(($fmt83)>>0)];
 var $40=(($39<<24)>>24)==0;
 if($40){label=365;break;}else{var $fmt82=$fmt83;var $41=$39;label=7;break;}
 case 7: 
 var $41;
 var $fmt82;
 if((($41<<24)>>24)==0){ var $fmt81_lcssa=$fmt82;var $z_0_lcssa=$fmt82;label=11;break;}else if((($41<<24)>>24)==37){ var $fmt81102=$fmt82;var $z_0103=$fmt82;label=9;break;}else{label=8;break;}
 case 8: 
 var $43=(($fmt82+1)|0);
 var $_pre=HEAP8[(($43)>>0)];
 var $fmt82=$43;var $41=$_pre;label=7;break;
 case 9: 
 var $z_0103;
 var $fmt81102;
 var $44=(($fmt81102+1)|0);
 var $45=HEAP8[(($44)>>0)];
 var $46=(($45<<24)>>24)==37;
 if($46){label=10;break;}else{var $fmt81_lcssa=$fmt81102;var $z_0_lcssa=$z_0103;label=11;break;}
 case 10: 
 var $48=(($z_0103+1)|0);
 var $49=(($fmt81102+2)|0);
 var $50=HEAP8[(($49)>>0)];
 var $51=(($50<<24)>>24)==37;
 if($51){var $fmt81102=$49;var $z_0103=$48;label=9;break;}else{var $fmt81_lcssa=$49;var $z_0_lcssa=$48;label=11;break;}
 case 11: 
 var $z_0_lcssa;
 var $fmt81_lcssa;
 var $52=$z_0_lcssa;
 var $53=$fmt83;
 var $54=((($52)-($53))|0);
 if($3){label=12;break;}else{label=13;break;}
 case 12: 
 ___fwritex($fmt83,$54,$f);
 label=13;break;
 case 13: 
 var $57=($z_0_lcssa|0)==($fmt83|0);
 if($57){label=14;break;}else{var $l_0=$54;var $cnt_0=$cnt_1;var $l10n_0=$l10n_0;var $29=$29;var $28=$28;var $fmt83=$fmt81_lcssa;label=2;break;}
 case 14: 
 var $59=(($fmt81_lcssa+1)|0);
 var $60=HEAP8[(($59)>>0)];
 var $61=(($60<<24)>>24);
 var $isdigittmp=((($61)-(48))|0);
 var $isdigit=($isdigittmp>>>0)<10;
 if($isdigit){label=15;break;}else{var $argpos_0=-1;var $l10n_1=$l10n_0;var $storemerge=$59;var $69=$60;label=17;break;}
 case 15: 
 var $63=(($fmt81_lcssa+2)|0);
 var $64=HEAP8[(($63)>>0)];
 var $65=(($64<<24)>>24)==36;
 if($65){label=16;break;}else{var $argpos_0=-1;var $l10n_1=$l10n_0;var $storemerge=$59;var $69=$60;label=17;break;}
 case 16: 
 var $67=(($fmt81_lcssa+3)|0);
 var $_pre260=HEAP8[(($67)>>0)];
 var $argpos_0=$isdigittmp;var $l10n_1=1;var $storemerge=$67;var $69=$_pre260;label=17;break;
 case 17: 
 var $69;
 var $storemerge;
 var $l10n_1;
 var $argpos_0;
 var $70=(($69<<24)>>24);
 var $71=$70&-32;
 var $72=($71|0)==32;
 if($72){var $storemerge2117=$storemerge;var $fl_0118=0;var $73=$70;var $_pr=$69;label=18;break;}else{var $85=$69;var $storemerge2111=$storemerge;var $fl_0113=0;label=20;break;}
 case 18: 
 var $_pr;
 var $73;
 var $fl_0118;
 var $storemerge2117;
 var $74=((($73)-(32))|0);
 var $75=1<<$74;
 var $76=$75&75913;
 var $77=($76|0)==0;
 if($77){var $85=$_pr;var $storemerge2111=$storemerge2117;var $fl_0113=$fl_0118;label=20;break;}else{label=19;break;}
 case 19: 
 var $79=$75|$fl_0118;
 var $80=(($storemerge2117+1)|0);
 var $81=HEAP8[(($80)>>0)];
 var $82=(($81<<24)>>24);
 var $83=$82&-32;
 var $84=($83|0)==32;
 if($84){var $storemerge2117=$80;var $fl_0118=$79;var $73=$82;var $_pr=$81;label=18;break;}else{var $85=$81;var $storemerge2111=$80;var $fl_0113=$79;label=20;break;}
 case 20: 
 var $fl_0113;
 var $storemerge2111;
 var $85;
 var $86=(($85<<24)>>24)==42;
 if($86){label=21;break;}else{label=29;break;}
 case 21: 
 var $88=(($storemerge2111+1)|0);
 var $89=HEAP8[(($88)>>0)];
 var $90=(($89<<24)>>24);
 var $isdigittmp5=((($90)-(48))|0);
 var $isdigit6=($isdigittmp5>>>0)<10;
 if($isdigit6){label=22;break;}else{label=24;break;}
 case 22: 
 var $92=(($storemerge2111+2)|0);
 var $93=HEAP8[(($92)>>0)];
 var $94=(($93<<24)>>24)==36;
 if($94){label=23;break;}else{label=24;break;}
 case 23: 
 var $96=(($nl_type+($isdigittmp5<<2))|0);
 HEAP32[(($96)>>2)]=10;
 var $97=HEAP8[(($88)>>0)];
 var $98=(($97<<24)>>24);
 var $99=((($98)-(48))|0);
 var $100=(($nl_arg+($99<<3))|0);
 var $ld$1$0=(($100)|0);
 var $101$0=HEAP32[(($ld$1$0)>>2)];
 var $ld$2$1=(($100+4)|0);
 var $101$1=HEAP32[(($ld$2$1)>>2)];
 var $101$$SHADOW=HEAPF64[(($100)>>3)];
 var $102$0=$101$0;
 var $102=$102$0;
 var $103=(($storemerge2111+3)|0);
 var $w_0=$102;var $l10n_2=1;var $storemerge7=$103;label=27;break;
 case 24: 
 var $105=($l10n_1|0)==0;
 if($105){label=25;break;}else{var $_0=-1;label=384;break;}
 case 25: 
 if($3){label=26;break;}else{var $w_1=0;var $fl_1=$fl_0113;var $l10n_3=0;var $fmt84=$88;label=32;break;}
 case 26: 
 var $108=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $w_0=$108;var $l10n_2=0;var $storemerge7=$88;label=27;break;
 case 27: 
 var $storemerge7;
 var $l10n_2;
 var $w_0;
 var $110=($w_0|0)<0;
 if($110){label=28;break;}else{var $w_1=$w_0;var $fl_1=$fl_0113;var $l10n_3=$l10n_2;var $fmt84=$storemerge7;label=32;break;}
 case 28: 
 var $112=$fl_0113|8192;
 var $113=(((-$w_0))|0);
 var $w_1=$113;var $fl_1=$112;var $l10n_3=$l10n_2;var $fmt84=$storemerge7;label=32;break;
 case 29: 
 var $115=(($85<<24)>>24);
 var $isdigittmp1_i=((($115)-(48))|0);
 var $isdigit2_i=($isdigittmp1_i>>>0)<10;
 if($isdigit2_i){var $i_03_i=0;var $117=$storemerge2111;var $116=$115;label=30;break;}else{var $w_1=0;var $fl_1=$fl_0113;var $l10n_3=$l10n_1;var $fmt84=$storemerge2111;label=32;break;}
 case 30: 
 var $116;
 var $117;
 var $i_03_i;
 var $118=((($i_03_i)*(10))&-1);
 var $119=((($116)-(48))|0);
 var $120=((($119)+($118))|0);
 var $121=(($117+1)|0);
 var $122=HEAP8[(($121)>>0)];
 var $123=(($122<<24)>>24);
 var $isdigittmp_i=((($123)-(48))|0);
 var $isdigit_i=($isdigittmp_i>>>0)<10;
 if($isdigit_i){var $i_03_i=$120;var $117=$121;var $116=$123;label=30;break;}else{label=31;break;}
 case 31: 
 var $124=($120|0)<0;
 if($124){var $_0=-1;label=384;break;}else{var $w_1=$120;var $fl_1=$fl_0113;var $l10n_3=$l10n_1;var $fmt84=$121;label=32;break;}
 case 32: 
 var $fmt84;
 var $l10n_3;
 var $fl_1;
 var $w_1;
 var $125=HEAP8[(($fmt84)>>0)];
 var $126=(($125<<24)>>24)==46;
 if($126){label=33;break;}else{var $p_0=-1;var $fmt87=$fmt84;label=42;break;}
 case 33: 
 var $128=(($fmt84+1)|0);
 var $129=HEAP8[(($128)>>0)];
 var $130=(($129<<24)>>24)==42;
 if($130){label=34;break;}else{label=40;break;}
 case 34: 
 var $132=(($fmt84+2)|0);
 var $133=HEAP8[(($132)>>0)];
 var $134=(($133<<24)>>24);
 var $isdigittmp3=((($134)-(48))|0);
 var $isdigit4=($isdigittmp3>>>0)<10;
 if($isdigit4){label=35;break;}else{label=37;break;}
 case 35: 
 var $136=(($fmt84+3)|0);
 var $137=HEAP8[(($136)>>0)];
 var $138=(($137<<24)>>24)==36;
 if($138){label=36;break;}else{label=37;break;}
 case 36: 
 var $140=(($nl_type+($isdigittmp3<<2))|0);
 HEAP32[(($140)>>2)]=10;
 var $141=HEAP8[(($132)>>0)];
 var $142=(($141<<24)>>24);
 var $143=((($142)-(48))|0);
 var $144=(($nl_arg+($143<<3))|0);
 var $ld$3$0=(($144)|0);
 var $145$0=HEAP32[(($ld$3$0)>>2)];
 var $ld$4$1=(($144+4)|0);
 var $145$1=HEAP32[(($ld$4$1)>>2)];
 var $145$$SHADOW=HEAPF64[(($144)>>3)];
 var $146$0=$145$0;
 var $146=$146$0;
 var $147=(($fmt84+4)|0);
 var $p_0=$146;var $fmt87=$147;label=42;break;
 case 37: 
 var $149=($l10n_3|0)==0;
 if($149){label=38;break;}else{var $_0=-1;label=384;break;}
 case 38: 
 if($3){label=39;break;}else{var $p_0=0;var $fmt87=$132;label=42;break;}
 case 39: 
 var $152=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $p_0=$152;var $fmt87=$132;label=42;break;
 case 40: 
 var $154=(($129<<24)>>24);
 var $isdigittmp1_i22=((($154)-(48))|0);
 var $isdigit2_i23=($isdigittmp1_i22>>>0)<10;
 if($isdigit2_i23){var $i_03_i24=0;var $156=$128;var $155=$154;label=41;break;}else{var $p_0=0;var $fmt87=$128;label=42;break;}
 case 41: 
 var $155;
 var $156;
 var $i_03_i24;
 var $157=((($i_03_i24)*(10))&-1);
 var $158=((($155)-(48))|0);
 var $159=((($158)+($157))|0);
 var $160=(($156+1)|0);
 var $161=HEAP8[(($160)>>0)];
 var $162=(($161<<24)>>24);
 var $isdigittmp_i25=((($162)-(48))|0);
 var $isdigit_i26=($isdigittmp_i25>>>0)<10;
 if($isdigit_i26){var $i_03_i24=$159;var $156=$160;var $155=$162;label=41;break;}else{var $p_0=$159;var $fmt87=$160;label=42;break;}
 case 42: 
 var $fmt87;
 var $p_0;
 var $st_0=0;var $fmt86=$fmt87;label=43;break;
 case 43: 
 var $fmt86;
 var $st_0;
 var $164=HEAP8[(($fmt86)>>0)];
 var $165=(($164<<24)>>24);
 var $166=((($165)-(65))|0);
 var $167=($166>>>0)>57;
 if($167){var $_0=-1;label=384;break;}else{label=44;break;}
 case 44: 
 var $169=(($fmt86+1)|0);
 var $170=((424+((($st_0)*(58))&-1)+$166)|0);
 var $171=HEAP8[(($170)>>0)];
 var $172=($171&255);
 var $173=((($172)-(1))|0);
 var $174=($173>>>0)<8;
 if($174){var $st_0=$172;var $fmt86=$169;label=43;break;}else{label=45;break;}
 case 45: 
 var $176=(($171<<24)>>24)==0;
 if($176){var $_0=-1;label=384;break;}else{label=46;break;}
 case 46: 
 var $178=(($171<<24)>>24)==19;
 var $179=($argpos_0|0)>-1;
 if($178){label=47;break;}else{label=48;break;}
 case 47: 
 if($179){var $_0=-1;label=384;break;}else{var $238=$29;var $237=$28;label=63;break;}
 case 48: 
 if($179){label=49;break;}else{label=50;break;}
 case 49: 
 var $183=(($nl_type+($argpos_0<<2))|0);
 HEAP32[(($183)>>2)]=$172;
 var $184=(($nl_arg+($argpos_0<<3))|0);
 var $ld$5$0=(($184)|0);
 var $185$0=HEAP32[(($ld$5$0)>>2)];
 var $ld$6$1=(($184+4)|0);
 var $185$1=HEAP32[(($ld$6$1)>>2)];
 var $185$$SHADOW=HEAPF64[(($184)>>3)];
 var $186$0=$185$0;
 var $186=$186$0;
 var $187$0=$185$1;
 var $187$1=0;
 var $188$0=$187$0;
 var $188=$188$0;
 var $238=$188;var $237=$186;label=63;break;
 case 50: 
 if($3){label=51;break;}else{var $_0=0;label=384;break;}
 case 51: 
 var $191=($171&255)>20;
 if($191){var $243=$28;var $242=$29;var $241=$164;label=65;break;}else{label=52;break;}
 case 52: 
 switch(($172|0)){case 9:{ label=53;break;}case 10:{ label=54;break;}case 11:{ label=55;break;}case 12:{ label=56;break;}case 13:{ label=57;break;}case 14:{ label=58;break;}case 15:{ label=59;break;}case 16:{ label=60;break;}case 17:{ label=61;break;}case 18:{ label=62;break;}default:{var $240=$28;var $239=$29;label=64;break;}}break;
 case 53: 
 var $194=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $195=$194;
 var $240=$195;var $239=$29;label=64;break;
 case 54: 
 var $197=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $198$0=$197;
 var $198$1=((((($197|0)<0))|0)?-1:0);
 var $199$0=$198$1;
 var $199$1=0;
 var $200$0=$199$0;
 var $200=$200$0;
 var $240=$197;var $239=$200;label=64;break;
 case 55: 
 var $202=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $240=$202;var $239=0;label=64;break;
 case 56: 
 var $204$0=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $204$1=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $205$0=$204$0;
 var $205=$205$0;
 var $206$0=$204$1;
 var $206$1=0;
 var $207$0=$206$0;
 var $207=$207$0;
 var $240=$205;var $239=$207;label=64;break;
 case 57: 
 var $209=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $210=(($209)&65535);
 var $211$0=(($210<<16)>>16);
 var $211$1=(((((($210<<16)>>16)<0))|0)?-1:0);
 var $212=(($210<<16)>>16);
 var $213$0=$211$1;
 var $213$1=0;
 var $214$0=$213$0;
 var $214=$214$0;
 var $240=$212;var $239=$214;label=64;break;
 case 58: 
 var $216=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $_mask1_i31=$216&65535;
 var $240=$_mask1_i31;var $239=0;label=64;break;
 case 59: 
 var $218=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $219=(($218)&255);
 var $220$0=(($219<<24)>>24);
 var $220$1=(((((($219<<24)>>24)<0))|0)?-1:0);
 var $221=(($219<<24)>>24);
 var $222$0=$220$1;
 var $222$1=0;
 var $223$0=$222$0;
 var $223=$223$0;
 var $240=$221;var $239=$223;label=64;break;
 case 60: 
 var $225=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $_mask_i32=$225&255;
 var $240=$_mask_i32;var $239=0;label=64;break;
 case 61: 
 var $227=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAPF64[(((HEAP32[(($4)>>2)])+(tempInt))>>3)]);
 HEAPF64[(tempDoublePtr)>>3]=$227; var $228$0=HEAP32[((tempDoublePtr)>>2)];var $228$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 var $229$0=$228$0;
 var $229=$229$0;
 var $230$0=$228$1;
 var $230$1=0;
 var $231$0=$230$0;
 var $231=$231$0;
 var $240=$229;var $239=$231;label=64;break;
 case 62: 
 var $232=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAPF64[(((HEAP32[(($4)>>2)])+(tempInt))>>3)]);
 HEAPF64[(tempDoublePtr)>>3]=$232; var $233$0=HEAP32[((tempDoublePtr)>>2)];var $233$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 var $234$0=$233$0;
 var $234=$234$0;
 var $235$0=$233$1;
 var $235$1=0;
 var $236$0=$235$0;
 var $236=$236$0;
 var $240=$234;var $239=$236;label=64;break;
 case 63: 
 var $237;
 var $238;
 if($3){var $240=$237;var $239=$238;label=64;break;}else{var $l_0=$54;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$238;var $28=$237;var $fmt83=$169;label=2;break;}
 case 64: 
 var $239;
 var $240;
 var $_pre261=HEAP8[(($fmt86)>>0)];
 var $243=$240;var $242=$239;var $241=$_pre261;label=65;break;
 case 65: 
 var $241;
 var $242;
 var $243;
 var $244=(($241<<24)>>24);
 var $245=($st_0|0)!=0;
 var $246=$244&15;
 var $247=($246|0)==3;
 var $or_cond9=$245&$247;
 var $248=$244&-33;
 var $t_0=($or_cond9?$248:$244);
 var $249=$fl_1&8192;
 var $250=($249|0)==0;
 var $251=$fl_1&-65537;
 var $fl_1_=($250?$fl_1:$251);
 switch(($t_0|0)){case 67:{ label=110;break;}case 83:{ label=111;break;}case 101:case 102:case 103:case 97:case 69:case 70:case 71:case 65:{ label=132;break;}case 110:{ label=66;break;}case 112:{ label=74;break;}case 120:case 88:{ var $t_1=$t_0;var $p_1=$p_0;var $fl_3=$fl_1_;label=75;break;}case 111:{ label=79;break;}case 100:case 105:{ label=82;break;}case 117:{ var $pl_0=0;var $prefix_0=3816;var $330=$242;var $329=$243;label=86;break;}case 99:{ label=93;break;}case 109:{ label=94;break;}case 115:{ label=95;break;}default:{var $pl_2=0;var $prefix_2=3816;var $p_5=$p_0;var $fl_6=$fl_1_;var $z_2=$5;var $a_2=$fmt83;var $1132=$242;var $1131=$243;label=345;break;}}break;
 case 66: 
 switch(($st_0|0)){case 0:{ label=67;break;}case 1:{ label=68;break;}case 2:{ label=69;break;}case 3:{ label=70;break;}case 4:{ label=71;break;}case 6:{ label=72;break;}case 7:{ label=73;break;}default:{var $l_0=$54;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$242;var $28=$243;var $fmt83=$169;label=2;break;}}break;
 case 67: 
 var $254=$243;
 HEAP32[(($254)>>2)]=$cnt_1;
 var $l_0=$54;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$242;var $28=$243;var $fmt83=$169;label=2;break;
 case 68: 
 var $256=$243;
 HEAP32[(($256)>>2)]=$cnt_1;
 var $l_0=$54;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$242;var $28=$243;var $fmt83=$169;label=2;break;
 case 69: 
 var $258$0=$cnt_1;
 var $258$1=((((($cnt_1|0)<0))|0)?-1:0);
 var $259=$243;
 var $st$7$0=(($259)|0);
 HEAP32[(($st$7$0)>>2)]=$258$0;
 var $st$8$1=(($259+4)|0);
 HEAP32[(($st$8$1)>>2)]=$258$1;
 var $l_0=$54;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$242;var $28=$243;var $fmt83=$169;label=2;break;
 case 70: 
 var $261=(($cnt_1)&65535);
 var $262=$243;
 HEAP16[(($262)>>1)]=$261;
 var $l_0=$54;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$242;var $28=$243;var $fmt83=$169;label=2;break;
 case 71: 
 var $264=(($cnt_1)&255);
 var $265=$243;
 HEAP8[(($265)>>0)]=$264;
 var $l_0=$54;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$242;var $28=$243;var $fmt83=$169;label=2;break;
 case 72: 
 var $267=$243;
 HEAP32[(($267)>>2)]=$cnt_1;
 var $l_0=$54;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$242;var $28=$243;var $fmt83=$169;label=2;break;
 case 73: 
 var $269$0=$cnt_1;
 var $269$1=((((($cnt_1|0)<0))|0)?-1:0);
 var $270=$243;
 var $st$9$0=(($270)|0);
 HEAP32[(($st$9$0)>>2)]=$269$0;
 var $st$10$1=(($270+4)|0);
 HEAP32[(($st$10$1)>>2)]=$269$1;
 var $l_0=$54;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$242;var $28=$243;var $fmt83=$169;label=2;break;
 case 74: 
 var $272=($p_0>>>0)>8;
 var $273=($272?$p_0:8);
 var $274=$fl_1_|8;
 var $t_1=120;var $p_1=$273;var $fl_3=$274;label=75;break;
 case 75: 
 var $fl_3;
 var $p_1;
 var $t_1;
 var $276$0=$242;
 var $276$1=0;
 var $277$0=0;
 var $277$1=$276$0;
 var $278$0=$243;
 var $278$1=0;
 var $279$0=$277$0|$278$0;
 var $279$1=$277$1|$278$1;
 var $280=$t_1&32;
 var $$etemp$11$0=0;
 var $$etemp$11$1=0;
 var $281=(($279$0|0) == ($$etemp$11$0|0)) & (($279$1|0) == ($$etemp$11$1|0));
 if($281){var $pl_1=0;var $prefix_1=3816;var $p_2=$p_1;var $fl_4=$fl_3;var $a_0=$5;var $351=$242;var $350=$243;label=91;break;}else{var $_012_i=$5;var $_03_i$1=$279$1;var $_03_i$0=$279$0;label=76;break;}
 case 76: 
 var $_03_i$0;
 var $_03_i$1;
 var $_012_i;
 var $_0_tr_i$0=$_03_i$0;
 var $_0_tr_i=$_0_tr_i$0;
 var $282=$_0_tr_i&15;
 var $283=((8+$282)|0);
 var $284=HEAP8[(($283)>>0)];
 var $285=($284&255);
 var $286=$285|$280;
 var $287=(($286)&255);
 var $288=((($_012_i)-(1))|0);
 HEAP8[(($288)>>0)]=$287;
 var $289$0=($_03_i$0>>>4)|($_03_i$1<<28);
 var $289$1=($_03_i$1>>>4)|(0<<28);
 var $$etemp$12$0=0;
 var $$etemp$12$1=0;
 var $290=(($289$0|0) == ($$etemp$12$0|0)) & (($289$1|0) == ($$etemp$12$1|0));
 if($290){label=77;break;}else{var $_012_i=$288;var $_03_i$1=$289$1;var $_03_i$0=$289$0;label=76;break;}
 case 77: 
 var $291=$fl_3&8;
 var $292=($291|0)==0;
 if($292){var $pl_1=0;var $prefix_1=3816;var $p_2=$p_1;var $fl_4=$fl_3;var $a_0=$288;var $351=$242;var $350=$243;label=91;break;}else{label=78;break;}
 case 78: 
 var $294=$t_1>>4;
 var $295=((3816+$294)|0);
 var $pl_1=2;var $prefix_1=$295;var $p_2=$p_1;var $fl_4=$fl_3;var $a_0=$288;var $351=$242;var $350=$243;label=91;break;
 case 79: 
 var $297$0=$242;
 var $297$1=0;
 var $298$0=0;
 var $298$1=$297$0;
 var $299$0=$243;
 var $299$1=0;
 var $300$0=$298$0|$299$0;
 var $300$1=$298$1|$299$1;
 var $$etemp$13$0=0;
 var $$etemp$13$1=0;
 var $301=(($300$0|0) == ($$etemp$13$0|0)) & (($300$1|0) == ($$etemp$13$1|0));
 if($301){var $_0_lcssa_i45=$5;label=81;break;}else{var $_012_i43$1=$300$1;var $_012_i43$0=$300$0;var $_03_i42=$5;label=80;break;}
 case 80: 
 var $_03_i42;
 var $_012_i43$0;
 var $_012_i43$1;
 var $$etemp$14$0=7;
 var $$etemp$14$1=0;
 var $302$0=$_012_i43$0&$$etemp$14$0;
 var $302$1=$_012_i43$1&$$etemp$14$1;
 var $$etemp$15$0=48;
 var $$etemp$15$1=0;
 var $303$0=$302$0|$$etemp$15$0;
 var $303$1=$302$1|$$etemp$15$1;
 var $304$0=$303$0;
 var $304=$304$0&255;
 var $305=((($_03_i42)-(1))|0);
 HEAP8[(($305)>>0)]=$304;
 var $306$0=($_012_i43$0>>>3)|($_012_i43$1<<29);
 var $306$1=($_012_i43$1>>>3)|(0<<29);
 var $$etemp$16$0=0;
 var $$etemp$16$1=0;
 var $307=(($306$0|0) == ($$etemp$16$0|0)) & (($306$1|0) == ($$etemp$16$1|0));
 if($307){var $_0_lcssa_i45=$305;label=81;break;}else{var $_012_i43$1=$306$1;var $_012_i43$0=$306$0;var $_03_i42=$305;label=80;break;}
 case 81: 
 var $_0_lcssa_i45;
 var $308=$fl_1_&8;
 var $309=($308|0)==0;
 var $or_cond13=$309|$301;
 var $_19=($or_cond13?3816:3821);
 var $310=($or_cond13&1);
 var $_20=$310^1;
 var $pl_1=$_20;var $prefix_1=$_19;var $p_2=$p_0;var $fl_4=$fl_1_;var $a_0=$_0_lcssa_i45;var $351=$242;var $350=$243;label=91;break;
 case 82: 
 var $312$0=$242;
 var $312$1=0;
 var $313$0=0;
 var $313$1=$312$0;
 var $314$0=$243;
 var $314$1=0;
 var $315$0=$313$0|$314$0;
 var $315$1=$313$1|$314$1;
 var $$etemp$17$0=0;
 var $$etemp$17$1=0;
 var $316=(($315$1|0) < ($$etemp$17$1|0)) | (((($315$1|0) == ($$etemp$17$1|0) & ($315$0>>>0) <  ($$etemp$17$0>>>0))));
 if($316){label=83;break;}else{label=84;break;}
 case 83: 
 var $$etemp$18$0=0;
 var $$etemp$18$1=0;
 var $318$0=_i64Subtract($$etemp$18$0,$$etemp$18$1,$315$0,$315$1);var $318$1=tempRet0;
 var $319$0=$318$0;
 var $319=$319$0;
 var $320$0=$318$1;
 var $320$1=0;
 var $321$0=$320$0;
 var $321=$321$0;
 var $pl_0=1;var $prefix_0=3816;var $330=$321;var $329=$319;label=86;break;
 case 84: 
 var $323=$fl_1_&2048;
 var $324=($323|0)==0;
 if($324){label=85;break;}else{var $pl_0=1;var $prefix_0=3817;var $330=$242;var $329=$243;label=86;break;}
 case 85: 
 var $326=$fl_1_&1;
 var $327=($326|0)==0;
 var $_=($327?3816:3818);
 var $pl_0=$326;var $prefix_0=$_;var $330=$242;var $329=$243;label=86;break;
 case 86: 
 var $329;
 var $330;
 var $prefix_0;
 var $pl_0;
 var $331$0=$330;
 var $331$1=0;
 var $332$0=0;
 var $332$1=$331$0;
 var $333$0=$329;
 var $333$1=0;
 var $334$0=$332$0|$333$0;
 var $334$1=$332$1|$333$1;
 var $$etemp$19$0=-1;
 var $$etemp$19$1=0;
 var $335=(($334$1>>>0) > ($$etemp$19$1>>>0)) | (((($334$1>>>0) == ($$etemp$19$1>>>0) & ($334$0>>>0) >  ($$etemp$19$0>>>0))));
 if($335){var $_014_i$1=$334$1;var $_014_i$0=$334$0;var $_05_i=$5;label=87;break;}else{var $_01_lcssa_off0_i=$329;var $_0_lcssa_i47=$5;label=89;break;}
 case 87: 
 var $_05_i;
 var $_014_i$0;
 var $_014_i$1;
 var $$etemp$20$0=10;
 var $$etemp$20$1=0;
 var $336$0=___uremdi3($_014_i$0,$_014_i$1,$$etemp$20$0,$$etemp$20$1);var $336$1=tempRet0;
 var $$etemp$21$0=48;
 var $$etemp$21$1=0;
 var $337$0=$336$0|$$etemp$21$0;
 var $337$1=$336$1|$$etemp$21$1;
 var $338$0=$337$0;
 var $338=$338$0&255;
 var $339=((($_05_i)-(1))|0);
 HEAP8[(($339)>>0)]=$338;
 var $$etemp$22$0=10;
 var $$etemp$22$1=0;
 var $340$0=___udivdi3($_014_i$0,$_014_i$1,$$etemp$22$0,$$etemp$22$1);var $340$1=tempRet0;
 var $$etemp$23$0=-1;
 var $$etemp$23$1=9;
 var $341=(($_014_i$1>>>0) > ($$etemp$23$1>>>0)) | (((($_014_i$1>>>0) == ($$etemp$23$1>>>0) & ($_014_i$0>>>0) >  ($$etemp$23$0>>>0))));
 if($341){var $_014_i$1=$340$1;var $_014_i$0=$340$0;var $_05_i=$339;label=87;break;}else{label=88;break;}
 case 88: 
 var $extract_t_i$0=$340$0;
 var $extract_t_i=$extract_t_i$0;
 var $_01_lcssa_off0_i=$extract_t_i;var $_0_lcssa_i47=$339;label=89;break;
 case 89: 
 var $_0_lcssa_i47;
 var $_01_lcssa_off0_i;
 var $343=($_01_lcssa_off0_i|0)==0;
 if($343){var $pl_1=$pl_0;var $prefix_1=$prefix_0;var $p_2=$p_0;var $fl_4=$fl_1_;var $a_0=$_0_lcssa_i47;var $351=$330;var $350=$329;label=91;break;}else{var $_12_i=$_0_lcssa_i47;var $y_03_i=$_01_lcssa_off0_i;label=90;break;}
 case 90: 
 var $y_03_i;
 var $_12_i;
 var $344=(((($y_03_i>>>0))%(10))&-1);
 var $345=$344|48;
 var $346=(($345)&255);
 var $347=((($_12_i)-(1))|0);
 HEAP8[(($347)>>0)]=$346;
 var $348=(((($y_03_i>>>0))/(10))&-1);
 var $349=($y_03_i>>>0)<10;
 if($349){var $pl_1=$pl_0;var $prefix_1=$prefix_0;var $p_2=$p_0;var $fl_4=$fl_1_;var $a_0=$347;var $351=$330;var $350=$329;label=91;break;}else{var $_12_i=$347;var $y_03_i=$348;label=90;break;}
 case 91: 
 var $350;
 var $351;
 var $a_0;
 var $fl_4;
 var $p_2;
 var $prefix_1;
 var $pl_1;
 var $352=($p_2|0)>-1;
 var $353=$fl_4&-65537;
 var $_fl_4=($352?$353:$fl_4);
 var $354$0=$351;
 var $354$1=0;
 var $355$0=0;
 var $355$1=$354$0;
 var $356$0=$350;
 var $356$1=0;
 var $357$0=$355$0|$356$0;
 var $357$1=$355$1|$356$1;
 var $$etemp$24$0=0;
 var $$etemp$24$1=0;
 var $358=(($357$0|0) != ($$etemp$24$0|0)) | (($357$1|0) != ($$etemp$24$1|0));
 var $359=($p_2|0)!=0;
 var $or_cond=$358|$359;
 if($or_cond){label=92;break;}else{var $pl_2=$pl_1;var $prefix_2=$prefix_1;var $p_5=0;var $fl_6=$_fl_4;var $z_2=$5;var $a_2=$5;var $1132=$351;var $1131=$350;label=345;break;}
 case 92: 
 var $361=$a_0;
 var $362=((($7)-($361))|0);
 var $363=($358&1);
 var $364=$363^1;
 var $365=((($364)+($362))|0);
 var $366=($p_2|0)>($365|0);
 var $p_2_=($366?$p_2:$365);
 var $pl_2=$pl_1;var $prefix_2=$prefix_1;var $p_5=$p_2_;var $fl_6=$_fl_4;var $z_2=$5;var $a_2=$a_0;var $1132=$351;var $1131=$350;label=345;break;
 case 93: 
 var $368=(($243)&255);
 HEAP8[(($8)>>0)]=$368;
 var $pl_2=0;var $prefix_2=3816;var $p_5=1;var $fl_6=$251;var $z_2=$5;var $a_2=$8;var $1132=$242;var $1131=$243;label=345;break;
 case 94: 
 var $370=___errno_location();
 var $371=HEAP32[(($370)>>2)];
 var $372=_strerror($371);
 var $a_1=$372;label=96;break;
 case 95: 
 var $374=$243;
 var $375=($243|0)==0;
 var $_15=($375?7896:$374);
 var $a_1=$_15;label=96;break;
 case 96: 
 var $a_1;
 var $377=$a_1;
 var $378=$377&3;
 var $379=($378|0)!=0;
 var $380=($p_0|0)!=0;
 var $or_cond11_i=$379&$380;
 if($or_cond11_i){var $_012_i1=$p_0;var $s_013_i=$a_1;label=97;break;}else{var $_0_lcssa_i3=$p_0;var $s_0_lcssa_i=$a_1;var $_lcssa_i=$380;label=99;break;}
 case 97: 
 var $s_013_i;
 var $_012_i1;
 var $381=HEAP8[(($s_013_i)>>0)];
 var $382=(($381<<24)>>24)==0;
 if($382){var $s_2_i=$s_013_i;var $_3_i6=$_012_i1;label=107;break;}else{label=98;break;}
 case 98: 
 var $384=(($s_013_i+1)|0);
 var $385=((($_012_i1)-(1))|0);
 var $386=$384;
 var $387=$386&3;
 var $388=($387|0)!=0;
 var $389=($385|0)!=0;
 var $or_cond_i2=$388&$389;
 if($or_cond_i2){var $_012_i1=$385;var $s_013_i=$384;label=97;break;}else{var $_0_lcssa_i3=$385;var $s_0_lcssa_i=$384;var $_lcssa_i=$389;label=99;break;}
 case 99: 
 var $_lcssa_i;
 var $s_0_lcssa_i;
 var $_0_lcssa_i3;
 if($_lcssa_i){label=100;break;}else{var $s_2_i=$s_0_lcssa_i;var $_3_i6=0;label=107;break;}
 case 100: 
 var $_pre19=HEAP8[(($s_0_lcssa_i)>>0)];
 var $phitmp=(($_pre19<<24)>>24)==0;
 if($phitmp){var $s_2_i=$s_0_lcssa_i;var $_3_i6=$_0_lcssa_i3;label=107;break;}else{label=101;break;}
 case 101: 
 var $391=$s_0_lcssa_i;
 var $392=($_0_lcssa_i3>>>0)>3;
 if($392){var $_15_i=$_0_lcssa_i3;var $w_06_i=$391;label=102;break;}else{var $_1_lcssa_i=$_0_lcssa_i3;var $w_0_lcssa_i=$391;label=104;break;}
 case 102: 
 var $w_06_i;
 var $_15_i;
 var $393=HEAP32[(($w_06_i)>>2)];
 var $394=((($393)-(16843009))|0);
 var $395=$393&-2139062144;
 var $396=$395^-2139062144;
 var $397=$396&$394;
 var $398=($397|0)==0;
 if($398){label=103;break;}else{var $_1_lcssa_i=$_15_i;var $w_0_lcssa_i=$w_06_i;label=104;break;}
 case 103: 
 var $400=(($w_06_i+4)|0);
 var $401=((($_15_i)-(4))|0);
 var $402=($401>>>0)>3;
 if($402){var $_15_i=$401;var $w_06_i=$400;label=102;break;}else{var $_1_lcssa_i=$401;var $w_0_lcssa_i=$400;label=104;break;}
 case 104: 
 var $w_0_lcssa_i;
 var $_1_lcssa_i;
 var $403=$w_0_lcssa_i;
 var $404=($_1_lcssa_i|0)==0;
 if($404){var $s_2_i=$403;var $_3_i6=0;label=107;break;}else{var $_22_i=$_1_lcssa_i;var $s_13_i=$403;label=105;break;}
 case 105: 
 var $s_13_i;
 var $_22_i;
 var $405=HEAP8[(($s_13_i)>>0)];
 var $406=(($405<<24)>>24)==0;
 if($406){var $s_2_i=$s_13_i;var $_3_i6=$_22_i;label=107;break;}else{label=106;break;}
 case 106: 
 var $408=(($s_13_i+1)|0);
 var $409=((($_22_i)-(1))|0);
 var $410=($409|0)==0;
 if($410){var $s_2_i=$408;var $_3_i6=0;label=107;break;}else{var $_22_i=$409;var $s_13_i=$408;label=105;break;}
 case 107: 
 var $_3_i6;
 var $s_2_i;
 var $411=($_3_i6|0)!=0;
 var $412=($411?$s_2_i:0);
 var $413=($412|0)==0;
 if($413){label=108;break;}else{label=109;break;}
 case 108: 
 var $415=(($a_1+$p_0)|0);
 var $pl_2=0;var $prefix_2=3816;var $p_5=$p_0;var $fl_6=$251;var $z_2=$415;var $a_2=$a_1;var $1132=$242;var $1131=$243;label=345;break;
 case 109: 
 var $417=$412;
 var $418=((($417)-($377))|0);
 var $pl_2=0;var $prefix_2=3816;var $p_5=$418;var $fl_6=$251;var $z_2=$412;var $a_2=$a_1;var $1132=$242;var $1131=$243;label=345;break;
 case 110: 
 HEAP32[(($9)>>2)]=$243;
 HEAP32[(($10)>>2)]=0;
 var $423=$11;var $p_4266=-1;var $422=$9;label=112;break;
 case 111: 
 var $420=$243;
 var $421=($p_0|0)==0;
 if($421){var $438=$420;var $437=$243;var $i_0_lcssa267=0;label=117;break;}else{var $423=$243;var $p_4266=$p_0;var $422=$420;label=112;break;}
 case 112: 
 var $422;
 var $p_4266;
 var $423;
 var $l_1165=0;var $i_0166=0;var $ws_0167=$422;label=113;break;
 case 113: 
 var $ws_0167;
 var $i_0166;
 var $l_1165;
 var $425=HEAP32[(($ws_0167)>>2)];
 var $426=($425|0)==0;
 if($426){var $l_2=$l_1165;var $i_0_lcssa=$i_0166;label=116;break;}else{label=114;break;}
 case 114: 
 var $428=_wcrtomb($12,$425);
 var $429=($428|0)<0;
 var $430=((($p_4266)-($i_0166))|0);
 var $431=($428>>>0)>($430>>>0);
 var $or_cond17=$429|$431;
 if($or_cond17){var $l_2=$428;var $i_0_lcssa=$i_0166;label=116;break;}else{label=115;break;}
 case 115: 
 var $433=(($ws_0167+4)|0);
 var $434=((($428)+($i_0166))|0);
 var $435=($p_4266>>>0)>($434>>>0);
 if($435){var $l_1165=$428;var $i_0166=$434;var $ws_0167=$433;label=113;break;}else{var $l_2=$428;var $i_0_lcssa=$434;label=116;break;}
 case 116: 
 var $i_0_lcssa;
 var $l_2;
 var $436=($l_2|0)<0;
 if($436){var $_0=-1;label=384;break;}else{var $438=$422;var $437=$423;var $i_0_lcssa267=$i_0_lcssa;label=117;break;}
 case 117: 
 var $i_0_lcssa267;
 var $437;
 var $438;
 var $$etemp$25$0=256;
 var $$etemp$25$1=0;

 var $439=$fl_1_&73728;
 var $440=($439|0)==0;
 var $441=($w_1|0)>($i_0_lcssa267|0);
 var $or_cond_i58=$440&$441;
 if($or_cond_i58){label=118;break;}else{label=122;break;}
 case 118: 
 var $443=((($w_1)-($i_0_lcssa267))|0);
 var $444=($443>>>0)>256;
 var $445=($444?256:$443);
 _memset($6, 32, $445)|0;
 var $446=($443>>>0)>255;
 if($446){var $_01_i60=$443;label=119;break;}else{var $_0_lcssa_i62=$443;label=121;break;}
 case 119: 
 var $_01_i60;
 ___fwritex($6,256,$f);
 var $447=((($_01_i60)-(256))|0);
 var $448=($447>>>0)>255;
 if($448){var $_01_i60=$447;label=119;break;}else{label=120;break;}
 case 120: 
 var $449=$443&255;
 var $_0_lcssa_i62=$449;label=121;break;
 case 121: 
 var $_0_lcssa_i62;
 ___fwritex($6,$_0_lcssa_i62,$f);
 label=122;break;
 case 122: 
 var $451=($i_0_lcssa267|0)==0;
 if($451){label=126;break;}else{var $i_1174=0;var $ws_1175=$438;label=123;break;}
 case 123: 
 var $ws_1175;
 var $i_1174;
 var $452=HEAP32[(($ws_1175)>>2)];
 var $453=($452|0)==0;
 if($453){label=126;break;}else{label=124;break;}
 case 124: 
 var $455=_wcrtomb($12,$452);
 var $456=((($455)+($i_1174))|0);
 var $457=($456|0)>($i_0_lcssa267|0);
 if($457){label=126;break;}else{label=125;break;}
 case 125: 
 var $458=(($ws_1175+4)|0);
 ___fwritex($12,$455,$f);
 var $459=($456>>>0)<($i_0_lcssa267>>>0);
 if($459){var $i_1174=$456;var $ws_1175=$458;label=123;break;}else{label=126;break;}
 case 126: 
 var $$etemp$26$0=256;
 var $$etemp$26$1=0;

 var $460=($439|0)==8192;
 var $or_cond_i65=$460&$441;
 if($or_cond_i65){label=127;break;}else{label=131;break;}
 case 127: 
 var $462=((($w_1)-($i_0_lcssa267))|0);
 var $463=($462>>>0)>256;
 var $464=($463?256:$462);
 _memset($6, 32, $464)|0;
 var $465=($462>>>0)>255;
 if($465){var $_01_i67=$462;label=128;break;}else{var $_0_lcssa_i69=$462;label=130;break;}
 case 128: 
 var $_01_i67;
 ___fwritex($6,256,$f);
 var $466=((($_01_i67)-(256))|0);
 var $467=($466>>>0)>255;
 if($467){var $_01_i67=$466;label=128;break;}else{label=129;break;}
 case 129: 
 var $468=$462&255;
 var $_0_lcssa_i69=$468;label=130;break;
 case 130: 
 var $_0_lcssa_i69;
 ___fwritex($6,$_0_lcssa_i69,$f);
 label=131;break;
 case 131: 
 var $$etemp$27$0=256;
 var $$etemp$27$1=0;

 var $470=($441?$w_1:$i_0_lcssa267);
 var $l_0=$470;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$242;var $28=$437;var $fmt83=$169;label=2;break;
 case 132: 
 var $472$0=$242;
 var $472$1=0;
 var $473$0=0;
 var $473$1=$472$0;
 var $474$0=$243;
 var $474$1=0;
 var $475$0=$473$0|$474$0;
 var $475$1=$473$1|$474$1;
 var $476=(HEAP32[((tempDoublePtr)>>2)]=$475$0, HEAP32[(((tempDoublePtr)+(4))>>2)]=$475$1, HEAPF64[(tempDoublePtr)>>3]);
 var $$etemp$28$0=4;
 var $$etemp$28$1=0;

 var $$etemp$29$0=22;
 var $$etemp$29$1=0;

 var $$etemp$30$0=12;
 var $$etemp$30$1=0;

 var $$etemp$31$0=504;
 var $$etemp$31$1=0;

 HEAP32[(($e2_i)>>2)]=0;
 var $$etemp$32$0=0;
 var $$etemp$32$1=0;
 var $477=(($475$1|0) < ($$etemp$32$1|0)) | (((($475$1|0) == ($$etemp$32$1|0) & ($475$0>>>0) <  ($$etemp$32$0>>>0))));
 if($477){label=133;break;}else{label=134;break;}
 case 133: 
 var $479=((-.0))-($476);
 var $_010_i=$479;var $pl_0_i=1;var $prefix_0_i=5560;label=136;break;
 case 134: 
 var $481=$fl_1_&2048;
 var $482=($481|0)==0;
 if($482){label=135;break;}else{var $_010_i=$476;var $pl_0_i=1;var $prefix_0_i=5563;label=136;break;}
 case 135: 
 var $484=$fl_1_&1;
 var $485=($484|0)==0;
 var $__i=($485?5561:5566);
 var $_010_i=$476;var $pl_0_i=$484;var $prefix_0_i=$__i;label=136;break;
 case 136: 
 var $prefix_0_i;
 var $pl_0_i;
 var $_010_i;
 HEAPF64[(tempDoublePtr)>>3]=$_010_i; var $487$0=HEAP32[((tempDoublePtr)>>2)];var $487$1=HEAP32[(((tempDoublePtr)+(4))>>2)];
 var $$etemp$33$0=0;
 var $$etemp$33$1=2146435072;
 var $488$0=$487$0&$$etemp$33$0;
 var $488$1=$487$1&$$etemp$33$1;
 var $$etemp$34$0=0;
 var $$etemp$34$1=2146435072;
 var $489=(($488$1>>>0) < ($$etemp$34$1>>>0)) | (((($488$1>>>0) == ($$etemp$34$1>>>0) & ($488$0>>>0) <  ($$etemp$34$0>>>0))));
 if($489){label=150;break;}else{label=137;break;}
 case 137: 
 var $491=$t_0&32;
 var $492=($491|0)!=0;
 var $493=($492?4344:3776);
 var $494=isNaN($_010_i)|isNaN(0);
 if($494){label=138;break;}else{var $s1_0_i=$493;var $pl_1_i=$pl_0_i;label=139;break;}
 case 138: 
 var $496=($492?3464:2816);
 var $s1_0_i=$496;var $pl_1_i=0;label=139;break;
 case 139: 
 var $pl_1_i;
 var $s1_0_i;
 var $498=((($pl_1_i)+(3))|0);
 var $$etemp$35$0=256;
 var $$etemp$35$1=0;

 var $499=$fl_1_&8192;
 var $500=($499|0)==0;
 var $501=($w_1|0)>($498|0);
 var $or_cond_i40_i=$500&$501;
 if($or_cond_i40_i){label=140;break;}else{label=144;break;}
 case 140: 
 var $503=((($w_1)-($498))|0);
 var $504=($503>>>0)>256;
 var $505=($504?256:$503);
 _memset($6, 32, $505)|0;
 var $506=($503>>>0)>255;
 if($506){var $_01_i42_i=$503;label=141;break;}else{var $_0_lcssa_i44_i=$503;label=143;break;}
 case 141: 
 var $_01_i42_i;
 ___fwritex($6,256,$f);
 var $507=((($_01_i42_i)-(256))|0);
 var $508=($507>>>0)>255;
 if($508){var $_01_i42_i=$507;label=141;break;}else{label=142;break;}
 case 142: 
 var $509=$503&255;
 var $_0_lcssa_i44_i=$509;label=143;break;
 case 143: 
 var $_0_lcssa_i44_i;
 ___fwritex($6,$_0_lcssa_i44_i,$f);
 label=144;break;
 case 144: 
 var $$etemp$36$0=256;
 var $$etemp$36$1=0;

 ___fwritex($prefix_0_i,$pl_1_i,$f);
 ___fwritex($s1_0_i,3,$f);
 var $$etemp$37$0=256;
 var $$etemp$37$1=0;

 var $511=$fl_1_&73728;
 var $512=($511|0)==8192;
 var $or_cond_i47_i=$512&$501;
 if($or_cond_i47_i){label=145;break;}else{label=149;break;}
 case 145: 
 var $514=((($w_1)-($498))|0);
 var $515=($514>>>0)>256;
 var $516=($515?256:$514);
 _memset($6, 32, $516)|0;
 var $517=($514>>>0)>255;
 if($517){var $_01_i49_i=$514;label=146;break;}else{var $_0_lcssa_i51_i=$514;label=148;break;}
 case 146: 
 var $_01_i49_i;
 ___fwritex($6,256,$f);
 var $518=((($_01_i49_i)-(256))|0);
 var $519=($518>>>0)>255;
 if($519){var $_01_i49_i=$518;label=146;break;}else{label=147;break;}
 case 147: 
 var $520=$514&255;
 var $_0_lcssa_i51_i=$520;label=148;break;
 case 148: 
 var $_0_lcssa_i51_i;
 ___fwritex($6,$_0_lcssa_i51_i,$f);
 label=149;break;
 case 149: 
 var $$etemp$38$0=256;
 var $$etemp$38$1=0;

 var $w__i=($501?$w_1:$498);
 var $l_0=$w__i;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$242;var $28=$243;var $fmt83=$169;label=2;break;
 case 150: 
 var $523=_frexp($_010_i,$e2_i);
 var $524=($523)*(2);
 var $525=$524!=0;
 if($525){label=151;break;}else{label=152;break;}
 case 151: 
 var $527=HEAP32[(($e2_i)>>2)];
 var $528=((($527)-(1))|0);
 HEAP32[(($e2_i)>>2)]=$528;
 label=152;break;
 case 152: 
 var $530=$t_0|32;
 var $531=($530|0)==97;
 if($531){label=153;break;}else{label=201;break;}
 case 153: 
 var $533=$t_0&32;
 var $534=($533|0)==0;
 var $535=(($prefix_0_i+9)|0);
 var $prefix_0__i=($534?$prefix_0_i:$535);
 var $536=$pl_0_i|2;
 var $537=($p_0>>>0)>11;
 var $538=(((12)-($p_0))|0);
 var $re_0_i=($537?0:$538);
 var $539=($re_0_i|0)==0;
 if($539){var $_1_i=$524;label=158;break;}else{var $round_0162_i=8;var $re_1163_i=$re_0_i;label=154;break;}
 case 154: 
 var $re_1163_i;
 var $round_0162_i;
 var $540=((($re_1163_i)-(1))|0);
 var $541=($round_0162_i)*(16);
 var $542=($540|0)==0;
 if($542){label=155;break;}else{var $round_0162_i=$541;var $re_1163_i=$540;label=154;break;}
 case 155: 
 var $543=HEAP8[(($prefix_0__i)>>0)];
 var $544=(($543<<24)>>24)==45;
 if($544){label=156;break;}else{label=157;break;}
 case 156: 
 var $546=((-.0))-($524);
 var $547=($546)-($541);
 var $548=($541)+($547);
 var $549=((-.0))-($548);
 var $_1_i=$549;label=158;break;
 case 157: 
 var $551=($524)+($541);
 var $552=($551)-($541);
 var $_1_i=$552;label=158;break;
 case 158: 
 var $_1_i;
 var $554=HEAP32[(($e2_i)>>2)];
 var $555=($554|0)<0;
 var $556=(((-$554))|0);
 var $557=($555?$556:$554);
 var $558=($557|0)<0;
 if($558){label=159;break;}else{var $_01_lcssa_off0_i_i=$557;var $_0_lcssa_i53_i=$17;label=162;break;}
 case 159: 
 var $559$0=$557;
 var $559$1=((((($557|0)<0))|0)?-1:0);
 var $_014_i_i$1=$559$1;var $_014_i_i$0=$559$0;var $_05_i_i=$17;label=160;break;
 case 160: 
 var $_05_i_i;
 var $_014_i_i$0;
 var $_014_i_i$1;
 var $$etemp$39$0=10;
 var $$etemp$39$1=0;
 var $560$0=___uremdi3($_014_i_i$0,$_014_i_i$1,$$etemp$39$0,$$etemp$39$1);var $560$1=tempRet0;
 var $$etemp$40$0=48;
 var $$etemp$40$1=0;
 var $561$0=$560$0|$$etemp$40$0;
 var $561$1=$560$1|$$etemp$40$1;
 var $562$0=$561$0;
 var $562=$562$0&255;
 var $563=((($_05_i_i)-(1))|0);
 HEAP8[(($563)>>0)]=$562;
 var $$etemp$41$0=10;
 var $$etemp$41$1=0;
 var $564$0=___udivdi3($_014_i_i$0,$_014_i_i$1,$$etemp$41$0,$$etemp$41$1);var $564$1=tempRet0;
 var $$etemp$42$0=-1;
 var $$etemp$42$1=9;
 var $565=(($_014_i_i$1>>>0) > ($$etemp$42$1>>>0)) | (((($_014_i_i$1>>>0) == ($$etemp$42$1>>>0) & ($_014_i_i$0>>>0) >  ($$etemp$42$0>>>0))));
 if($565){var $_014_i_i$1=$564$1;var $_014_i_i$0=$564$0;var $_05_i_i=$563;label=160;break;}else{label=161;break;}
 case 161: 
 var $extract_t_i_i$0=$564$0;
 var $extract_t_i_i=$extract_t_i_i$0;
 var $_01_lcssa_off0_i_i=$extract_t_i_i;var $_0_lcssa_i53_i=$563;label=162;break;
 case 162: 
 var $_0_lcssa_i53_i;
 var $_01_lcssa_off0_i_i;
 var $567=($_01_lcssa_off0_i_i|0)==0;
 if($567){var $_1_lcssa_i_i=$_0_lcssa_i53_i;label=164;break;}else{var $_12_i_i=$_0_lcssa_i53_i;var $y_03_i_i=$_01_lcssa_off0_i_i;label=163;break;}
 case 163: 
 var $y_03_i_i;
 var $_12_i_i;
 var $568=(((($y_03_i_i>>>0))%(10))&-1);
 var $569=$568|48;
 var $570=(($569)&255);
 var $571=((($_12_i_i)-(1))|0);
 HEAP8[(($571)>>0)]=$570;
 var $572=(((($y_03_i_i>>>0))/(10))&-1);
 var $573=($y_03_i_i>>>0)<10;
 if($573){var $_1_lcssa_i_i=$571;label=164;break;}else{var $_12_i_i=$571;var $y_03_i_i=$572;label=163;break;}
 case 164: 
 var $_1_lcssa_i_i;
 var $574=($_1_lcssa_i_i|0)==($17|0);
 if($574){label=165;break;}else{var $estr_0_i=$_1_lcssa_i_i;label=166;break;}
 case 165: 
 HEAP8[(($18)>>0)]=48;
 var $estr_0_i=$18;label=166;break;
 case 166: 
 var $estr_0_i;
 var $577=HEAP32[(($e2_i)>>2)];
 var $578=$577>>31;
 var $579=$578&2;
 var $580=((($579)+(43))|0);
 var $581=(($580)&255);
 var $582=((($estr_0_i)-(1))|0);
 HEAP8[(($582)>>0)]=$581;
 var $583=((($t_0)+(15))|0);
 var $584=(($583)&255);
 var $585=((($estr_0_i)-(2))|0);
 HEAP8[(($585)>>0)]=$584;
 var $notrhs_i=($p_0|0)<1;
 if($notrhs_i){label=167;break;}else{var $_2_i=$_1_i;var $s_0_i=$14;label=174;break;}
 case 167: 
 var $586=$fl_1_&8;
 var $587=($586|0)==0;
 if($587){var $_2_us_us_i=$_1_i;var $s_0_us_us_i=$14;label=168;break;}else{var $_2_us_i=$_1_i;var $s_0_us_i=$14;label=171;break;}
 case 168: 
 var $s_0_us_us_i;
 var $_2_us_us_i;
 var $588=(($_2_us_us_i)&-1);
 var $589=((8+$588)|0);
 var $590=HEAP8[(($589)>>0)];
 var $591=($590&255);
 var $592=$591|$533;
 var $593=(($592)&255);
 var $594=(($s_0_us_us_i+1)|0);
 HEAP8[(($s_0_us_us_i)>>0)]=$593;
 var $595=($588|0);
 var $596=($_2_us_us_i)-($595);
 var $597=($596)*(16);
 var $598=$594;
 var $599=((($598)-($1))|0);
 var $600=($599|0)!=1;
 var $notlhs_us_us_i=$597==0;
 var $or_cond_i73=$600|$notlhs_us_us_i;
 if($or_cond_i73){var $s_1_us_us_i=$594;label=170;break;}else{label=169;break;}
 case 169: 
 var $602=(($s_0_us_us_i+2)|0);
 HEAP8[(($594)>>0)]=46;
 var $s_1_us_us_i=$602;label=170;break;
 case 170: 
 var $s_1_us_us_i;
 var $604=$597!=0;
 if($604){var $_2_us_us_i=$597;var $s_0_us_us_i=$s_1_us_us_i;label=168;break;}else{var $s_1_lcssa_i=$s_1_us_us_i;label=177;break;}
 case 171: 
 var $s_0_us_i;
 var $_2_us_i;
 var $605=(($_2_us_i)&-1);
 var $606=((8+$605)|0);
 var $607=HEAP8[(($606)>>0)];
 var $608=($607&255);
 var $609=$608|$533;
 var $610=(($609)&255);
 var $611=(($s_0_us_i+1)|0);
 HEAP8[(($s_0_us_i)>>0)]=$610;
 var $612=($605|0);
 var $613=($_2_us_i)-($612);
 var $614=($613)*(16);
 var $615=$611;
 var $616=((($615)-($1))|0);
 var $617=($616|0)==1;
 if($617){label=172;break;}else{var $s_1_us_i=$611;label=173;break;}
 case 172: 
 var $619=(($s_0_us_i+2)|0);
 HEAP8[(($611)>>0)]=46;
 var $s_1_us_i=$619;label=173;break;
 case 173: 
 var $s_1_us_i;
 var $621=$614!=0;
 if($621){var $_2_us_i=$614;var $s_0_us_i=$s_1_us_i;label=171;break;}else{var $s_1_lcssa_i=$s_1_us_i;label=177;break;}
 case 174: 
 var $s_0_i;
 var $_2_i;
 var $622=(($_2_i)&-1);
 var $623=((8+$622)|0);
 var $624=HEAP8[(($623)>>0)];
 var $625=($624&255);
 var $626=$625|$533;
 var $627=(($626)&255);
 var $628=(($s_0_i+1)|0);
 HEAP8[(($s_0_i)>>0)]=$627;
 var $629=($622|0);
 var $630=($_2_i)-($629);
 var $631=($630)*(16);
 var $632=$628;
 var $633=((($632)-($1))|0);
 var $634=($633|0)==1;
 if($634){label=175;break;}else{var $s_1_i=$628;label=176;break;}
 case 175: 
 var $636=(($s_0_i+2)|0);
 HEAP8[(($628)>>0)]=46;
 var $s_1_i=$636;label=176;break;
 case 176: 
 var $s_1_i;
 var $638=$631!=0;
 if($638){var $_2_i=$631;var $s_0_i=$s_1_i;label=174;break;}else{var $s_1_lcssa_i=$s_1_i;label=177;break;}
 case 177: 
 var $s_1_lcssa_i;
 var $639=($p_0|0)!=0;
 var $_pre306_i=$s_1_lcssa_i;
 var $640=((($21)+($_pre306_i))|0);
 var $641=($640|0)<($p_0|0);
 var $or_cond271=$639&$641;
 var $642=$585;
 if($or_cond271){label=178;break;}else{label=179;break;}
 case 178: 
 var $644=((($22)+($p_0))|0);
 var $645=((($644)-($642))|0);
 var $l_0_i=$645;label=180;break;
 case 179: 
 var $646=((($20)-($642))|0);
 var $647=((($646)+($_pre306_i))|0);
 var $l_0_i=$647;label=180;break;
 case 180: 
 var $l_0_i;
 var $649=((($l_0_i)+($536))|0);
 var $$etemp$43$0=256;
 var $$etemp$43$1=0;

 var $650=$fl_1_&73728;
 var $651=($650|0)==0;
 var $652=($w_1|0)>($649|0);
 var $or_cond_i57_i=$651&$652;
 if($or_cond_i57_i){label=181;break;}else{label=185;break;}
 case 181: 
 var $654=((($w_1)-($649))|0);
 var $655=($654>>>0)>256;
 var $656=($655?256:$654);
 _memset($6, 32, $656)|0;
 var $657=($654>>>0)>255;
 if($657){var $_01_i59_i=$654;label=182;break;}else{var $_0_lcssa_i61_i=$654;label=184;break;}
 case 182: 
 var $_01_i59_i;
 ___fwritex($6,256,$f);
 var $658=((($_01_i59_i)-(256))|0);
 var $659=($658>>>0)>255;
 if($659){var $_01_i59_i=$658;label=182;break;}else{label=183;break;}
 case 183: 
 var $660=$654&255;
 var $_0_lcssa_i61_i=$660;label=184;break;
 case 184: 
 var $_0_lcssa_i61_i;
 ___fwritex($6,$_0_lcssa_i61_i,$f);
 label=185;break;
 case 185: 
 var $$etemp$44$0=256;
 var $$etemp$44$1=0;

 ___fwritex($prefix_0__i,$536,$f);
 var $$etemp$45$0=256;
 var $$etemp$45$1=0;

 var $662=($650|0)==65536;
 var $or_cond_i64_i=$662&$652;
 if($or_cond_i64_i){label=186;break;}else{label=190;break;}
 case 186: 
 var $664=((($w_1)-($649))|0);
 var $665=($664>>>0)>256;
 var $666=($665?256:$664);
 _memset($6, 48, $666)|0;
 var $667=($664>>>0)>255;
 if($667){var $_01_i66_i=$664;label=187;break;}else{var $_0_lcssa_i68_i=$664;label=189;break;}
 case 187: 
 var $_01_i66_i;
 ___fwritex($6,256,$f);
 var $668=((($_01_i66_i)-(256))|0);
 var $669=($668>>>0)>255;
 if($669){var $_01_i66_i=$668;label=187;break;}else{label=188;break;}
 case 188: 
 var $670=$664&255;
 var $_0_lcssa_i68_i=$670;label=189;break;
 case 189: 
 var $_0_lcssa_i68_i;
 ___fwritex($6,$_0_lcssa_i68_i,$f);
 label=190;break;
 case 190: 
 var $$etemp$46$0=256;
 var $$etemp$46$1=0;

 var $672=((($_pre306_i)-($1))|0);
 ___fwritex($14,$672,$f);
 var $673=((($19)-($642))|0);
 var $674=((($l_0_i)-($673))|0);
 var $675=((($674)-($672))|0);
 var $$etemp$47$0=256;
 var $$etemp$47$1=0;

 var $676=($675|0)>0;
 if($676){label=191;break;}else{label=195;break;}
 case 191: 
 var $678=($675>>>0)>256;
 var $679=($678?256:$675);
 _memset($6, 48, $679)|0;
 var $680=($675>>>0)>255;
 if($680){var $_01_i72_i=$675;label=192;break;}else{var $_0_lcssa_i74_i=$675;label=194;break;}
 case 192: 
 var $_01_i72_i;
 ___fwritex($6,256,$f);
 var $681=((($_01_i72_i)-(256))|0);
 var $682=($681>>>0)>255;
 if($682){var $_01_i72_i=$681;label=192;break;}else{label=193;break;}
 case 193: 
 var $683=$675&255;
 var $_0_lcssa_i74_i=$683;label=194;break;
 case 194: 
 var $_0_lcssa_i74_i;
 ___fwritex($6,$_0_lcssa_i74_i,$f);
 label=195;break;
 case 195: 
 var $$etemp$48$0=256;
 var $$etemp$48$1=0;

 ___fwritex($585,$673,$f);
 var $$etemp$49$0=256;
 var $$etemp$49$1=0;

 var $685=($650|0)==8192;
 var $or_cond_i77_i=$685&$652;
 if($or_cond_i77_i){label=196;break;}else{label=200;break;}
 case 196: 
 var $687=((($w_1)-($649))|0);
 var $688=($687>>>0)>256;
 var $689=($688?256:$687);
 _memset($6, 32, $689)|0;
 var $690=($687>>>0)>255;
 if($690){var $_01_i79_i=$687;label=197;break;}else{var $_0_lcssa_i81_i=$687;label=199;break;}
 case 197: 
 var $_01_i79_i;
 ___fwritex($6,256,$f);
 var $691=((($_01_i79_i)-(256))|0);
 var $692=($691>>>0)>255;
 if($692){var $_01_i79_i=$691;label=197;break;}else{label=198;break;}
 case 198: 
 var $693=$687&255;
 var $_0_lcssa_i81_i=$693;label=199;break;
 case 199: 
 var $_0_lcssa_i81_i;
 ___fwritex($6,$_0_lcssa_i81_i,$f);
 label=200;break;
 case 200: 
 var $$etemp$50$0=256;
 var $$etemp$50$1=0;

 var $w_23_i=($652?$w_1:$649);
 var $l_0=$w_23_i;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$242;var $28=$243;var $fmt83=$169;label=2;break;
 case 201: 
 var $696=($p_0|0)<0;
 var $_p_i=($696?6:$p_0);
 if($525){label=203;break;}else{label=202;break;}
 case 202: 
 var $_pre_i=HEAP32[(($e2_i)>>2)];
 var $_3_i=$524;var $702=$_pre_i;label=204;break;
 case 203: 
 var $698=($524)*(268435456);
 var $699=HEAP32[(($e2_i)>>2)];
 var $700=((($699)-(28))|0);
 HEAP32[(($e2_i)>>2)]=$700;
 var $_3_i=$698;var $702=$700;label=204;break;
 case 204: 
 var $702;
 var $_3_i;
 var $703=($702|0)<0;
 var $_36_i=($703?$23:$24);
 var $704=$_36_i;
 var $_4_i=$_3_i;var $z_0_i=$_36_i;label=205;break;
 case 205: 
 var $z_0_i;
 var $_4_i;
 var $706=($_4_i>=0 ? Math_floor($_4_i) : Math_ceil($_4_i));
 HEAP32[(($z_0_i)>>2)]=$706;
 var $707=(($z_0_i+4)|0);
 var $708=($706>>>0);
 var $709=($_4_i)-($708);
 var $710=($709)*(1000000000);
 var $711=$710!=0;
 if($711){var $_4_i=$710;var $z_0_i=$707;label=205;break;}else{label=206;break;}
 case 206: 
 var $_pr_i=HEAP32[(($e2_i)>>2)];
 var $712=($_pr_i|0)>0;
 if($712){var $713=$_pr_i;var $z_1257_i=$707;var $a_1258_i=$_36_i;label=207;break;}else{var $z_1_lcssa_i=$707;var $a_1_lcssa_i=$_36_i;var $_pr151_i=$_pr_i;label=216;break;}
 case 207: 
 var $a_1258_i;
 var $z_1257_i;
 var $713;
 var $714=($713|0)>29;
 var $715=($714?29:$713);
 var $d_0249_i=((($z_1257_i)-(4))|0);
 var $716=($d_0249_i>>>0)<($a_1258_i>>>0);
 if($716){var $a_2_ph_i=$a_1258_i;label=212;break;}else{label=208;break;}
 case 208: 
 var $717$0=$715;
 var $717$1=0;
 var $carry_0250_i=0;var $d_0251_i=$d_0249_i;label=209;break;
 case 209: 
 var $d_0251_i;
 var $carry_0250_i;
 var $719=HEAP32[(($d_0251_i)>>2)];
 var $720$0=$719;
 var $720$1=0;
 var $721$0=_bitshift64Shl($720$0,$720$1,$717$0);var $721$1=tempRet0;
 var $722$0=$carry_0250_i;
 var $722$1=0;
 var $723$0=_i64Add($721$0,$721$1,$722$0,$722$1);var $723$1=tempRet0;
 var $$etemp$51$0=1000000000;
 var $$etemp$51$1=0;
 var $724$0=___uremdi3($723$0,$723$1,$$etemp$51$0,$$etemp$51$1);var $724$1=tempRet0;
 var $725$0=$724$0;
 var $725=$725$0;
 HEAP32[(($d_0251_i)>>2)]=$725;
 var $$etemp$52$0=1000000000;
 var $$etemp$52$1=0;
 var $726$0=___udivdi3($723$0,$723$1,$$etemp$52$0,$$etemp$52$1);var $726$1=tempRet0;
 var $727$0=$726$0;
 var $727=$727$0;
 var $d_0_i=((($d_0251_i)-(4))|0);
 var $728=($d_0_i>>>0)<($a_1258_i>>>0);
 if($728){label=210;break;}else{var $carry_0250_i=$727;var $d_0251_i=$d_0_i;label=209;break;}
 case 210: 
 var $729=($727|0)==0;
 if($729){var $a_2_ph_i=$a_1258_i;label=212;break;}else{label=211;break;}
 case 211: 
 var $731=((($a_1258_i)-(4))|0);
 HEAP32[(($731)>>2)]=$727;
 var $a_2_ph_i=$731;label=212;break;
 case 212: 
 var $a_2_ph_i;
 var $z_2_i=$z_1257_i;label=213;break;
 case 213: 
 var $z_2_i;
 var $733=($z_2_i>>>0)>($a_2_ph_i>>>0);
 if($733){label=214;break;}else{label=215;break;}
 case 214: 
 var $735=((($z_2_i)-(4))|0);
 var $736=HEAP32[(($735)>>2)];
 var $737=($736|0)==0;
 if($737){var $z_2_i=$735;label=213;break;}else{label=215;break;}
 case 215: 
 var $738=HEAP32[(($e2_i)>>2)];
 var $739=((($738)-($715))|0);
 HEAP32[(($e2_i)>>2)]=$739;
 var $740=($739|0)>0;
 if($740){var $713=$739;var $z_1257_i=$z_2_i;var $a_1258_i=$a_2_ph_i;label=207;break;}else{var $z_1_lcssa_i=$z_2_i;var $a_1_lcssa_i=$a_2_ph_i;var $_pr151_i=$739;label=216;break;}
 case 216: 
 var $_pr151_i;
 var $a_1_lcssa_i;
 var $z_1_lcssa_i;
 var $741=($_pr151_i|0)<0;
 if($741){label=217;break;}else{var $z_3_lcssa_i=$z_1_lcssa_i;var $a_3_lcssa_i=$a_1_lcssa_i;label=235;break;}
 case 217: 
 var $742=((($_p_i)+(25))|0);
 var $743=(((($742|0))/(9))&-1);
 var $744=((($743)+(1))|0);
 var $745=($530|0)==102;
 if($745){label=218;break;}else{var $781=$_pr151_i;var $z_3243_i=$z_1_lcssa_i;var $a_3244_i=$a_1_lcssa_i;label=226;break;}
 case 218: 
 var $746=(($_36_i+($744<<2))|0);
 var $748=$_pr151_i;var $z_3243_us_i=$z_1_lcssa_i;var $a_3244_us_i=$a_1_lcssa_i;label=219;break;
 case 219: 
 var $a_3244_us_i;
 var $z_3243_us_i;
 var $748;
 var $749=(((-$748))|0);
 var $750=($749|0)>9;
 var $_24_us_i=($750?9:$749);
 var $751=($a_3244_us_i>>>0)<($z_3243_us_i>>>0);
 if($751){label=225;break;}else{label=220;break;}
 case 220: 
 var $752=HEAP32[(($a_3244_us_i)>>2)];
 var $753=($752|0)==0;
 var $754=(($a_3244_us_i+4)|0);
 var $_a_3_us307_i=($753?$754:$a_3244_us_i);
 var $z_4_us_i=$z_3243_us_i;var $_a_3_us308_i=$_a_3_us307_i;label=223;break;
 case 221: 
 var $756=HEAP32[(($a_3244_us_i)>>2)];
 var $757=($756|0)==0;
 var $758=(($a_3244_us_i+4)|0);
 var $_a_3_us_i=($757?$758:$a_3244_us_i);
 var $759=($775|0)==0;
 if($759){var $z_4_us_i=$z_3243_us_i;var $_a_3_us308_i=$_a_3_us_i;label=223;break;}else{label=222;break;}
 case 222: 
 var $761=(($z_3243_us_i+4)|0);
 HEAP32[(($z_3243_us_i)>>2)]=$775;
 var $z_4_us_i=$761;var $_a_3_us308_i=$_a_3_us_i;label=223;break;
 case 223: 
 var $_a_3_us308_i;
 var $z_4_us_i;
 var $763=$z_4_us_i;
 var $764=((($763)-($704))|0);
 var $765=$764>>2;
 var $766=($765|0)>($744|0);
 var $_z_4_us_i=($766?$746:$z_4_us_i);
 var $767=HEAP32[(($e2_i)>>2)];
 var $768=((($767)+($_24_us_i))|0);
 HEAP32[(($e2_i)>>2)]=$768;
 var $769=($768|0)<0;
 if($769){var $748=$768;var $z_3243_us_i=$_z_4_us_i;var $a_3244_us_i=$_a_3_us308_i;label=219;break;}else{var $z_3_lcssa_i=$_z_4_us_i;var $a_3_lcssa_i=$_a_3_us308_i;label=235;break;}
 case 224: 
 var $carry3_0238_us_i;
 var $d_1237_us_i;
 var $771=HEAP32[(($d_1237_us_i)>>2)];
 var $772=$771&$779;
 var $773=$771>>>($_24_us_i>>>0);
 var $774=((($773)+($carry3_0238_us_i))|0);
 HEAP32[(($d_1237_us_i)>>2)]=$774;
 var $775=(Math_imul($772,$780)|0);
 var $776=(($d_1237_us_i+4)|0);
 var $777=($776>>>0)<($z_3243_us_i>>>0);
 if($777){var $d_1237_us_i=$776;var $carry3_0238_us_i=$775;label=224;break;}else{label=221;break;}
 case 225: 
 var $778=1<<$_24_us_i;
 var $779=((($778)-(1))|0);
 var $780=1000000000>>>($_24_us_i>>>0);
 var $d_1237_us_i=$a_3244_us_i;var $carry3_0238_us_i=0;label=224;break;
 case 226: 
 var $a_3244_i;
 var $z_3243_i;
 var $781;
 var $782=(((-$781))|0);
 var $783=($782|0)>9;
 var $_24_i=($783?9:$782);
 var $784=($a_3244_i>>>0)<($z_3243_i>>>0);
 if($784){label=228;break;}else{label=227;break;}
 case 227: 
 var $785=HEAP32[(($a_3244_i)>>2)];
 var $786=($785|0)==0;
 var $787=(($a_3244_i+4)|0);
 var $_a_3309_i=($786?$787:$a_3244_i);
 var $z_4_i=$z_3243_i;var $_a_3310_i=$_a_3309_i;label=232;break;
 case 228: 
 var $788=1<<$_24_i;
 var $789=((($788)-(1))|0);
 var $790=1000000000>>>($_24_i>>>0);
 var $d_1237_i=$a_3244_i;var $carry3_0238_i=0;label=229;break;
 case 229: 
 var $carry3_0238_i;
 var $d_1237_i;
 var $792=HEAP32[(($d_1237_i)>>2)];
 var $793=$792&$789;
 var $794=$792>>>($_24_i>>>0);
 var $795=((($794)+($carry3_0238_i))|0);
 HEAP32[(($d_1237_i)>>2)]=$795;
 var $796=(Math_imul($793,$790)|0);
 var $797=(($d_1237_i+4)|0);
 var $798=($797>>>0)<($z_3243_i>>>0);
 if($798){var $d_1237_i=$797;var $carry3_0238_i=$796;label=229;break;}else{label=230;break;}
 case 230: 
 var $799=HEAP32[(($a_3244_i)>>2)];
 var $800=($799|0)==0;
 var $801=(($a_3244_i+4)|0);
 var $_a_3_i=($800?$801:$a_3244_i);
 var $802=($796|0)==0;
 if($802){var $z_4_i=$z_3243_i;var $_a_3310_i=$_a_3_i;label=232;break;}else{label=231;break;}
 case 231: 
 var $804=(($z_3243_i+4)|0);
 HEAP32[(($z_3243_i)>>2)]=$796;
 var $z_4_i=$804;var $_a_3310_i=$_a_3_i;label=232;break;
 case 232: 
 var $_a_3310_i;
 var $z_4_i;
 var $806=$z_4_i;
 var $807=$_a_3310_i;
 var $808=((($806)-($807))|0);
 var $809=$808>>2;
 var $810=($809|0)>($744|0);
 if($810){label=233;break;}else{var $z_5_i=$z_4_i;label=234;break;}
 case 233: 
 var $812=(($_a_3310_i+($744<<2))|0);
 var $z_5_i=$812;label=234;break;
 case 234: 
 var $z_5_i;
 var $814=HEAP32[(($e2_i)>>2)];
 var $815=((($814)+($_24_i))|0);
 HEAP32[(($e2_i)>>2)]=$815;
 var $816=($815|0)<0;
 if($816){var $781=$815;var $z_3243_i=$z_5_i;var $a_3244_i=$_a_3310_i;label=226;break;}else{var $z_3_lcssa_i=$z_5_i;var $a_3_lcssa_i=$_a_3310_i;label=235;break;}
 case 235: 
 var $a_3_lcssa_i;
 var $z_3_lcssa_i;
 var $817=($a_3_lcssa_i>>>0)<($z_3_lcssa_i>>>0);
 if($817){label=236;break;}else{var $e_1_i=0;label=238;break;}
 case 236: 
 var $819=$a_3_lcssa_i;
 var $820=((($704)-($819))|0);
 var $821=$820>>2;
 var $822=((($821)*(9))&-1);
 var $823=HEAP32[(($a_3_lcssa_i)>>2)];
 var $824=($823>>>0)<10;
 if($824){var $e_1_i=$822;label=238;break;}else{var $i_0232_i=10;var $e_0233_i=$822;label=237;break;}
 case 237: 
 var $e_0233_i;
 var $i_0232_i;
 var $825=((($i_0232_i)*(10))&-1);
 var $826=((($e_0233_i)+(1))|0);
 var $827=($823>>>0)<($825>>>0);
 if($827){var $e_1_i=$826;label=238;break;}else{var $i_0232_i=$825;var $e_0233_i=$826;label=237;break;}
 case 238: 
 var $e_1_i;
 var $828=($530|0)!=102;
 var $829=($828?$e_1_i:0);
 var $830=((($_p_i)-($829))|0);
 var $831=($530|0)==103;
 if($831){label=239;break;}else{var $835=0;label=240;break;}
 case 239: 
 var $833=($_p_i|0)!=0;
 var $phitmp_i=($833&1);
 var $835=$phitmp_i;label=240;break;
 case 240: 
 var $835;
 var $836=((($830)-($835))|0);
 var $837=$z_3_lcssa_i;
 var $838=((($837)-($704))|0);
 var $839=$838>>2;
 var $840=((($839)*(9))&-1);
 var $841=((($840)-(9))|0);
 var $842=($836|0)<($841|0);
 if($842){label=241;break;}else{var $a_8_ph_i=$a_3_lcssa_i;var $z_6_ph_i=$z_3_lcssa_i;var $e_4_ph_i=$e_1_i;label=260;break;}
 case 241: 
 var $844=((($836)+(9216))|0);
 var $845=(((($844|0))/(9))&-1);
 var $_sum_i=((($845)-(1023))|0);
 var $846=(($_36_i+($_sum_i<<2))|0);
 var $847=(((($844|0))%(9))&-1);
 var $j_0224_i=((($847)+(1))|0);
 var $848=($j_0224_i|0)<9;
 if($848){var $i_1225_i=10;var $j_0226_i=$j_0224_i;label=242;break;}else{var $i_1_lcssa_i=10;label=243;break;}
 case 242: 
 var $j_0226_i;
 var $i_1225_i;
 var $849=((($i_1225_i)*(10))&-1);
 var $j_0_i=((($j_0226_i)+(1))|0);
 var $850=($j_0_i|0)<9;
 if($850){var $i_1225_i=$849;var $j_0226_i=$j_0_i;label=242;break;}else{var $i_1_lcssa_i=$849;label=243;break;}
 case 243: 
 var $i_1_lcssa_i;
 var $851=HEAP32[(($846)>>2)];
 var $852=(((($851>>>0))%(($i_1_lcssa_i>>>0)))&-1);
 var $853=($852|0)==0;
 if($853){label=244;break;}else{label=245;break;}
 case 244: 
 var $_sum19_i=((($845)-(1022))|0);
 var $855=(($_36_i+($_sum19_i<<2))|0);
 var $856=($855|0)==($z_3_lcssa_i|0);
 if($856){var $a_7_i=$a_3_lcssa_i;var $d_3_i=$846;var $e_3_i=$e_1_i;label=259;break;}else{label=245;break;}
 case 245: 
 var $858=(((($851>>>0))/(($i_1_lcssa_i>>>0)))&-1);
 var $859=$858&1;
 var $860=($859|0)==0;
 var $_25_i=($860?9007199254740992:9007199254740994);
 var $861=(((($i_1_lcssa_i|0))/(2))&-1);
 var $862=($852>>>0)<($861>>>0);
 if($862){var $small_0_i=0.5;label=249;break;}else{label=246;break;}
 case 246: 
 var $864=($852|0)==($861|0);
 if($864){label=247;break;}else{label=248;break;}
 case 247: 
 var $_sum20_i=((($845)-(1022))|0);
 var $866=(($_36_i+($_sum20_i<<2))|0);
 var $867=($866|0)==($z_3_lcssa_i|0);
 if($867){var $small_0_i=1;label=249;break;}else{label=248;break;}
 case 248: 
 var $small_0_i=1.5;label=249;break;
 case 249: 
 var $small_0_i;
 var $870=($pl_0_i|0)==0;
 if($870){var $small_1_i=$small_0_i;var $round6_1_i=$_25_i;label=252;break;}else{label=250;break;}
 case 250: 
 var $872=HEAP8[(($prefix_0_i)>>0)];
 var $873=(($872<<24)>>24)==45;
 if($873){label=251;break;}else{var $small_1_i=$small_0_i;var $round6_1_i=$_25_i;label=252;break;}
 case 251: 
 var $875=($_25_i)*(-1);
 var $876=($small_0_i)*(-1);
 var $small_1_i=$876;var $round6_1_i=$875;label=252;break;
 case 252: 
 var $round6_1_i;
 var $small_1_i;
 var $878=((($851)-($852))|0);
 HEAP32[(($846)>>2)]=$878;
 var $879=($round6_1_i)+($small_1_i);
 var $880=$879!=$round6_1_i;
 if($880){label=253;break;}else{var $a_7_i=$a_3_lcssa_i;var $d_3_i=$846;var $e_3_i=$e_1_i;label=259;break;}
 case 253: 
 var $882=((($878)+($i_1_lcssa_i))|0);
 HEAP32[(($846)>>2)]=$882;
 var $883=($882>>>0)>999999999;
 if($883){var $d_2217_i=$846;var $a_5218_i=$a_3_lcssa_i;label=254;break;}else{var $d_2_lcssa_i=$846;var $a_5_lcssa_i=$a_3_lcssa_i;label=257;break;}
 case 254: 
 var $a_5218_i;
 var $d_2217_i;
 var $884=((($d_2217_i)-(4))|0);
 HEAP32[(($d_2217_i)>>2)]=0;
 var $885=($884>>>0)<($a_5218_i>>>0);
 if($885){label=255;break;}else{var $a_6_i=$a_5218_i;label=256;break;}
 case 255: 
 var $887=((($a_5218_i)-(4))|0);
 HEAP32[(($887)>>2)]=0;
 var $a_6_i=$887;label=256;break;
 case 256: 
 var $a_6_i;
 var $889=HEAP32[(($884)>>2)];
 var $890=((($889)+(1))|0);
 HEAP32[(($884)>>2)]=$890;
 var $891=($890>>>0)>999999999;
 if($891){var $d_2217_i=$884;var $a_5218_i=$a_6_i;label=254;break;}else{var $d_2_lcssa_i=$884;var $a_5_lcssa_i=$a_6_i;label=257;break;}
 case 257: 
 var $a_5_lcssa_i;
 var $d_2_lcssa_i;
 var $892=$a_5_lcssa_i;
 var $893=((($704)-($892))|0);
 var $894=$893>>2;
 var $895=((($894)*(9))&-1);
 var $896=HEAP32[(($a_5_lcssa_i)>>2)];
 var $897=($896>>>0)<10;
 if($897){var $a_7_i=$a_5_lcssa_i;var $d_3_i=$d_2_lcssa_i;var $e_3_i=$895;label=259;break;}else{var $i_2212_i=10;var $e_2213_i=$895;label=258;break;}
 case 258: 
 var $e_2213_i;
 var $i_2212_i;
 var $898=((($i_2212_i)*(10))&-1);
 var $899=((($e_2213_i)+(1))|0);
 var $900=($896>>>0)<($898>>>0);
 if($900){var $a_7_i=$a_5_lcssa_i;var $d_3_i=$d_2_lcssa_i;var $e_3_i=$899;label=259;break;}else{var $i_2212_i=$898;var $e_2213_i=$899;label=258;break;}
 case 259: 
 var $e_3_i;
 var $d_3_i;
 var $a_7_i;
 var $901=(($d_3_i+4)|0);
 var $902=($z_3_lcssa_i>>>0)>($901>>>0);
 var $_z_3_i=($902?$901:$z_3_lcssa_i);
 var $a_8_ph_i=$a_7_i;var $z_6_ph_i=$_z_3_i;var $e_4_ph_i=$e_3_i;label=260;break;
 case 260: 
 var $e_4_ph_i;
 var $z_6_ph_i;
 var $a_8_ph_i;
 var $903=(((-$e_4_ph_i))|0);
 var $z_6_i=$z_6_ph_i;label=261;break;
 case 261: 
 var $z_6_i;
 var $905=($z_6_i>>>0)>($a_8_ph_i>>>0);
 if($905){label=262;break;}else{var $_lcssa292_i=0;label=263;break;}
 case 262: 
 var $907=((($z_6_i)-(4))|0);
 var $908=HEAP32[(($907)>>2)];
 var $909=($908|0)==0;
 if($909){var $z_6_i=$907;label=261;break;}else{var $_lcssa292_i=1;label=263;break;}
 case 263: 
 var $_lcssa292_i;
 if($831){label=264;break;}else{var $_314_i=$_p_i;var $_117_i=$t_0;label=275;break;}
 case 264: 
 var $912=($_p_i|0)==0;
 var $913=($912&1);
 var $__p_i=((($913)+($_p_i))|0);
 var $914=($__p_i|0)>($e_4_ph_i|0);
 var $915=($e_4_ph_i|0)>-5;
 var $or_cond5_i=$914&$915;
 if($or_cond5_i){label=265;break;}else{label=266;break;}
 case 265: 
 var $917=((($t_0)-(1))|0);
 var $_neg157_i=((($__p_i)-(1))|0);
 var $918=((($_neg157_i)-($e_4_ph_i))|0);
 var $_213_i=$918;var $_016_i=$917;label=267;break;
 case 266: 
 var $920=((($t_0)-(2))|0);
 var $921=((($__p_i)-(1))|0);
 var $_213_i=$921;var $_016_i=$920;label=267;break;
 case 267: 
 var $_016_i;
 var $_213_i;
 var $923=$fl_1_&8;
 var $924=($923|0)==0;
 if($924){label=268;break;}else{var $_314_i=$_213_i;var $_117_i=$_016_i;label=275;break;}
 case 268: 
 if($_lcssa292_i){label=269;break;}else{var $j_2_i=9;label=272;break;}
 case 269: 
 var $927=((($z_6_i)-(4))|0);
 var $928=HEAP32[(($927)>>2)];
 var $929=($928|0)==0;
 if($929){var $j_2_i=9;label=272;break;}else{label=270;break;}
 case 270: 
 var $930=(((($928>>>0))%(10))&-1);
 var $931=($930|0)==0;
 if($931){var $i_3204_i=10;var $j_1205_i=0;label=271;break;}else{var $j_2_i=0;label=272;break;}
 case 271: 
 var $j_1205_i;
 var $i_3204_i;
 var $932=((($i_3204_i)*(10))&-1);
 var $933=((($j_1205_i)+(1))|0);
 var $934=(((($928>>>0))%(($932>>>0)))&-1);
 var $935=($934|0)==0;
 if($935){var $i_3204_i=$932;var $j_1205_i=$933;label=271;break;}else{var $j_2_i=$933;label=272;break;}
 case 272: 
 var $j_2_i;
 var $936=$_016_i|32;
 var $937=($936|0)==102;
 var $938=$z_6_i;
 var $939=((($938)-($704))|0);
 var $940=$939>>2;
 var $941=((($940)*(9))&-1);
 var $942=((($941)-(9))|0);
 if($937){label=273;break;}else{label=274;break;}
 case 273: 
 var $944=((($942)-($j_2_i))|0);
 var $945=($944|0)<0;
 var $_26_i=($945?0:$944);
 var $946=($_213_i|0)<($_26_i|0);
 var $_213__26_i=($946?$_213_i:$_26_i);
 var $_314_i=$_213__26_i;var $_117_i=$_016_i;label=275;break;
 case 274: 
 var $948=((($942)+($e_4_ph_i))|0);
 var $949=((($948)-($j_2_i))|0);
 var $950=($949|0)<0;
 var $_28_i=($950?0:$949);
 var $951=($_213_i|0)<($_28_i|0);
 var $_213__28_i=($951?$_213_i:$_28_i);
 var $_314_i=$_213__28_i;var $_117_i=$_016_i;label=275;break;
 case 275: 
 var $_117_i;
 var $_314_i;
 var $953=($_314_i|0)!=0;
 if($953){var $957=1;label=277;break;}else{label=276;break;}
 case 276: 
 var $955=$fl_1_>>>3;
 var $_lobit_i=$955&1;
 var $957=$_lobit_i;label=277;break;
 case 277: 
 var $957;
 var $958=$_117_i|32;
 var $959=($958|0)==102;
 if($959){label=278;break;}else{label=279;break;}
 case 278: 
 var $961=($e_4_ph_i|0)>0;
 var $962=($961?$e_4_ph_i:0);
 var $estr_2_i=0;var $_pn_i=$962;label=288;break;
 case 279: 
 var $964=($e_4_ph_i|0)<0;
 var $965=($964?$903:$e_4_ph_i);
 var $966=($965|0)<0;
 if($966){label=280;break;}else{var $_01_lcssa_off0_i90_i=$965;var $_0_lcssa_i89_i=$17;label=283;break;}
 case 280: 
 var $967$0=$965;
 var $967$1=((((($965|0)<0))|0)?-1:0);
 var $_014_i85_i$1=$967$1;var $_014_i85_i$0=$967$0;var $_05_i84_i=$17;label=281;break;
 case 281: 
 var $_05_i84_i;
 var $_014_i85_i$0;
 var $_014_i85_i$1;
 var $$etemp$53$0=10;
 var $$etemp$53$1=0;
 var $968$0=___uremdi3($_014_i85_i$0,$_014_i85_i$1,$$etemp$53$0,$$etemp$53$1);var $968$1=tempRet0;
 var $$etemp$54$0=48;
 var $$etemp$54$1=0;
 var $969$0=$968$0|$$etemp$54$0;
 var $969$1=$968$1|$$etemp$54$1;
 var $970$0=$969$0;
 var $970=$970$0&255;
 var $971=((($_05_i84_i)-(1))|0);
 HEAP8[(($971)>>0)]=$970;
 var $$etemp$55$0=10;
 var $$etemp$55$1=0;
 var $972$0=___udivdi3($_014_i85_i$0,$_014_i85_i$1,$$etemp$55$0,$$etemp$55$1);var $972$1=tempRet0;
 var $$etemp$56$0=-1;
 var $$etemp$56$1=9;
 var $973=(($_014_i85_i$1>>>0) > ($$etemp$56$1>>>0)) | (((($_014_i85_i$1>>>0) == ($$etemp$56$1>>>0) & ($_014_i85_i$0>>>0) >  ($$etemp$56$0>>>0))));
 if($973){var $_014_i85_i$1=$972$1;var $_014_i85_i$0=$972$0;var $_05_i84_i=$971;label=281;break;}else{label=282;break;}
 case 282: 
 var $extract_t_i87_i$0=$972$0;
 var $extract_t_i87_i=$extract_t_i87_i$0;
 var $_01_lcssa_off0_i90_i=$extract_t_i87_i;var $_0_lcssa_i89_i=$971;label=283;break;
 case 283: 
 var $_0_lcssa_i89_i;
 var $_01_lcssa_off0_i90_i;
 var $975=($_01_lcssa_off0_i90_i|0)==0;
 if($975){var $estr_1_ph_i=$_0_lcssa_i89_i;label=285;break;}else{var $_12_i92_i=$_0_lcssa_i89_i;var $y_03_i91_i=$_01_lcssa_off0_i90_i;label=284;break;}
 case 284: 
 var $y_03_i91_i;
 var $_12_i92_i;
 var $976=(((($y_03_i91_i>>>0))%(10))&-1);
 var $977=$976|48;
 var $978=(($977)&255);
 var $979=((($_12_i92_i)-(1))|0);
 HEAP8[(($979)>>0)]=$978;
 var $980=(((($y_03_i91_i>>>0))/(10))&-1);
 var $981=($y_03_i91_i>>>0)<10;
 if($981){var $estr_1_ph_i=$979;label=285;break;}else{var $_12_i92_i=$979;var $y_03_i91_i=$980;label=284;break;}
 case 285: 
 var $estr_1_ph_i;
 var $982=$estr_1_ph_i;
 var $983=((($19)-($982))|0);
 var $984=($983|0)<2;
 if($984){var $estr_1195_i=$estr_1_ph_i;label=286;break;}else{var $estr_1_lcssa_i=$estr_1_ph_i;label=287;break;}
 case 286: 
 var $estr_1195_i;
 var $985=((($estr_1195_i)-(1))|0);
 HEAP8[(($985)>>0)]=48;
 var $986=$985;
 var $987=((($19)-($986))|0);
 var $988=($987|0)<2;
 if($988){var $estr_1195_i=$985;label=286;break;}else{var $estr_1_lcssa_i=$985;label=287;break;}
 case 287: 
 var $estr_1_lcssa_i;
 var $989=$e_4_ph_i>>31;
 var $990=$989&2;
 var $991=((($990)+(43))|0);
 var $992=(($991)&255);
 var $993=((($estr_1_lcssa_i)-(1))|0);
 HEAP8[(($993)>>0)]=$992;
 var $994=(($_117_i)&255);
 var $995=((($estr_1_lcssa_i)-(2))|0);
 HEAP8[(($995)>>0)]=$994;
 var $996=$995;
 var $997=((($19)-($996))|0);
 var $estr_2_i=$995;var $_pn_i=$997;label=288;break;
 case 288: 
 var $_pn_i;
 var $estr_2_i;
 var $999=((($pl_0_i)+(1))|0);
 var $1000=((($999)+($_314_i))|0);
 var $l_1_i=((($1000)+($957))|0);
 var $1001=((($l_1_i)+($_pn_i))|0);
 var $$etemp$57$0=256;
 var $$etemp$57$1=0;

 var $1002=$fl_1_&73728;
 var $1003=($1002|0)==0;
 var $1004=($w_1|0)>($1001|0);
 var $or_cond_i98_i=$1003&$1004;
 if($or_cond_i98_i){label=289;break;}else{label=293;break;}
 case 289: 
 var $1006=((($w_1)-($1001))|0);
 var $1007=($1006>>>0)>256;
 var $1008=($1007?256:$1006);
 _memset($6, 32, $1008)|0;
 var $1009=($1006>>>0)>255;
 if($1009){var $_01_i100_i=$1006;label=290;break;}else{var $_0_lcssa_i102_i=$1006;label=292;break;}
 case 290: 
 var $_01_i100_i;
 ___fwritex($6,256,$f);
 var $1010=((($_01_i100_i)-(256))|0);
 var $1011=($1010>>>0)>255;
 if($1011){var $_01_i100_i=$1010;label=290;break;}else{label=291;break;}
 case 291: 
 var $1012=$1006&255;
 var $_0_lcssa_i102_i=$1012;label=292;break;
 case 292: 
 var $_0_lcssa_i102_i;
 ___fwritex($6,$_0_lcssa_i102_i,$f);
 label=293;break;
 case 293: 
 var $$etemp$58$0=256;
 var $$etemp$58$1=0;

 ___fwritex($prefix_0_i,$pl_0_i,$f);
 var $$etemp$59$0=256;
 var $$etemp$59$1=0;

 var $1014=($1002|0)==65536;
 var $or_cond_i105_i=$1014&$1004;
 if($or_cond_i105_i){label=294;break;}else{label=298;break;}
 case 294: 
 var $1016=((($w_1)-($1001))|0);
 var $1017=($1016>>>0)>256;
 var $1018=($1017?256:$1016);
 _memset($6, 48, $1018)|0;
 var $1019=($1016>>>0)>255;
 if($1019){var $_01_i107_i=$1016;label=295;break;}else{var $_0_lcssa_i109_i=$1016;label=297;break;}
 case 295: 
 var $_01_i107_i;
 ___fwritex($6,256,$f);
 var $1020=((($_01_i107_i)-(256))|0);
 var $1021=($1020>>>0)>255;
 if($1021){var $_01_i107_i=$1020;label=295;break;}else{label=296;break;}
 case 296: 
 var $1022=$1016&255;
 var $_0_lcssa_i109_i=$1022;label=297;break;
 case 297: 
 var $_0_lcssa_i109_i;
 ___fwritex($6,$_0_lcssa_i109_i,$f);
 label=298;break;
 case 298: 
 var $$etemp$60$0=256;
 var $$etemp$60$1=0;

 if($959){label=299;break;}else{label=321;break;}
 case 299: 
 var $1025=($a_8_ph_i>>>0)>($_36_i>>>0);
 var $r_0_a_8_i=($1025?$_36_i:$a_8_ph_i);
 var $d_4180_i=$r_0_a_8_i;label=300;break;
 case 300: 
 var $d_4180_i;
 var $1027=HEAP32[(($d_4180_i)>>2)];
 var $1028=($1027|0)==0;
 if($1028){var $_1_lcssa_i117_i=$25;label=302;break;}else{var $_12_i115_i=$25;var $y_03_i114_i=$1027;label=301;break;}
 case 301: 
 var $y_03_i114_i;
 var $_12_i115_i;
 var $1029=(((($y_03_i114_i>>>0))%(10))&-1);
 var $1030=$1029|48;
 var $1031=(($1030)&255);
 var $1032=((($_12_i115_i)-(1))|0);
 HEAP8[(($1032)>>0)]=$1031;
 var $1033=(((($y_03_i114_i>>>0))/(10))&-1);
 var $1034=($y_03_i114_i>>>0)<10;
 if($1034){var $_1_lcssa_i117_i=$1032;label=302;break;}else{var $_12_i115_i=$1032;var $y_03_i114_i=$1033;label=301;break;}
 case 302: 
 var $_1_lcssa_i117_i;
 var $1035=($d_4180_i|0)==($r_0_a_8_i|0);
 if($1035){label=305;break;}else{label=303;break;}
 case 303: 
 var $1036=($_1_lcssa_i117_i>>>0)>($14>>>0);
 if($1036){var $s7_0177_i=$_1_lcssa_i117_i;label=304;break;}else{var $s7_1_i=$_1_lcssa_i117_i;label=307;break;}
 case 304: 
 var $s7_0177_i;
 var $1037=((($s7_0177_i)-(1))|0);
 HEAP8[(($1037)>>0)]=48;
 var $1038=($1037>>>0)>($14>>>0);
 if($1038){var $s7_0177_i=$1037;label=304;break;}else{var $s7_1_i=$1037;label=307;break;}
 case 305: 
 var $1040=($_1_lcssa_i117_i|0)==($25|0);
 if($1040){label=306;break;}else{var $s7_1_i=$_1_lcssa_i117_i;label=307;break;}
 case 306: 
 HEAP8[(($27)>>0)]=48;
 var $s7_1_i=$27;label=307;break;
 case 307: 
 var $s7_1_i;
 var $1042=$s7_1_i;
 var $1043=((($26)-($1042))|0);
 ___fwritex($s7_1_i,$1043,$f);
 var $1044=(($d_4180_i+4)|0);
 var $1045=($1044>>>0)>($_36_i>>>0);
 if($1045){label=308;break;}else{var $d_4180_i=$1044;label=300;break;}
 case 308: 
 var $_not_i=$953^1;
 var $1047=$fl_1_&8;
 var $1048=($1047|0)==0;
 var $or_cond32_i=$1048&$_not_i;
 if($or_cond32_i){label=310;break;}else{label=309;break;}
 case 309: 
 ___fwritex(2328,1,$f);
 label=310;break;
 case 310: 
 var $1050=($1044>>>0)<($z_6_i>>>0);
 var $1051=($_314_i|0)>0;
 var $or_cond7169_i=$1050&$1051;
 if($or_cond7169_i){var $d_5170_i=$1044;var $_415171_i=$_314_i;label=311;break;}else{var $_415_lcssa_i=$_314_i;label=316;break;}
 case 311: 
 var $_415171_i;
 var $d_5170_i;
 var $1052=HEAP32[(($d_5170_i)>>2)];
 var $1053=($1052|0)==0;
 if($1053){var $s8_0165_i=$25;label=314;break;}else{var $_12_i124_i=$25;var $y_03_i123_i=$1052;label=312;break;}
 case 312: 
 var $y_03_i123_i;
 var $_12_i124_i;
 var $1054=(((($y_03_i123_i>>>0))%(10))&-1);
 var $1055=$1054|48;
 var $1056=(($1055)&255);
 var $1057=((($_12_i124_i)-(1))|0);
 HEAP8[(($1057)>>0)]=$1056;
 var $1058=(((($y_03_i123_i>>>0))/(10))&-1);
 var $1059=($y_03_i123_i>>>0)<10;
 if($1059){label=313;break;}else{var $_12_i124_i=$1057;var $y_03_i123_i=$1058;label=312;break;}
 case 313: 
 var $1060=($1057>>>0)>($14>>>0);
 if($1060){var $s8_0165_i=$1057;label=314;break;}else{var $s8_0_lcssa_i=$1057;label=315;break;}
 case 314: 
 var $s8_0165_i;
 var $1061=((($s8_0165_i)-(1))|0);
 HEAP8[(($1061)>>0)]=48;
 var $1062=($1061>>>0)>($14>>>0);
 if($1062){var $s8_0165_i=$1061;label=314;break;}else{var $s8_0_lcssa_i=$1061;label=315;break;}
 case 315: 
 var $s8_0_lcssa_i;
 var $1063=($_415171_i|0)>9;
 var $1064=($1063?9:$_415171_i);
 ___fwritex($s8_0_lcssa_i,$1064,$f);
 var $1065=(($d_5170_i+4)|0);
 var $1066=((($_415171_i)-(9))|0);
 var $1067=($1065>>>0)<($z_6_i>>>0);
 var $1068=($1066|0)>0;
 var $or_cond7_i=$1067&$1068;
 if($or_cond7_i){var $d_5170_i=$1065;var $_415171_i=$1066;label=311;break;}else{var $_415_lcssa_i=$1066;label=316;break;}
 case 316: 
 var $_415_lcssa_i;
 var $$etemp$61$0=256;
 var $$etemp$61$1=0;

 var $1069=($_415_lcssa_i|0)>0;
 if($1069){label=317;break;}else{label=339;break;}
 case 317: 
 var $1071=($_415_lcssa_i>>>0)>256;
 var $1072=($1071?256:$_415_lcssa_i);
 _memset($6, 48, $1072)|0;
 var $1073=($_415_lcssa_i>>>0)>255;
 if($1073){var $_01_i131_i=$_415_lcssa_i;label=318;break;}else{var $_0_lcssa_i133_i=$_415_lcssa_i;label=320;break;}
 case 318: 
 var $_01_i131_i;
 ___fwritex($6,256,$f);
 var $1074=((($_01_i131_i)-(256))|0);
 var $1075=($1074>>>0)>255;
 if($1075){var $_01_i131_i=$1074;label=318;break;}else{label=319;break;}
 case 319: 
 var $1076=$_415_lcssa_i&255;
 var $_0_lcssa_i133_i=$1076;label=320;break;
 case 320: 
 var $_0_lcssa_i133_i;
 ___fwritex($6,$_0_lcssa_i133_i,$f);
 label=339;break;
 case 321: 
 var $1079=(($a_8_ph_i+4)|0);
 var $z_6__i=($_lcssa292_i?$z_6_i:$1079);
 var $1080=($_314_i|0)>-1;
 if($1080){label=322;break;}else{label=338;break;}
 case 322: 
 var $1081=$fl_1_&8;
 var $1082=($1081|0)==0;
 var $d_6188_i=$a_8_ph_i;var $_5189_i=$_314_i;label=323;break;
 case 323: 
 var $_5189_i;
 var $d_6188_i;
 var $1084=HEAP32[(($d_6188_i)>>2)];
 var $1085=($1084|0)==0;
 if($1085){label=326;break;}else{var $_12_i139_i=$25;var $y_03_i138_i=$1084;label=324;break;}
 case 324: 
 var $y_03_i138_i;
 var $_12_i139_i;
 var $1086=(((($y_03_i138_i>>>0))%(10))&-1);
 var $1087=$1086|48;
 var $1088=(($1087)&255);
 var $1089=((($_12_i139_i)-(1))|0);
 HEAP8[(($1089)>>0)]=$1088;
 var $1090=(((($y_03_i138_i>>>0))/(10))&-1);
 var $1091=($y_03_i138_i>>>0)<10;
 if($1091){label=325;break;}else{var $_12_i139_i=$1089;var $y_03_i138_i=$1090;label=324;break;}
 case 325: 
 var $1092=($1089|0)==($25|0);
 if($1092){label=326;break;}else{var $s9_0_i=$1089;label=327;break;}
 case 326: 
 HEAP8[(($27)>>0)]=48;
 var $s9_0_i=$27;label=327;break;
 case 327: 
 var $s9_0_i;
 var $1094=($d_6188_i|0)==($a_8_ph_i|0);
 if($1094){label=330;break;}else{label=328;break;}
 case 328: 
 var $1095=($s9_0_i>>>0)>($14>>>0);
 if($1095){var $s9_1184_i=$s9_0_i;label=329;break;}else{var $s9_2_i=$s9_0_i;label=332;break;}
 case 329: 
 var $s9_1184_i;
 var $1096=((($s9_1184_i)-(1))|0);
 HEAP8[(($1096)>>0)]=48;
 var $1097=($1096>>>0)>($14>>>0);
 if($1097){var $s9_1184_i=$1096;label=329;break;}else{var $s9_2_i=$1096;label=332;break;}
 case 330: 
 var $1099=(($s9_0_i+1)|0);
 ___fwritex($s9_0_i,1,$f);
 var $1100=($_5189_i|0)<1;
 var $or_cond34_i=$1100&$1082;
 if($or_cond34_i){var $s9_2_i=$1099;label=332;break;}else{label=331;break;}
 case 331: 
 ___fwritex(2328,1,$f);
 var $s9_2_i=$1099;label=332;break;
 case 332: 
 var $s9_2_i;
 var $1102=$s9_2_i;
 var $1103=((($26)-($1102))|0);
 var $1104=($_5189_i|0)>($1103|0);
 var $__5_i=($1104?$1103:$_5189_i);
 ___fwritex($s9_2_i,$__5_i,$f);
 var $1105=((($_5189_i)-($1103))|0);
 var $1106=(($d_6188_i+4)|0);
 var $1107=($1106>>>0)<($z_6__i>>>0);
 var $1108=($1105|0)>-1;
 var $or_cond9_i=$1107&$1108;
 if($or_cond9_i){var $d_6188_i=$1106;var $_5189_i=$1105;label=323;break;}else{label=333;break;}
 case 333: 
 var $$etemp$62$0=256;
 var $$etemp$62$1=0;

 var $1109=($1105|0)>0;
 if($1109){label=334;break;}else{label=338;break;}
 case 334: 
 var $1111=($1105>>>0)>256;
 var $1112=($1111?256:$1105);
 _memset($6, 48, $1112)|0;
 var $1113=($1105>>>0)>255;
 if($1113){var $_01_i146_i=$1105;label=335;break;}else{var $_0_lcssa_i148_i=$1105;label=337;break;}
 case 335: 
 var $_01_i146_i;
 ___fwritex($6,256,$f);
 var $1114=((($_01_i146_i)-(256))|0);
 var $1115=($1114>>>0)>255;
 if($1115){var $_01_i146_i=$1114;label=335;break;}else{label=336;break;}
 case 336: 
 var $1116=$1105&255;
 var $_0_lcssa_i148_i=$1116;label=337;break;
 case 337: 
 var $_0_lcssa_i148_i;
 ___fwritex($6,$_0_lcssa_i148_i,$f);
 label=338;break;
 case 338: 
 var $$etemp$63$0=256;
 var $$etemp$63$1=0;

 var $1118=$estr_2_i;
 var $1119=((($19)-($1118))|0);
 ___fwritex($estr_2_i,$1119,$f);
 label=339;break;
 case 339: 
 var $$etemp$64$0=256;
 var $$etemp$64$1=0;

 var $1120=($1002|0)==8192;
 var $or_cond_i_i=$1120&$1004;
 if($or_cond_i_i){label=340;break;}else{label=344;break;}
 case 340: 
 var $1122=((($w_1)-($1001))|0);
 var $1123=($1122>>>0)>256;
 var $1124=($1123?256:$1122);
 _memset($6, 32, $1124)|0;
 var $1125=($1122>>>0)>255;
 if($1125){var $_01_i_i=$1122;label=341;break;}else{var $_0_lcssa_i_i=$1122;label=343;break;}
 case 341: 
 var $_01_i_i;
 ___fwritex($6,256,$f);
 var $1126=((($_01_i_i)-(256))|0);
 var $1127=($1126>>>0)>255;
 if($1127){var $_01_i_i=$1126;label=341;break;}else{label=342;break;}
 case 342: 
 var $1128=$1122&255;
 var $_0_lcssa_i_i=$1128;label=343;break;
 case 343: 
 var $_0_lcssa_i_i;
 ___fwritex($6,$_0_lcssa_i_i,$f);
 label=344;break;
 case 344: 
 var $$etemp$65$0=256;
 var $$etemp$65$1=0;

 var $w_35_i=($1004?$w_1:$1001);
 var $l_0=$w_35_i;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$242;var $28=$243;var $fmt83=$169;label=2;break;
 case 345: 
 var $1131;
 var $1132;
 var $a_2;
 var $z_2;
 var $fl_6;
 var $p_5;
 var $prefix_2;
 var $pl_2;
 var $1133=$z_2;
 var $1134=$a_2;
 var $1135=((($1133)-($1134))|0);
 var $1136=($p_5|0)<($1135|0);
 var $_p_5=($1136?$1135:$p_5);
 var $1137=((($pl_2)+($_p_5))|0);
 var $1138=($w_1|0)<($1137|0);
 var $w_2=($1138?$1137:$w_1);
 var $$etemp$66$0=256;
 var $$etemp$66$1=0;

 var $1139=$fl_6&73728;
 var $1140=($1139|0)==0;
 var $1141=($w_2|0)>($1137|0);
 var $or_cond_i75=$1140&$1141;
 if($or_cond_i75){label=346;break;}else{label=350;break;}
 case 346: 
 var $1143=((($w_2)-($1137))|0);
 var $1144=($1143>>>0)>256;
 var $1145=($1144?256:$1143);
 _memset($6, 32, $1145)|0;
 var $1146=($1143>>>0)>255;
 if($1146){var $_01_i77=$1143;label=347;break;}else{var $_0_lcssa_i79=$1143;label=349;break;}
 case 347: 
 var $_01_i77;
 ___fwritex($6,256,$f);
 var $1147=((($_01_i77)-(256))|0);
 var $1148=($1147>>>0)>255;
 if($1148){var $_01_i77=$1147;label=347;break;}else{label=348;break;}
 case 348: 
 var $1149=$1143&255;
 var $_0_lcssa_i79=$1149;label=349;break;
 case 349: 
 var $_0_lcssa_i79;
 ___fwritex($6,$_0_lcssa_i79,$f);
 label=350;break;
 case 350: 
 var $$etemp$67$0=256;
 var $$etemp$67$1=0;

 ___fwritex($prefix_2,$pl_2,$f);
 var $$etemp$68$0=256;
 var $$etemp$68$1=0;

 var $1151=($1139|0)==65536;
 var $or_cond_i51=$1151&$1141;
 if($or_cond_i51){label=351;break;}else{label=355;break;}
 case 351: 
 var $1153=((($w_2)-($1137))|0);
 var $1154=($1153>>>0)>256;
 var $1155=($1154?256:$1153);
 _memset($6, 48, $1155)|0;
 var $1156=($1153>>>0)>255;
 if($1156){var $_01_i53=$1153;label=352;break;}else{var $_0_lcssa_i55=$1153;label=354;break;}
 case 352: 
 var $_01_i53;
 ___fwritex($6,256,$f);
 var $1157=((($_01_i53)-(256))|0);
 var $1158=($1157>>>0)>255;
 if($1158){var $_01_i53=$1157;label=352;break;}else{label=353;break;}
 case 353: 
 var $1159=$1153&255;
 var $_0_lcssa_i55=$1159;label=354;break;
 case 354: 
 var $_0_lcssa_i55;
 ___fwritex($6,$_0_lcssa_i55,$f);
 label=355;break;
 case 355: 
 var $$etemp$69$0=256;
 var $$etemp$69$1=0;

 var $$etemp$70$0=256;
 var $$etemp$70$1=0;

 var $1161=($_p_5|0)>($1135|0);
 if($1161){label=356;break;}else{label=360;break;}
 case 356: 
 var $1163=((($_p_5)-($1135))|0);
 var $1164=($1163>>>0)>256;
 var $1165=($1164?256:$1163);
 _memset($6, 48, $1165)|0;
 var $1166=($1163>>>0)>255;
 if($1166){var $_01_i38=$1163;label=357;break;}else{var $_0_lcssa_i40=$1163;label=359;break;}
 case 357: 
 var $_01_i38;
 ___fwritex($6,256,$f);
 var $1167=((($_01_i38)-(256))|0);
 var $1168=($1167>>>0)>255;
 if($1168){var $_01_i38=$1167;label=357;break;}else{label=358;break;}
 case 358: 
 var $1169=$1163&255;
 var $_0_lcssa_i40=$1169;label=359;break;
 case 359: 
 var $_0_lcssa_i40;
 ___fwritex($6,$_0_lcssa_i40,$f);
 label=360;break;
 case 360: 
 var $$etemp$71$0=256;
 var $$etemp$71$1=0;

 ___fwritex($a_2,$1135,$f);
 var $$etemp$72$0=256;
 var $$etemp$72$1=0;

 var $1171=($1139|0)==8192;
 var $or_cond_i=$1171&$1141;
 if($or_cond_i){label=361;break;}else{var $l_0=$w_2;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$1132;var $28=$1131;var $fmt83=$169;label=2;break;}
 case 361: 
 var $1173=((($w_2)-($1137))|0);
 var $1174=($1173>>>0)>256;
 var $1175=($1174?256:$1173);
 _memset($6, 32, $1175)|0;
 var $1176=($1173>>>0)>255;
 if($1176){var $_01_i=$1173;label=362;break;}else{var $_0_lcssa_i=$1173;label=364;break;}
 case 362: 
 var $_01_i;
 ___fwritex($6,256,$f);
 var $1177=((($_01_i)-(256))|0);
 var $1178=($1177>>>0)>255;
 if($1178){var $_01_i=$1177;label=362;break;}else{label=363;break;}
 case 363: 
 var $1179=$1173&255;
 var $_0_lcssa_i=$1179;label=364;break;
 case 364: 
 var $_0_lcssa_i;
 ___fwritex($6,$_0_lcssa_i,$f);
 var $l_0=$w_2;var $cnt_0=$cnt_1;var $l10n_0=$l10n_3;var $29=$1132;var $28=$1131;var $fmt83=$169;label=2;break;
 case 365: 
 var $1182=($f|0)==0;
 if($1182){label=366;break;}else{var $_0=$cnt_1;label=384;break;}
 case 366: 
 var $1184=($l10n_0|0)==0;
 if($1184){var $_0=0;label=384;break;}else{var $i_2100=1;label=367;break;}
 case 367: 
 var $i_2100;
 var $1185=(($nl_type+($i_2100<<2))|0);
 var $1186=HEAP32[(($1185)>>2)];
 var $1187=($1186|0)==0;
 if($1187){var $i_397=$i_2100;var $1234=1;label=383;break;}else{label=368;break;}
 case 368: 
 var $1189=(($nl_arg+($i_2100<<3))|0);
 var $1190=($1186>>>0)>20;
 if($1190){label=380;break;}else{label=369;break;}
 case 369: 
 switch(($1186|0)){case 9:{ label=370;break;}case 10:{ label=371;break;}case 11:{ label=372;break;}case 12:{ label=373;break;}case 13:{ label=374;break;}case 14:{ label=375;break;}case 15:{ label=376;break;}case 16:{ label=377;break;}case 17:{ label=378;break;}case 18:{ label=379;break;}default:{label=380;break;}}break;
 case 370: 
 var $1193=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $1194=$1189;
 HEAP32[(($1194)>>2)]=$1193;
 label=380;break;
 case 371: 
 var $1196=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $1197$0=$1196;
 var $1197$1=((((($1196|0)<0))|0)?-1:0);
 var $1198=(($1189)|0);
 var $st$73$0=(($1198)|0);
 HEAP32[(($st$73$0)>>2)]=$1197$0;
 var $st$74$1=(($1198+4)|0);
 HEAP32[(($st$74$1)>>2)]=$1197$1;
 label=380;break;
 case 372: 
 var $1200=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $1201$0=$1200;
 var $1201$1=0;
 var $1202=(($1189)|0);
 var $st$75$0=(($1202)|0);
 HEAP32[(($st$75$0)>>2)]=$1201$0;
 var $st$76$1=(($1202+4)|0);
 HEAP32[(($st$76$1)>>2)]=$1201$1;
 label=380;break;
 case 373: 
 var $1204$0=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $1204$1=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $1205=(($1189)|0);
 var $st$77$0=(($1205)|0);
 HEAP32[(($st$77$0)>>2)]=$1204$0;
 var $st$78$1=(($1205+4)|0);
 HEAP32[(($st$78$1)>>2)]=$1204$1;
 label=380;break;
 case 374: 
 var $1207=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $1208=(($1207)&65535);
 var $1209$0=(($1208<<16)>>16);
 var $1209$1=(((((($1208<<16)>>16)<0))|0)?-1:0);
 var $1210=(($1189)|0);
 var $st$79$0=(($1210)|0);
 HEAP32[(($st$79$0)>>2)]=$1209$0;
 var $st$80$1=(($1210+4)|0);
 HEAP32[(($st$80$1)>>2)]=$1209$1;
 label=380;break;
 case 375: 
 var $1212=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $_mask1_i=$1212&65535;
 var $1213$0=$_mask1_i;
 var $1213$1=0;
 var $1214=(($1189)|0);
 var $st$81$0=(($1214)|0);
 HEAP32[(($st$81$0)>>2)]=$1213$0;
 var $st$82$1=(($1214+4)|0);
 HEAP32[(($st$82$1)>>2)]=$1213$1;
 label=380;break;
 case 376: 
 var $1216=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $1217=(($1216)&255);
 var $1218$0=(($1217<<24)>>24);
 var $1218$1=(((((($1217<<24)>>24)<0))|0)?-1:0);
 var $1219=(($1189)|0);
 var $st$83$0=(($1219)|0);
 HEAP32[(($st$83$0)>>2)]=$1218$0;
 var $st$84$1=(($1219+4)|0);
 HEAP32[(($st$84$1)>>2)]=$1218$1;
 label=380;break;
 case 377: 
 var $1221=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAP32[(((HEAP32[(($4)>>2)])+(tempInt))>>2)]);
 var $_mask_i=$1221&255;
 var $1222$0=$_mask_i;
 var $1222$1=0;
 var $1223=(($1189)|0);
 var $st$85$0=(($1223)|0);
 HEAP32[(($st$85$0)>>2)]=$1222$0;
 var $st$86$1=(($1223+4)|0);
 HEAP32[(($st$86$1)>>2)]=$1222$1;
 label=380;break;
 case 378: 
 var $1225=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAPF64[(((HEAP32[(($4)>>2)])+(tempInt))>>3)]);
 var $1226=$1189;
 HEAPF64[(($1226)>>3)]=$1225;
 label=380;break;
 case 379: 
 var $1228=(tempInt=HEAP32[((($4)+(4))>>2)],HEAP32[((($4)+(4))>>2)]=tempInt + 8,HEAPF64[(((HEAP32[(($4)>>2)])+(tempInt))>>3)]);
 var $1229=$1189;
 HEAPF64[(($1229)>>3)]=$1228;
 label=380;break;
 case 380: 
 var $1230=((($i_2100)+(1))|0);
 var $1231=($1230|0)<10;
 if($1231){var $i_2100=$1230;label=367;break;}else{var $_0=1;label=384;break;}
 case 381: 
 var $1233=($1235|0)<10;
 if($1233){label=382;break;}else{var $_0=1;label=384;break;}
 case 382: 
 var $_phi_trans_insert=(($nl_type+($1235<<2))|0);
 var $_pre18=HEAP32[(($_phi_trans_insert)>>2)];
 var $phitmp20=($_pre18|0)==0;
 var $i_397=$1235;var $1234=$phitmp20;label=383;break;
 case 383: 
 var $1234;
 var $i_397;
 var $1235=((($i_397)+(1))|0);
 if($1234){label=381;break;}else{var $_0=-1;label=384;break;}
 case 384: 
 var $_0;
 var $$etemp$87$0=40;
 var $$etemp$87$1=0;

 STACKTOP=sp;return $_0;
  default: assert(0, "bad label: " + label);
 }

}

