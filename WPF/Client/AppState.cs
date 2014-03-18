
using System.ComponentModel;
using Newtonsoft.Json.Linq;

namespace Client
{
    public class AppState : INotifyPropertyChanged
    {
        private static AppState _Instance;

        public static AppState Instance
        {
            get
            {
                if (_Instance == null)
                {
                    _Instance = new AppState();
                }

                return _Instance;
            }
        }

        private AppState()
        {
        }

        private JToken _Config;

        public JToken Config
        {
            get
            {
                return _Config;
            }

            set
            {
                _Config = value;
                if (PropertyChanged != null)
                {
                    PropertyChanged(this, new PropertyChangedEventArgs("Config"));
                }
            }
        }

        private JToken _SharedState;

        public JToken SharedState
        {
            get
            {
                return _SharedState;
            }

            set
            {
                _SharedState = value;
                if (PropertyChanged != null)
                {
                    PropertyChanged(this, new PropertyChangedEventArgs("SharedState"));
                }
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
    }
}
