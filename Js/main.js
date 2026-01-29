// ===== KLASA =====
class Zabawa {
  static getArrayOfAble(b, group){
    let able=[];
    const groupMap={
      OBD:[Ppl.YOUNGER,Ppl.ODB,Ppl.EVERYWHERE],
      OND:[Ppl.YOUNGER,Ppl.OLDER,Ppl.OND,Ppl.EVERYWHERE],
      ONZ:[Ppl.OLDER,Ppl.ONZ,Ppl.EVERYWHERE]
    };
    const allowed=groupMap[group];
    for(const z of b){
      if(allowed.includes(z.ppl)) able.push(z);
    }
    return able;
  }

  static getTimeDistribution(totalMinutes){
    let short=0, medium=0, long=0, depends=1, usedTime=10;
    while(true){
      let remaining=totalMinutes-usedTime;
      if(remaining<5) break;
      if(remaining>=15){
        const roll=Math.floor(Math.random()*3);
        if(roll===0){ short++; usedTime+=9; }
        else if(roll===1){ medium++; usedTime+=12; }
        else { long++; usedTime+=20; }
        continue;
      }
      if(remaining>=10){
        const roll=Math.floor(Math.random()*2);
        if(roll===0){ short++; usedTime+=9; }
        else { medium++; usedTime+=12; }
        continue;
      }
      short++; usedTime+=9;
    }
    return [short, medium, long, depends];
  }

  static getByTime(arr,time){ return arr.filter(z=>z.time===time); }

  static getRandomZabawy(allZabawy, group, totalMinutes){
    const able=Zabawa.getArrayOfAble(allZabawy,group);
    const shorts=Zabawa.getByTime(able,Time.SHORT);
    const mediums=Zabawa.getByTime(able,Time.MEDIUM);
    const longs=Zabawa.getByTime(able,Time.LONG);
    const dependsArr=Zabawa.getByTime(able,Time.DEPENDS);
    const [needShort, needMedium, needLong, needDepends]=Zabawa.getTimeDistribution(totalMinutes);
    let result=[];
    function pickRandom(source,count){
      let copy=[...source], picked=[];
      for(let i=0;i<count&&copy.length>0;i++){
        const idx=Math.floor(Math.random()*copy.length);
        picked.push(copy[idx]);
        copy.splice(idx,1);
      }
      return picked;
    }
    result.push(...pickRandom(shorts,needShort));
    result.push(...pickRandom(mediums,needMedium));
    result.push(...pickRandom(longs,needLong));
    result.push(...pickRandom(dependsArr,needDepends));
    return result;
  }
}

// ===== LOSOWANIE =====
const groupSelect=document.getElementById("groupSelect");
const minutesInput=document.getElementById("minutesInput");
const resultList=document.getElementById("resultList");

document.getElementById("generateBtn").addEventListener("click",()=>{
  const group=groupSelect.value;
  let minutes=parseInt(minutesInput.value)||60;

  minutes += 20; // dodajemy 20 minut do całkowitego czasu

  const result=Zabawa.getRandomZabawy(zabawy,group,minutes);
  resultList.innerHTML="";
  result.forEach(z=>{
    const li=document.createElement("li");
    li.textContent=`${z.name}`; // wyświetlamy tylko nazwy zabaw
    resultList.appendChild(li);
  });
});
