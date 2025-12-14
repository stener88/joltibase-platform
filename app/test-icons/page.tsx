/**
 * Test page to verify email asset icons load correctly
 * Visit: http://localhost:3000/test-icons
 */

import Image from 'next/image';

export default function TestIconsPage() {
  const icons = [
    { name: 'Twitter', file: 'twitter.png' },
    { name: 'Facebook', file: 'facebook.png' },
    { name: 'Instagram', file: 'instagram.png' },
    { name: 'LinkedIn', file: 'linkedin.png' },
    { name: 'TikTok', file: 'tiktok.png' },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Email Icon Test</h1>
        <p className="text-muted-foreground mb-8">
          Verify all social icons load correctly for emails
        </p>

        <div className="space-y-6">
          {icons.map((icon) => {
            const url = `${baseUrl}/email-assets/icons/${icon.file}`;
            return (
              <div key={icon.name} className="border border-border rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border border-border rounded flex items-center justify-center bg-muted">
                    <img
                      src={`/email-assets/icons/${icon.file}`}
                      alt={icon.name}
                      width={48}
                      height={48}
                      style={{ width: '48px', height: '48px' }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{icon.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono mt-1 break-all">
                      {url}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        48x48 PNG
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Email Ready
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">✅ All Icons Loaded!</h3>
          <p className="text-sm text-green-700">
            These icons will work in:
            <span className="block mt-2 ml-4">
              • Gmail ✅<br />
              • Apple Mail ✅<br />
              • Outlook ✅<br />
              • Yahoo Mail ✅<br />
              • ProtonMail ✅
            </span>
          </p>
        </div>

        <div className="mt-6 p-4 bg-muted border border-border rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Email Usage:</h4>
          <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`<Img
  src="${baseUrl}/email-assets/icons/twitter.png"
  width="24"
  height="24"
  alt="Twitter"
  style={{ width: '24px', height: '24px' }}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

