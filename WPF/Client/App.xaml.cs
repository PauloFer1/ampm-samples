using System;
using System.Linq;
using System.Net;
using System.Web.Script.Serialization;
using System.Windows;
using System.Windows.Media;
using Ampm;
using Bespoke.Common.Osc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Client
{
    /// <summary>
    /// Example application to excercise the features of stimulant/ampm.
    /// </summary>
    public partial class App : Application
    {
        // Source object used when sending OSC messages.
        private static readonly IPEndPoint _MessageSource = new IPEndPoint(IPAddress.Loopback, 3003);

        // The OSC server to receive OSC messages.
        private static readonly OscServer _OscReceive = new OscServer(TransportType.Udp, IPAddress.Loopback, 3003) { FilterRegisteredMethods = false, ConsumeParsingExceptions = false };

        // The destination for OSC messages to the local node.js server.
        private static readonly IPEndPoint _OscSendLocal = new IPEndPoint(IPAddress.Loopback, 3002);

        // Class to create JSON for the server.
        private static readonly JavaScriptSerializer _Serializer = new JavaScriptSerializer();

        public App()
        {
            Startup += App_Startup;

            // Handle incoming OSC messages.
            _OscReceive.MessageReceived += Server_MessageReceived;
            _OscReceive.Start();

            // Send heartbeats every frame.
            CompositionTarget.Rendering += (sender, e) =>
            {
                SendMessage("heart");
                SendMessage("sharedState", AppState.Instance.SharedState);
            };

            // Log crashes.
            DispatcherUnhandledException += (sender, e) =>
            {
                Logger.Error(e.Exception.Message + Environment.NewLine + e.Exception.StackTrace);
                Application.Current.MainWindow.Close();
            };
            AppDomain.CurrentDomain.UnhandledException += (sender, e) =>
            {
                Exception exception = e.ExceptionObject as Exception;
                Logger.Error(exception == null ? e.ToString() : exception.Message + Environment.NewLine + exception.StackTrace);
                Application.Current.MainWindow.Close();
            };
        }

        // Parse the configuration argument.
        void App_Startup(object sender, StartupEventArgs e)
        {
            if (e.Args.Length > 0)
            {
                try
                {
                    AppState.Instance.Config = JObject.Parse(e.Args[0]);
                }
                catch
                {
#if DEBUG
                    throw;
#endif
                }
            }
        }

        private void SendMessage(string type, object message = null)
        {
            type = "/" + type;
            if (message == null)
            {
                new OscMessage(_MessageSource, type).Send(_OscSendLocal);
            }
            else
            {
                message = JsonConvert.SerializeObject(message);
                new OscMessage(_MessageSource, type, message).Send(_OscSendLocal);
            }
        }

        private void Server_MessageReceived(object sender, OscMessageReceivedEventArgs e)
        {
            string data = e.Message.Data.FirstOrDefault() as string;
            AppState.Instance.SharedState = data == null ? null : JObject.Parse(data);
        }
    }
}
