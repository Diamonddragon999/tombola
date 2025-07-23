import { useEffect, useState } from 'react';
import { PasswordPrompt } from '@/components/PasswordPrompt';
import CaseDisplay        from '@/components/CaseDisplay';

const KEY='tombola_razvan_auth';

export default function RazvanPage(){
  const [auth,setAuth]=useState(false);
  useEffect(()=>{ if(localStorage.getItem(KEY)==='ok') setAuth(true); },[]);
  return auth
    ? <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700
                      flex items-center justify-center p-6">
        <CaseDisplay/>
      </div>
    : <PasswordPrompt onCorrectPassword={()=>{
        localStorage.setItem(KEY,'ok'); setAuth(true); }}/>
}
