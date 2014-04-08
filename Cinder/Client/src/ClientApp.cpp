#include "cinder/app/AppNative.h"
#include "cinder/gl/gl.h"

#include "AMPMClient.h"

using namespace ci;
using namespace ci::app;
using namespace std;

class ClientApp : public AppNative {
	AMPMClientRef mAMPM;
  public:
	void setup();
	void mouseDown( MouseEvent event );	
	void keyDown( KeyEvent event );
	void update();
	void draw();
};

void ClientApp::setup()
{
	mAMPM = AMPMClient::create(3002, 3003);
}

void ClientApp::mouseDown( MouseEvent event )
{

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
	mAMPM->update();
}

void ClientApp::draw()
{
	// clear out the window with black
	gl::clear( Color( 0, 0, 0 ) ); 
}

CINDER_APP_NATIVE( ClientApp, RendererGl )
