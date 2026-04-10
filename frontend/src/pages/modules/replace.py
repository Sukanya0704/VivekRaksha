import sys
import os

path = r'c:\Users\Kadamdari\Desktop\VivekMitra\VivekRaksha\frontend\src\pages\modules\OtpSimulator.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Replace ListenIcon component
text = text.replace(
'''  // Granular Inline Audio Component
  const ListenIcon = ({ text, style }) => (
    <button
      onClick={(e) => speak(text, e)}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60A5FA', padding: '0 10px', display: 'inline-flex', alignItems: 'center', transition: 'transform 0.2s', ...style }}
      title="Listen"
      type="button"
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <Volume2 size={seniorMode ? 32 : 24} />
    </button>
  );''',
'''  // Top-Level Audio Component
  const PageAudioButton = ({ text }) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
      <button
        onClick={(e) => speak(text, e)}
        className="btn btn-outline"
        style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: currentFontSize, padding: '0.8rem 1.5rem', borderRadius: '30px', color: '#60A5FA', borderColor: '#60A5FA', background: 'rgba(96, 165, 250, 0.1)' }}
        title="Listen to this page"
        type="button"
      >
        <Volume2 size={24} /> {t('listenToPage') || 'Listen to Screen'}
      </button>
    </div>
  );'''
)

# 2. Step 1
s1_old = '''  const renderStepOne = () => (
    <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
      <Lock size={64} color="#EF4444" style={{ marginBottom: '1.5rem', marginTop: '1rem' }} />
      <h3 style={{ fontSize: headingSize, marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {t('otpGoldenRule')} <ListenIcon text={t('otpGoldenRule')} />
      </h3>
      <p style={{ fontSize: currentFontSize, color: 'rgba(234, 234, 234, 0.9)', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        "{t('otpGoldenRuleDesc')}" <ListenIcon text={t('otpGoldenRuleDesc')} />
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: seniorMode ? '1fr' : 'repeat(2, 1fr)', gap: '1.5rem', textAlign: 'left' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '5px solid #10B981' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#10B981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            {t('otpSafe')} <ListenIcon text={t('otpSafe')} />
          </p>
          <p style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'center' }}>
            {t('otpSafeDesc')} <ListenIcon text={t('otpSafeDesc')} />
          </p>
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '5px solid #EF4444' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#EF4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            {t('otpDanger')} <ListenIcon text={t('otpDanger')} />
          </p>
          <p style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'center' }}>
            {t('otpDangerDesc')} <ListenIcon text={t('otpDangerDesc')} />
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', justifyContent: 'center' }}>
        <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: '1.2rem' }} onClick={() => handleNextStep(2, t('scenarioHubTitle'))}>
          {t('readyStartSimulation')}
        </button>
      </div>
    </div>
  );'''
s1_new = '''  const renderStepOne = () => (
    <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
      <PageAudioButton text={`${t('otpGoldenRule')}. ${t('otpGoldenRuleDesc')}. ${t('otpSafe')}. ${t('otpSafeDesc')}. ${t('otpDanger')}. ${t('otpDangerDesc')}`} />
      <Lock size={64} color="#EF4444" style={{ marginBottom: '1.5rem', marginTop: '1rem' }} />
      <h3 style={{ fontSize: headingSize, marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {t('otpGoldenRule')}
      </h3>
      <p style={{ fontSize: currentFontSize, color: 'rgba(234, 234, 234, 0.9)', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        "{t('otpGoldenRuleDesc')}"
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: seniorMode ? '1fr' : 'repeat(2, 1fr)', gap: '1.5rem', textAlign: 'left' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '5px solid #10B981' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#10B981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            {t('otpSafe')}
          </p>
          <p style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'center' }}>
            {t('otpSafeDesc')}
          </p>
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '5px solid #EF4444' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#EF4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            {t('otpDanger')}
          </p>
          <p style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'center' }}>
            {t('otpDangerDesc')}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', justifyContent: 'center' }}>
        <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: '1.2rem' }} onClick={() => handleNextStep(2, t('scenarioHubTitle'))}>
          {t('readyStartSimulation')}
        </button>
      </div>
    </div>
  );'''
text = text.replace(s1_old, s1_new)

# 3. Step 2
s2_old = '''  const renderStepTwoHub = () => {
    const langData = scenariosData[language] || scenariosData['en'];
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: headingSize, marginBottom: '3rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {t('scenarioHubTitle')} <ListenIcon text={t('scenarioHubTitle')} />
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {Object.keys(langData).map((key) => (
            <div
              key={key}
              onClick={() => { setActiveScenario(key); handleNextStep(3); }}
              style={{
                background: '#2A2A2A',
                borderRadius: '24px',
                padding: '2rem',
                cursor: 'pointer',
                border: '3px solid #4B5563',
                transition: 'transform 0.2s, borderColor 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = '#4B5563'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {langData[key].icon}
              <h4 style={{ fontSize: currentFontSize, fontWeight: 'bold' }}>{langData[key].title}</h4>
              <div onClick={(e) => { e.stopPropagation(); speak(langData[key].title, e); }}>
                <ListenIcon text={langData[key].title} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '50%', padding: '10px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  };'''
s2_new = '''  const renderStepTwoHub = () => {
    const langData = scenariosData[language] || scenariosData['en'];
    const speakText = `${t('scenarioHubTitle')}. ` + Object.keys(langData).map(k => langData[k].title).join('. ');
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <PageAudioButton text={speakText} />
        <h3 style={{ fontSize: headingSize, marginBottom: '3rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {t('scenarioHubTitle')}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {Object.keys(langData).map((key) => (
            <div
              key={key}
              onClick={() => { setActiveScenario(key); handleNextStep(3); }}
              style={{
                background: '#2A2A2A',
                borderRadius: '24px',
                padding: '2rem',
                cursor: 'pointer',
                border: '3px solid #4B5563',
                transition: 'transform 0.2s, borderColor 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = '#4B5563'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {langData[key].icon}
              <h4 style={{ fontSize: currentFontSize, fontWeight: 'bold' }}>{langData[key].title}</h4>
            </div>
          ))}
        </div>
      </div>
    )
  };'''
text = text.replace(s2_old, s2_new)

# Step 3
s3_old = '''  const renderStepThreeBreakdown = () => {
    const data = getActiveData();
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: headingSize, textAlign: 'center', marginBottom: '2rem', color: '#FF9F1C', marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Search size={28} style={{ marginRight: '10px' }} />
          {t('spotTheScam')} <ListenIcon text={t('spotTheScam')} />
        </h3>

        <div style={{ background: '#e5e7eb', color: '#1a1a1a', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', fontSize: currentFontSize, display: 'flex', alignItems: 'center' }}>
          <div>
            <span style={{ backgroundColor: '#FCA5A5', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{data.smsText[0]}</span>
            {data.smsText[1]}
            <span style={{ backgroundColor: '#FCA5A5', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{data.smsText[2]}</span>
            {data.smsText[3]}
            <span style={{ backgroundColor: '#FCA5A5', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', wordBreak: 'break-all' }}>{data.smsText[4]}</span>
          </div>
          <ListenIcon text={data.smsText.join("")} style={{ marginLeft: '1rem' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.breakdown.map((item, index) => (
            <div key={index} style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '6px solid #EF4444', padding: '1.5rem', borderRadius: '0 8px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 'bold', color: '#EF4444', marginBottom: '0.5rem', fontSize: currentFontSize }}>"{item.text}"</p>
                <p style={{ fontSize: currentFontSize }}>{item.explanation}</p>
              </div>
              <ListenIcon text={item.text + ". " + item.explanation} />
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1.5rem', fontSize: '1.3rem' }} onClick={() => handleNextStep(4)}>
          {t('nextStep') || 'Continue'}
        </button>
      </div>
    )
  };'''
s3_new = '''  const renderStepThreeBreakdown = () => {
    const data = getActiveData();
    const speakText = `${t('spotTheScam')}. ${data.smsText.join("")}. ` + data.breakdown.map(i => `${i.text}. ${i.explanation}`).join('. ');
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
        <PageAudioButton text={speakText} />
        <h3 style={{ fontSize: headingSize, textAlign: 'center', marginBottom: '2rem', color: '#FF9F1C', marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Search size={28} style={{ marginRight: '10px' }} />
          {t('spotTheScam')}
        </h3>

        <div style={{ background: '#e5e7eb', color: '#1a1a1a', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', fontSize: currentFontSize, display: 'flex', alignItems: 'center' }}>
          <div>
            <span style={{ backgroundColor: '#FCA5A5', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{data.smsText[0]}</span>
            {data.smsText[1]}
            <span style={{ backgroundColor: '#FCA5A5', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{data.smsText[2]}</span>
            {data.smsText[3]}
            <span style={{ backgroundColor: '#FCA5A5', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', wordBreak: 'break-all' }}>{data.smsText[4]}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.breakdown.map((item, index) => (
            <div key={index} style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '6px solid #EF4444', padding: '1.5rem', borderRadius: '0 8px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 'bold', color: '#EF4444', marginBottom: '0.5rem', fontSize: currentFontSize }}>"{item.text}"</p>
                <p style={{ fontSize: currentFontSize }}>{item.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1.5rem', fontSize: '1.3rem' }} onClick={() => handleNextStep(4)}>
          {t('nextStep') || 'Continue'}
        </button>
      </div>
    )
  };'''
text = text.replace(s3_old, s3_new)

# Step 4
s4_old = '''  const renderStepFourDecision = () => {
    const data = getActiveData().decision;
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <Smartphone size={80} color="#3B82F6" style={{ margin: '2rem auto 1.5rem' }} />
        <h3 style={{ fontSize: headingSize, marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          {data.question} <ListenIcon text={data.question} />
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
          {data.options.map((opt, i) => (
            <button
              key={i}
              className={`btn ${opt.isDanger ? 'btn-warning' : 'btn-outline'}`}
              style={{ fontSize: currentFontSize, padding: '1.5rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: opt.isSafe ? '3px solid #10B981' : undefined }}
              onClick={() => {
                setRiskScore(opt.isDanger ? 'high' : 'safe');
                handleNextStep(opt.nextStep);
              }}
            >
              <span>{opt.isDanger ? "❌" : "✅"} {opt.text}</span>
              <ListenIcon text={opt.text} style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '50%' }} />
            </button>
          ))}
        </div>
      </div>
    );
  };'''
s4_new = '''  const renderStepFourDecision = () => {
    const data = getActiveData().decision;
    const speakText = `${data.question}. ` + data.options.map(o => o.text).join('. ');
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <PageAudioButton text={speakText} />
        <Smartphone size={80} color="#3B82F6" style={{ margin: '2rem auto 1.5rem' }} />
        <h3 style={{ fontSize: headingSize, marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          {data.question}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
          {data.options.map((opt, i) => (
            <button
              key={i}
              className={`btn ${opt.isDanger ? 'btn-warning' : 'btn-outline'}`}
              style={{ fontSize: currentFontSize, padding: '1.5rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: opt.isSafe ? '3px solid #10B981' : undefined }}
              onClick={() => {
                setRiskScore(opt.isDanger ? 'high' : 'safe');
                handleNextStep(opt.nextStep);
              }}
            >
              <span>{opt.isDanger ? "❌" : "✅"} {opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };'''
text = text.replace(s4_old, s4_new)

# Step 5
s5_old = '''  const renderStepFiveSandbox = () => {
    const data = getActiveData();
    return (
      <div className="animate-fade-in" style={{ background: '#ffffff', color: '#000000', padding: '2rem', borderRadius: '12px', maxWidth: '500px', margin: '0 auto', borderTop: '8px solid #EF4444', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <ListenIcon text={data.sandboxMsg + ". " + data.fakeLink + ". " + data.sandboxDetail + ". " + data.btnText} />
        </div>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h4 style={{ marginTop: '1rem', color: '#1a1a1a', fontWeight: 'bold', fontSize: '2rem' }}>
            {data.sandboxMsg}
          </h4>
          <p style={{ color: '#EF4444', fontSize: '1.1rem', wordBreak: 'break-all' }}>{data.fakeLink}</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 'bold', fontSize: '1.3rem' }}>{data.sandboxDetail}</label>
          <input
            type={activeScenario === 'upi' ? "password" : "text"}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="*** ***"
            style={{ width: '100%', padding: '1.2rem', borderRadius: '8px', border: '3px solid #ccc', fontSize: '1.5rem' }}
          />
        </div>
        <button
          className="btn btn-primary"
          style={{ width: '100%', background: '#EF4444', padding: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}
          onClick={() => handleNextStep(6)}
        >
          {data.btnText}
        </button>

        <p style={{ marginTop: '2rem', fontSize: '1.2rem', textAlign: 'center', color: '#EF4444', fontWeight: 'bold' }}>⚠️ SIMULATION MODE</p>
      </div>
    );
  };'''
s5_new = '''  const renderStepFiveSandbox = () => {
    const data = getActiveData();
    const speakText = `${data.sandboxMsg}. ${data.fakeLink}. ${data.sandboxDetail}. ${data.btnText}`;
    return (
      <div className="animate-fade-in" style={{ background: '#ffffff', color: '#000000', padding: '2rem', borderRadius: '12px', maxWidth: '500px', margin: '0 auto', borderTop: '8px solid #EF4444', position: 'relative' }}>
        <PageAudioButton text={speakText} />
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h4 style={{ marginTop: '1rem', color: '#1a1a1a', fontWeight: 'bold', fontSize: '2rem' }}>
            {data.sandboxMsg}
          </h4>
          <p style={{ color: '#EF4444', fontSize: '1.1rem', wordBreak: 'break-all' }}>{data.fakeLink}</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 'bold', fontSize: '1.3rem' }}>{data.sandboxDetail}</label>
          <input
            type={activeScenario === 'upi' ? "password" : "text"}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="*** ***"
            style={{ width: '100%', padding: '1.2rem', borderRadius: '8px', border: '3px solid #ccc', fontSize: '1.5rem' }}
          />
        </div>
        <button
          className="btn btn-primary"
          style={{ width: '100%', background: '#EF4444', padding: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}
          onClick={() => handleNextStep(6)}
        >
          {data.btnText}
        </button>

        <p style={{ marginTop: '2rem', fontSize: '1.2rem', textAlign: 'center', color: '#EF4444', fontWeight: 'bold' }}>⚠️ SIMULATION MODE</p>
      </div>
    );
  };'''
text = text.replace(s5_old, s5_new)

# Step 6
s6_old = '''  const renderStepSixConsequence = () => {
    return (
      <div className="glass-panel animate-fade-in" style={{ border: `5px solid #EF4444`, padding: '3rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
          <AlertTriangle size={100} color="#EF4444" style={{ margin: '0 auto 1.5rem', animation: 'bounce 1s infinite' }} />
          <h2 style={{ fontSize: headingSize, color: '#EF4444', marginBottom: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {t('consequenceTitle')} <ListenIcon text={t('consequenceTitle')} />
          </h2>
          <p style={{ fontSize: currentFontSize, color: 'rgba(234, 234, 234, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {t('consequenceText')} <ListenIcon text={t('consequenceText')} />
          </p>
        </div>

        {/* The Shocking SMS Alert */}
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '2rem', borderRadius: '16px', borderLeft: '10px solid #EF4444', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: headingSize, fontWeight: 'bold', color: '#FFA0A0', lineHeight: '1.6' }}>
            {t('debitAlert')}
          </p>
          <ListenIcon text={t('debitAlert')} />
        </div>

        {/* Recovery Solutions Section */}
        <div style={{ background: '#2C2C2C', padding: '3rem', borderRadius: '16px', border: '2px solid #3A3A3A' }}>
          <h4 style={{ color: '#10B981', fontSize: headingSize, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={36} /> {t('recoverySteps')} <ListenIcon text={t('recoverySteps')} />
          </h4>
          <ul style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <li style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <PhoneCall size={32} color="#3B82F6" style={{ marginTop: '4px' }} />
              <span>{t('recovery1')} <ListenIcon text={t('recovery1')} /></span>
            </li>
            <li style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <CreditCard size={32} color="#FF9F1C" style={{ marginTop: '4px' }} />
              <span>{t('recovery2')} <ListenIcon text={t('recovery2')} /></span>
            </li>
            <li style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <Globe size={32} color="#10B981" style={{ marginTop: '4px' }} />
              <span>{t('recovery3')} <ListenIcon text={t('recovery3')} /></span>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3.5rem' }}>
          <button className="btn btn-outline" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => { setStep(2); setRiskScore(null); setInputVal(''); }}>
            Try Another Scenario
          </button>
          <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => navigate('/banking')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  };'''
s6_new = '''  const renderStepSixConsequence = () => {
    const speakText = `${t('consequenceTitle')}. ${t('consequenceText')}. ${t('debitAlert')}. ${t('recoverySteps')}. ${t('recovery1')}. ${t('recovery2')}. ${t('recovery3')}`;
    return (
      <div className="glass-panel animate-fade-in" style={{ border: `5px solid #EF4444`, padding: '3rem' }}>
        <PageAudioButton text={speakText} />

        <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
          <AlertTriangle size={100} color="#EF4444" style={{ margin: '0 auto 1.5rem', animation: 'bounce 1s infinite' }} />
          <h2 style={{ fontSize: headingSize, color: '#EF4444', marginBottom: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {t('consequenceTitle')}
          </h2>
          <p style={{ fontSize: currentFontSize, color: 'rgba(234, 234, 234, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {t('consequenceText')}
          </p>
        </div>

        {/* The Shocking SMS Alert */}
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '2rem', borderRadius: '16px', borderLeft: '10px solid #EF4444', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: headingSize, fontWeight: 'bold', color: '#FFA0A0', lineHeight: '1.6' }}>
            {t('debitAlert')}
          </p>
        </div>

        {/* Recovery Solutions Section */}
        <div style={{ background: '#2C2C2C', padding: '3rem', borderRadius: '16px', border: '2px solid #3A3A3A' }}>
          <h4 style={{ color: '#10B981', fontSize: headingSize, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={36} /> {t('recoverySteps')}
          </h4>
          <ul style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <li style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <PhoneCall size={32} color="#3B82F6" style={{ marginTop: '4px' }} />
              <span>{t('recovery1')}</span>
            </li>
            <li style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <CreditCard size={32} color="#FF9F1C" style={{ marginTop: '4px' }} />
              <span>{t('recovery2')}</span>
            </li>
            <li style={{ fontSize: currentFontSize, display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <Globe size={32} color="#10B981" style={{ marginTop: '4px' }} />
              <span>{t('recovery3')}</span>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3.5rem' }}>
          <button className="btn btn-outline" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => { setStep(2); setRiskScore(null); setInputVal(''); }}>
            Try Another Scenario
          </button>
          <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => navigate('/banking')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  };'''
text = text.replace(s6_old, s6_new)

# Step 7
s7_old = '''  const renderStepSevenLinkDetection = () => {
    const data = getActiveData();
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: headingSize, marginBottom: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Which logic is safe? <ListenIcon text="Which logic is safe" />
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <button
            className="btn btn-outline"
            style={{ padding: '2rem', fontSize: currentFontSize, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => {
              handleNextStep(6);
            }}
          >
            <span style={{ color: '#EF4444' }}>{data.fakeLink}</span>
            <ExternalLink size={24} />
          </button>

          <button
            className="btn btn-outline"
            style={{ padding: '2rem', fontSize: currentFontSize, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => {
              handleNextStep(8);
            }}
          >
            <span style={{ color: '#10B981' }}>{data.realLink}</span>
            <ExternalLink size={24} />
          </button>
        </div>
      </div>
    );
  };'''
s7_new = '''  const renderStepSevenLinkDetection = () => {
    const data = getActiveData();
    const speakText = `Which logic is safe? Option 1: ${data.fakeLink}. Option 2: ${data.realLink}.`;
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <PageAudioButton text={speakText} />
        <h3 style={{ fontSize: headingSize, marginBottom: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Which logic is safe?
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <button
            className="btn btn-outline"
            style={{ padding: '2rem', fontSize: currentFontSize, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => {
              handleNextStep(6);
            }}
          >
            <span style={{ color: '#EF4444' }}>{data.fakeLink}</span>
            <ExternalLink size={24} />
          </button>

          <button
            className="btn btn-outline"
            style={{ padding: '2rem', fontSize: currentFontSize, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => {
              handleNextStep(8);
            }}
          >
            <span style={{ color: '#10B981' }}>{data.realLink}</span>
            <ExternalLink size={24} />
          </button>
        </div>
      </div>
    );
  };'''
text = text.replace(s7_old, s7_new)

# Step 8
s8_old = '''  const renderStepEightSafeResult = () => (
    <div className="glass-panel animate-fade-in" style={{ border: `5px solid #10B981`, padding: '4rem', textAlign: 'center' }}>
      <CheckCircle size={100} color="#10B981" style={{ margin: '0 auto 2rem' }} />
      <h2 style={{ fontSize: headingSize, color: '#10B981', marginBottom: '2rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {t('riskSafe')} <ListenIcon text={t('riskSafe')} />
      </h2>

      <p style={{ fontSize: currentFontSize, marginBottom: '3rem', lineHeight: '1.8', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {t('youSurvived')} <ListenIcon text={t('youSurvived')} />
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <button className="btn btn-outline" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => { setStep(2); setRiskScore(null); setInputVal(''); }}>
          Try Another Scenario
        </button>
        <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => navigate('/banking')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );'''
s8_new = '''  const renderStepEightSafeResult = () => {
    const speakText = `${t('riskSafe')}. ${t('youSurvived')}`;
    return (
      <div className="glass-panel animate-fade-in" style={{ border: `5px solid #10B981`, padding: '4rem', textAlign: 'center' }}>
        <PageAudioButton text={speakText} />
        <CheckCircle size={100} color="#10B981" style={{ margin: '0 auto 2rem' }} />
        <h2 style={{ fontSize: headingSize, color: '#10B981', marginBottom: '2rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {t('riskSafe')}
        </h2>

        <p style={{ fontSize: currentFontSize, marginBottom: '3rem', lineHeight: '1.8', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {t('youSurvived')}
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => { setStep(2); setRiskScore(null); setInputVal(''); }}>
            Try Another Scenario
          </button>
          <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: currentFontSize }} onClick={() => navigate('/banking')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  };'''
text = text.replace(s8_old, s8_new)


with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Replaced successfully')
