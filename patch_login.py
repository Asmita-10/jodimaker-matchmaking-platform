import re

with open('src/components/LoginView.tsx', 'r') as f:
    content = f.read()

# 1. Update state
state_search = "const [role, setRole] = useState<'admin' | 'candidate'>('admin');"
state_replace = """const [role, setRole] = useState<'admin' | 'candidate'>('candidate');
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Cmd + Shift + M (Mac) or Ctrl + Shift + M (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setShowAdminModal(true);
        // Auto-fill test admin credentials for easy demo access
        setAdminUsername('admin');
        setAdminPassword('password');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);"""
content = content.replace(state_search, state_replace)

# 2. Remove the Role Toggle Switch
toggle_pattern = re.compile(r'\{/\* Sleek Role Toggle Switch \*/\}.*?</div>\s*<div className="w-full">', re.DOTALL)
content = toggle_pattern.sub('<div className="w-full">', content)

# 3. Remove existing inline VIEW A (admin form)
view_a_pattern = re.compile(r'\{/\* ==========================================\s*VIEW A: MATCHMAKER ADMIN LOGIN VIEW\s*========================================== \*/\}\s*\{role === \'admin\' && \(\s*<div className="flex flex-col items-center">.*?</div>\s*\)\}', re.DOTALL)
content = view_a_pattern.sub('', content)

# 4. Remove `role === 'candidate' && ` conditions since there is no admin role inline anymore
content = content.replace("{role === 'candidate' && candidateMode === 'signin' && (", "{candidateMode === 'signin' && (")
content = content.replace("{role === 'candidate' && candidateMode === 'signup' && (", "{candidateMode === 'signup' && (")
content = content.replace("{role === 'candidate' && candidateMode === 'onboarding' && (", "{candidateMode === 'onboarding' && (")
content = content.replace("{role === 'candidate' && candidateMode === 'matches' && (", "{candidateMode === 'matches' && (")

# 5. Fix cardWidthClass logic
card_width_search = """const cardWidthClass = (role === 'candidate' && (candidateMode === 'onboarding' || candidateMode === 'matches'))"""
card_width_replace = """const cardWidthClass = ((candidateMode === 'onboarding' || candidateMode === 'matches'))"""
content = content.replace(card_width_search, card_width_replace)

# 6. Add Modal UI at the bottom before final closing tags
modal_ui = """
      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative">
            <button 
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold p-1"
            >
              ✕
            </button>
            <div className="flex flex-col items-center pt-2">
              <h2 className="text-lg font-black tracking-tight text-[#1e1b4b] flex items-center gap-1.5 font-sans">
                MatchMaker Admin Portal ✨
              </h2>
              <p className="text-slate-450 text-[9px] tracking-widest uppercase font-extrabold mt-0.5 mb-6">
                ACCESS CREDENTIALS REQUIRED
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleAdminSubmit(e);
              }} className="w-full space-y-3" autoComplete="off">
                {adminError && (
                  <div className="bg-[#fff1f2] border border-[#ffe4e6] text-[#f64d68] text-[11px] px-3.5 py-2.5 rounded-2xl text-center font-bold">
                    {adminError}
                  </div>
                )}

                <div>
                  <label className="block text-[#1e1b4b] text-xs font-bold tracking-wider mb-1.5 pl-4" htmlFor="admin-username-modal">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </span>
                    <input
                      id="admin-username-modal"
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full bg-[#eef2ff] border border-[#f0eae0] focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/40 rounded-full py-3.5 pl-10 pr-5 text-base font-semibold text-[#1e1b4b] placeholder-slate-400 focus:outline-none transition-all duration-300"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1e1b4b] text-xs font-bold tracking-wider mb-1.5 pl-4" htmlFor="admin-password-modal">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                    <input
                      id="admin-password-modal"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-[#eef2ff] border border-[#f0eae0] focus:border-[#f64d68]/40 focus:ring-2 focus:ring-[#f64d68]/40 rounded-full py-3.5 pl-10 pr-5 text-base font-semibold text-[#1e1b4b] placeholder-slate-400 focus:outline-none transition-all duration-300"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full bg-[#f64d68] hover:bg-[#e03d57] text-white font-bold text-sm py-3.5 px-5 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#f64d68]/40 transition-all duration-300 transform hover:scale-[1.01] flex justify-center items-center gap-2 mt-4 uppercase tracking-wider cursor-pointer"
                >
                  {adminLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'ACCESS DASHBOARD'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}"""

# Replace right before the final closing div
content = content.replace("    </div>\n  );\n}\n", modal_ui + "\n    </div>\n  );\n}\n")

with open('src/components/LoginView.tsx', 'w') as f:
    f.write(content)

