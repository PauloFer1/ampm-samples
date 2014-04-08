#include "cinder/app/AppNative.h"
#include "cinder/gl/gl.h"

#include "AMPMClient.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class ClientApp : public AppNative {
	AMPMClientRef mAMPM;
	Rectf infoRect, warnRect, errorRect, eventRect, crashRect;

  public:
	void setup();
	void mouseDown( MouseEvent event );	
	void keyDown( KeyEvent event );
	void update();
	void draw();
};

void ClientApp::setup()
{
	// ampm connection
	mAMPM = AMPMClient::create(3002, 3003);

	// fake buttons
	float width = 100.0f;
	float height = 40.0f;
	infoRect = Rectf(0, 0, width, height);
	warnRect = Rectf(infoRect.x2, 0, infoRect.x2 + width, height);
	errorRect = Rectf(warnRect.x2, 0, warnRect.x2 + width, height);
	eventRect = Rectf(errorRect.x2, 0, errorRect.x2 + width, height);
	crashRect = Rectf(eventRect.x2, 0, eventRect.x2 + width, height);
}

void ClientApp::mouseDown( MouseEvent event )
{
	// fake "buttons" to trigger events
	if (infoRect.contains(event.getPos()))
		LOG("testing info logging");
	if (warnRect.contains(event.getPos()))
		LOG_WARN("testing warn logging");
	if (errorRect.contains(event.getPos()))
		LOG_ERR("testing error logging");
	if (eventRect.contains(event.getPos()))
		AMPMClient::get()->sendEvent("category", "action", "label", 10);
	if (crashRect.contains(event.getPos()))
		quit();
}

void ClientApp::keyDown( KeyEvent event )
{
	if (event.getChar() == 'i')
		LOG("testing info logging");
	if (event.getChar() == 'w')
		LOG_WARN("testing warn logging");
	if (event.getChar() == 'e')
		LOG_ERR("testing error logging");
}

void ClientApp::update()
{
	// update the ampm connection
	mAMPM->update();
}

void ClientApp::draw()
{
	// clear out the window with black
	gl::clear( Color( 0, 0, 0 ) ); 
	gl::color(ColorA::white());

	// button triggers for events
	gl::drawStrokedRoundedRect(infoRect, 8.0f, 10);
	gl::drawStringCentered("info", infoRect.getCenter());
	gl::drawStrokedRoundedRect(warnRect, 8.0f, 10);
	gl::drawStringCentered("warn", warnRect.getCenter());
	gl::drawStrokedRoundedRect(errorRect, 8.0f, 10);
	gl::drawStringCentered("error", errorRect.getCenter());
	gl::drawStrokedRoundedRect(eventRect, 8.0f, 10);
	gl::drawStringCentered("event", eventRect.getCenter());
	gl::drawStrokedRoundedRect(crashRect, 8.0f, 10);
	gl::drawStringCentered("crash", crashRect.getCenter());
}

CINDER_APP_NATIVE( ClientApp, RendererGl )
