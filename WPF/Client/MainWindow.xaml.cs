using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using AmpmLib;

namespace Client
{
    public partial class MainWindow : Window
    {
        private List<object> _Leaks = new List<object>();

        public MainWindow()
        {
            InitializeComponent();

            if (AppState.Instance.Config != null)
            {
                _Config.Text = AppState.Instance.Config.ToString();
            }

            AppState.Instance.PropertyChanged += Instance_PropertyChanged;
            CompositionTarget.Rendering += CompositionTarget_Rendering;
        }

        void CompositionTarget_Rendering(object sender, EventArgs e)
        {
            if (AppState.Instance.SharedState == null)
            {
                return;
            }

            (_Dot.RenderTransform as TranslateTransform).X = (int)AppState.Instance.SharedState["x"] - _Dot.ActualWidth / 2;
            (_Dot.RenderTransform as TranslateTransform).Y = (int)AppState.Instance.SharedState["y"] - _Dot.ActualHeight / 2;
        }

        void Instance_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName != "SharedState" || AppState.Instance.SharedState == null)
            {
                return;
            }

            (_Dot.RenderTransform as TranslateTransform).X = (int)AppState.Instance.SharedState["x"] - _Dot.ActualWidth / 2;
            (_Dot.RenderTransform as TranslateTransform).Y = (int)AppState.Instance.SharedState["y"] - _Dot.ActualHeight / 2;
        }

        protected override void OnMouseMove(MouseEventArgs e)
        {
            Ampm.TcpEvent("mouse", new
            {
                x = e.GetPosition(_DotContainer).X,
                y = e.GetPosition(_DotContainer).Y,
            });

            base.OnMouseMove(e);
        }

        private void Hang_Click(object sender, RoutedEventArgs e)
        {
            while (true)
            {
            }
        }

        private void Log_Click(object sender, RoutedEventArgs e)
        {
            Ampm.Info("informational!");
            Ampm.Warning("warning!");
            Ampm.Error("error!");
        }

        private void Event_Click(object sender, RoutedEventArgs e)
        {
            Ampm.LogEvent("app event", "clicked", "button", 2);
        }

        private void Crash_Click(object sender, RoutedEventArgs e)
        {
            dynamic x = null;
            var y = x.bar;
        }

        private void Leak_Click(object sender, RoutedEventArgs e)
        {
            byte[] mem = new byte[1048576 * 100];
            _Leaks.Add(mem);
        }

        [DllImport("kernel32.dll")]
        public static extern bool SetProcessWorkingSetSize(IntPtr proc, int min, int max);

        private void GC_Click(object sender, RoutedEventArgs e)
        {
            _Leaks.Clear();
            GC.Collect();
            GC.WaitForPendingFinalizers();
            GC.Collect();
            GC.WaitForPendingFinalizers();
            SetProcessWorkingSetSize(System.Diagnostics.Process.GetCurrentProcess().Handle, -1, -1);
        }

        private void Slow_Click(object sender, RoutedEventArgs e)
        {
            Thread.Sleep(500);
        }
    }
}
