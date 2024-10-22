// CliengoScript.js

import React, { useEffect } from 'react';

const CliengoScript = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s.cliengo.com/weboptimizer/65b295f70d9a0b003268d10a/65b295f90d9a0b003268d10d.js?platform=dashboard';
    document.getElementsByTagName('head')[0].appendChild(script);

    return () => {
      // Limpiar el script al desmontar el componente
      document.getElementsByTagName('head')[0].removeChild(script);
    };
  }, []);

  return null;
};

export default CliengoScript;
